import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { mockActivities, mockCurrentUser } from '@/data/mockData';
import { Activity } from '@/types';
import { getStatusText, calculatePerPersonBudget, calculateTotalBudget } from '@/utils';
import styles from './index.module.scss';

const ActivityDetailPage: React.FC = () => {
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const id = router.params.id;
    const found = mockActivities.find(a => a.id === id);
    if (found) {
      setActivity(found);
      setIsJoined(found.signUps.some(s => s.userId === mockCurrentUser.id));
      setIsCreator(found.creatorId === mockCurrentUser.id);
    }
  }, [router.params.id]);

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
        <Text>加载中...</Text>
      </View>
    );
  }

  const totalBudget = calculateTotalBudget(activity.budgetItems);
  const perPersonBudget = calculatePerPersonBudget(activity.budgetItems, activity.currentMembers);

  const actionItems = [
    { icon: '👥', label: '报名分组', action: handleGrouping },
    { icon: '💰', label: '预算明细', action: handleBudget },
    { icon: '🗳️', label: '投票定本', action: handleVote },
    { icon: '📢', label: '更多功能', action: () => {} }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.heroSection}>
        <Text className={styles.title}>{activity.title}</Text>
        <View className={styles.statusRow}>
          <View className={styles.statusBadge}>
            <Text>{getStatusText(activity.status)}</Text>
          </View>
          <Text className={styles.creatorInfo}>{activity.creatorName} 发起</Text>
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
        <View className={styles.card}>
          <Text className={styles.cardTitle}>
            <Text className={styles.cardTitleIcon}>📝</Text>
            活动介绍
          </Text>
          <Text className={styles.description}>{activity.description}</Text>
        </View>

        <View className={styles.card}>
          <Text className={styles.cardTitle}>
            <Text className={styles.cardTitleIcon}>🏪</Text>
            目标店铺
          </Text>
          <View className={styles.shopInfo}>
            <Text className={styles.shopIcon}>🏠</Text>
            <Text className={styles.shopText}>{activity.targetShop}</Text>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.cardTitle}>
            <Text className={styles.cardTitleIcon}>🎭</Text>
            备选剧本
          </Text>
          <View className={styles.scriptList}>
            {activity.scripts.map(script => (
              <View key={script.id} className={styles.scriptItem}>
                <Text className={styles.scriptName}>{script.name}</Text>
                <View className={styles.scriptMeta}>
                  <Text>{script.type}</Text>
                  <Text>{script.difficulty}</Text>
                  <Text>{script.duration}</Text>
                  <Text>{script.playerCount}</Text>
                </View>
                <Text className={styles.scriptDesc}>{script.description}</Text>
              </View>
            ))}
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
            {activity.signUps.map(signUp => (
              <View key={signUp.userId} className={styles.memberItem}>
                <Image 
                  className={styles.memberAvatar} 
                  src={signUp.userAvatar} 
                  mode="aspectFill" 
                />
                <Text className={styles.memberName}>{signUp.userName}</Text>
              </View>
            ))}
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
