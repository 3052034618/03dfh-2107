import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Textarea, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { mockCurrentUser } from '@/data/mockData';
import { Activity, VoteItem } from '@/types';
import { useStore } from '@/store';
import { calculateScriptScores, getBestScriptRecommendation } from '@/utils';
import styles from './index.module.scss';

interface ScriptVoteState {
  score: number;
  redFlags: string;
}

const VotePage: React.FC = () => {
  const router = useRouter();
  const { getActivityById, submitVote, getUserVote } = useStore();
  const activityId = router.params.id;

  const [activity, setActivity] = useState<Activity | null>(null);
  const [votes, setVotes] = useState<{ [scriptId: string]: ScriptVoteState }>({});
  const [submitting, setSubmitting] = useState(false);

  const loadActivityData = () => {
    const act = getActivityById(activityId);
    if (act) {
      console.log('[Vote] Activity loaded:', act.id, 'scripts:', act.scripts.length);
      setActivity(act);

      const initialVotes: { [scriptId: string]: ScriptVoteState } = {};
      act.scripts.forEach(script => {
        initialVotes[script.id] = { score: 0, redFlags: '' };
      });

      const userVote = getUserVote(activityId, mockCurrentUser.id);
      if (userVote) {
        console.log('[Vote] Found existing user vote:', userVote.length, 'scripts');
        userVote.forEach(v => {
          if (initialVotes[v.scriptId]) {
            initialVotes[v.scriptId] = {
              score: v.score,
              redFlags: v.redFlags
            };
          }
        });
      }

      setVotes(initialVotes);
    } else {
      console.error('[Vote] Activity not found:', activityId);
    }
  };

  useEffect(() => {
    loadActivityData();
  }, [activityId, getActivityById, getUserVote]);

  useEffect(() => {
    const interval = setInterval(() => {
      const freshActivity = getActivityById(activityId);
      if (freshActivity && activity) {
        if (Object.keys(freshActivity.votes).length !== Object.keys(activity.votes).length) {
          console.log('[Vote] Votes updated, refreshing...');
          setActivity(freshActivity);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activityId, getActivityById, activity]);

  const scriptScores = useMemo(() => {
    if (!activity) return [];
    return calculateScriptScores(activity.scripts, activity.votes);
  }, [activity]);

  const recommendation = useMemo(() => {
    if (!activity) return null;
    return getBestScriptRecommendation(scriptScores, activity.currentMembers);
  }, [scriptScores, activity]);

  const handleScoreChange = (scriptId: string, score: number) => {
    console.log('[Vote] Score changed for script', scriptId, ':', score);
    setVotes(prev => ({
      ...prev,
      [scriptId]: {
        ...prev[scriptId],
        score
      }
    }));
  };

  const handleRedFlagsChange = (scriptId: string, value: string) => {
    setVotes(prev => ({
      ...prev,
      [scriptId]: {
        ...prev[scriptId],
        redFlags: value
      }
    }));
  };

  const handleSubmit = () => {
    if (submitting) return;

    const allScored = Object.values(votes).every(v => v.score > 0);
    if (!allScored) {
      Taro.showToast({ title: '请为所有剧本打分', icon: 'none' });
      return;
    }

    setSubmitting(true);

    try {
      const voteItems: VoteItem[] = Object.entries(votes).map(([scriptId, v]) => ({
        scriptId,
        score: v.score,
        redFlags: v.redFlags || '无'
      }));

      submitVote(activityId, voteItems);

      console.log('[Vote] Vote submitted successfully for activity:', activityId);

      loadActivityData();

      Taro.showToast({ 
        title: '投票成功！', 
        icon: 'success',
        duration: 1500
      });

      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (error) {
      console.error('[Vote] Failed to submit vote:', error);
      Taro.showToast({ title: '提交失败，请重试', icon: 'none' });
      setSubmitting(false);
    }
  };

  const renderStars = (scriptId: string, currentScore: number) => {
    return (
      <View className={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(star => (
          <Text
            key={star}
            className={classnames(styles.star, { [styles.active]: star <= currentScore })}
            onClick={() => handleScoreChange(scriptId, star)}
          >
            ★
          </Text>
        ))}
      </View>
    );
  };

  if (!activity) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🗳️</Text>
          <Text className={styles.emptyText}>加载中...</Text>
        </View>
      </View>
    );
  }

  const totalVoters = Object.keys(activity.votes).length;
  const hasVoted = !!getUserVote(activityId, mockCurrentUser.id);

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scrollContent}>
        {recommendation && (
          <View className={styles.recommendationCard}>
            <Text className={styles.recommendationLabel}>🏆 最佳成局方案</Text>
            <Text className={styles.recommendationTitle}>{recommendation.script.name}</Text>
            <Text className={styles.recommendationReason}>{recommendation.reason}</Text>
            <View className={styles.recommendationBadge}>
              <Text>智能推荐</Text>
            </View>
          </View>
        )}

        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <Text className={styles.statNumber}>{activity.scripts.length}</Text>
            <Text className={styles.statLabel}>备选剧本</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNumber}>{totalVoters}</Text>
            <Text className={styles.statLabel}>已投票</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNumber}>{activity.currentMembers}</Text>
            <Text className={styles.statLabel}>总人数</Text>
          </View>
        </View>

        {hasVoted && (
          <View className={styles.votedHint}>
            <Text className={styles.votedIcon}>✅</Text>
            <Text className={styles.votedText}>您已投票，可以修改后重新提交</Text>
          </View>
        )}

        <Text className={styles.sectionTitle}>
          <Text className={styles.sectionIcon}>🗳️</Text>
          为剧本打分（点击星星）
        </Text>

        <View className={styles.scriptList}>
          {scriptScores.map(({ script, avgScore, voteCount, redFlags }, index) => (
            <View key={script.id} className={styles.scriptCard}>
              <View className={styles.scriptHeader}>
                <View>
                  <Text className={styles.scriptName}>{script.name}</Text>
                  <View className={styles.voteStats}>
                    <Text className={styles.voteCount}>📊 平均分：{avgScore > 0 ? avgScore.toFixed(1) : '暂无'}</Text>
                    <Text>({voteCount}人投票)</Text>
                  </View>
                </View>
                <Text className={styles.scriptScore}>
                  {votes[script.id]?.score || '?'}
                  <Text style={{ fontSize: '24rpx', color: '#9CA3AF' }}>/5</Text>
                </Text>
              </View>

              <View className={styles.scriptMeta}>
                <Text className={styles.metaTag}>{script.type}</Text>
                <Text className={styles.metaTag}>{script.difficulty}</Text>
                <Text className={styles.metaTag}>{script.duration}</Text>
                <Text className={styles.metaTag}>{script.playerCount}</Text>
              </View>

              <Text className={styles.scriptDesc}>{script.description}</Text>

              {redFlags.length > 0 && (
                <View className={styles.redFlagList}>
                  {redFlags.slice(0, 3).map((flag, i) => (
                    <View key={i} className={styles.redFlagItem}>
                      <Text className={styles.redFlagIcon}>⚠️</Text>
                      <Text className={styles.redFlagText}>{flag}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View className={styles.ratingSection}>
                <Text className={styles.ratingLabel}>我的评分</Text>
                {renderStars(script.id, votes[script.id]?.score || 0)}

                <View className={styles.redFlagSection}>
                  <Text className={styles.redFlagLabel}>雷点说明（选填）</Text>
                  <Textarea
                    className={styles.redFlagInput}
                    placeholder="说说你不想玩的点，比如：怕恐怖、不喜欢情感本..."
                    placeholderStyle="color: #9CA3AF"
                    value={votes[script.id]?.redFlags || ''}
                    onInput={(e) => handleRedFlagsChange(script.id, e.detail.value)}
                    maxlength={100}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        <View className={styles.bottomSpacer} />
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button className={styles.submitBtn} onClick={handleSubmit}>
          {hasVoted ? '更新投票' : '提交投票'}
        </Button>
      </View>
    </View>
  );
};

export default VotePage;
