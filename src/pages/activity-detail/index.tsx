import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { mockCurrentUser } from '@/data/mockData';
import { Activity } from '@/types';
import { useStore } from '@/store';
import { getStatusText, calculatePerPersonBudget, calculateTotalBudget } from '@/utils';
import Tag from '@/components/Tag';
import styles from './index.module.scss';

const ActivityDetailPage: React.FC = () => {
  const router = useRouter();
  const { getActivityById, hasSignedUp } = useStore();
  const activityId = router.params.id;

  const [activity, setActivity] = useState<Activity | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  const loadActivityData = () => {
    const found = getActivityById(activityId);
    if (found) {
      console.log('[ActivityDetail] Loaded activity:', found.id, found.title);
      console.log('[ActivityDetail] SignUps:', found.signUps.length, 'people');
      console.log('[ActivityDetail] Scripts:', found.scripts.length, 'scripts');
      console.log('[ActivityDetail] Votes:', Object.keys(found.votes).length, 'voters');
      setActivity(found);
      setIsJoined(hasSignedUp(activityId, mockCurrentUser.id));
      setIsCreator(found.creatorId === mockCurrentUser.id);
    } else {
      console.error('[ActivityDetail] Activity not found:', activityId);
    }
  };

  useEffect(() => {
    loadActivityData();
  }, [activityId, getActivityById, hasSignedUp]);

  useEffect(() => {
    const interval = setInterval(() => {
      const fresh = getActivityById(activityId);
      if (fresh && activity) {
        if (fresh.signUps.length !== activity.signUps.length ||
            Object.keys(fresh.votes).length !== Object.keys(activity.votes).length ||
            fresh.budgetItems.length !== activity.budgetItems.length) {
          console.log('[ActivityDetail] Activity updated, refreshing...');
          loadActivityData();
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activityId, getActivityById, activity]);

  const handleSignUp = () => {
    Taro.navigateTo({
      url: `/pages/signup/index?id=${activity?.id}`
    });
  };

  const handleGrouping = () => {
    Taro.navigateTo({
      url: `/pages/grouping/index?id=${activity?.id}`
    });
  };

  const handleBudget = () => {
    Taro.navigateTo({
      url: `/pages/budget/index?id=${activity?.id}`
    });
  };

  const handleVote = () => {
    Taro.navigateTo({
      url: `/pages/vote/index?id=${activity?.id}`
    });
  };

  if (!activity) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyText}>加载中...</Text>
        </View>
      </View>
    );
  }

  const totalBudget = calculateTotalBudget(activity.budgetItems);
  const perPersonBudget = calculatePerPersonBudget(activity.budgetItems, activity.currentMembers || 1);

  const actionItems = [
    { icon: '👥', label: '报名分组', action: handleGrouping },
    { icon: '💰', label: '预算明细', action: handleBudget },
    { icon: '🗳️', label: '投票定本', action: handleVote },
    { icon: '📢', label: '更多功能', action: () => {} }
  ];

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scrollContent}>
        <View className={styles.heroSection}>
          <Text className={styles.title}>{activity.title}</Text>
          <View className={styles.statusRow}>
            <Tag type={activity.status === 'recruiting' ? 'success' : activity.status === 'confirmed' ? 'primary' : 'default'}>
              {getStatusText(activity.status)}
            </Tag>
            <Text className={styles.creatorInfo}>{activity.creatorName || '未知'} 发起</Text>
          </View>
          <View className={styles.infoGrid}>
            <View className={styles.infoChip}>
              <Text>📍 {activity.targetCity}</Text>
            </View>
            <View className={styles.infoChip}>
              <Text>📅 {activity.days}天</Text>
            </View>
            <View className={styles.infoChip}>
              <Text>👥 {activity.currentMembers}/{activity.maxMembers}人</Text>
            </View>
            <View className={styles.infoChip}>
              <Text>💰 约{perPersonBudget}元/人</Text>
            </View>
          </View>
        </View>

        <View className={styles.content}>
          <View className={styles.dateCard}>
            <View className={styles.dateItem}>
              <Text className={styles.dateIcon}>🚀</Text>
              <View className={styles.dateInfo}>
                <Text className={styles.dateLabel}>出发日期</Text>
                <Text className={styles.dateValue}>{activity.startDate}</Text>
              </View>
            </View>
            <View className={styles.dateDivider} />
            <View className={styles.dateItem}>
              <Text className={styles.dateIcon}>🏠</Text>
              <View className={styles.dateInfo}>
                <Text className={styles.dateLabel}>返程日期</Text>
                <Text className={styles.dateValue}>{activity.endDate}</Text>
              </View>
            </View>
          </View>

          <View className={styles.card}>
            <Text className={styles.cardTitle}>
              <Text className={styles.cardTitleIcon}>📝</Text>
              活动介绍
            </Text>
            <Text className={styles.description}>{activity.description || '暂无活动介绍'}</Text>
          </View>

          <View className={styles.card}>
            <Text className={styles.cardTitle}>
              <Text className={styles.cardTitleIcon}>🏪</Text>
              目标店铺
            </Text>
            <View className={styles.shopInfo}>
              <Text className={styles.shopIcon}>🏠</Text>
              <Text className={styles.shopText}>{activity.targetShop || '待定'}</Text>
            </View>
          </View>

          <View className={styles.card}>
            <Text className={styles.cardTitle}>
              <Text className={styles.cardTitleIcon}>🎭</Text>
              备选剧本
            </Text>
            <View className={styles.scriptList}>
              {activity.scripts.length === 0 ? (
                <View className={styles.noScripts}>
                  <Text>暂无备选剧本</Text>
                </View>
              ) : (
                activity.scripts.map(script => (
                  <View key={script.id} className={styles.scriptItem}>
                    <Text className={styles.scriptName}>{script.name}</Text>
                    <View className={styles.scriptMeta}>
                      <Tag type="secondary" size="small">{script.type}</Tag>
                      <Tag type="default" size="small">{script.difficulty}</Tag>
                      <Tag type="default" size="small">{script.duration}</Tag>
                      <Tag type="default" size="small">{script.playerCount}</Tag>
                    </View>
                    <Text className={styles.scriptDesc}>{script.description}</Text>
                  </View>
                ))
              )}
            </View>
          </View>

          <View className={styles.card}>
            <View className={styles.memberHeader}>
              <Text className={styles.cardTitle}>
                <Text className={styles.cardTitleIcon}>👥</Text>
                报名成员
              </Text>
              <Text className={styles.memberCount}>
                <Text className={styles.memberHighlight}>{activity.currentMembers}</Text>
                /{activity.maxMembers}人
              </Text>
            </View>
            <View className={styles.memberAvatars}>
              {activity.signUps.length === 0 ? (
                <View className={styles.noMembers}>
                  <Text>暂无报名成员</Text>
                </View>
              ) : (
                  activity.signUps.map(signUp => (
                    <View key={signUp.userId} className={styles.memberItem}>
                      <Image 
                        className={styles.memberAvatar} 
                        src={signUp.userAvatar} 
                        mode="aspectFill" 
                      />
                      <Text className={styles.memberName}>{signUp.userName}</Text>
                    </View>
                  ))
                )}
            </View>
          </View>

          <View className={styles.card}>
            <Text className={styles.cardTitle}>
              <Text className={styles.cardTitleIcon}>⚡</Text>
              快捷操作
            </Text>
            <View className={styles.actionGrid}>
              {actionItems.map((item, index) => (
                <View key={index} className={styles.actionItem} onClick={item.action}>
                  <View className={styles.actionIcon}>
                    <Text>{item.icon}</Text>
                  </View>
                  <Text className={styles.actionLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.bottomSpacer} />
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button className={styles.secondaryBtn}>
          {isCreator ? '编辑活动' : '分享活动'}
        </Button>
        <Button className={styles.primaryBtn} onClick={handleSignUp}>
          {isJoined ? '已报名 · 查看详情' : '立即报名'}
        </Button>
      </View>
    </View>
  );
};

export default ActivityDetailPage;
