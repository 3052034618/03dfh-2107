import React, { useState, useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockCurrentUser, mockActivities, mockUserActivities } from '@/data/mockData';
import { Activity } from '@/types';
import { getStatusText } from '@/utils';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const [user] = useState(mockCurrentUser);
  const [activities] = useState<Activity[]>(mockActivities);

  const createdActivities = useMemo(() => {
    return activities.filter(a => mockUserActivities.created.includes(a.id));
  }, [activities]);

  const joinedActivities = useMemo(() => {
    return activities.filter(a => mockUserActivities.joined.includes(a.id));
  }, [activities]);

  const handleActivityClick = (id: string) => {
    Taro.navigateTo({
      url: `/pages/activity-detail/index?id=${id}`
    });
  };

  const menuItems = [
    { icon: '📝', title: '我发起的', desc: `${createdActivities.length}个活动`, action: () => {} },
    { icon: '🎯', title: '我参与的', desc: `${joinedActivities.length}个活动`, action: () => {} },
    { icon: '🏫', title: '我的校区', desc: user.campus, action: () => {} },
    { icon: '⚙️', title: '设置', desc: '通知、隐私等', action: () => {} }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.profile}>
          <Image className={styles.avatar} src={user.avatar} mode="aspectFill" />
          <View className={styles.profileInfo}>
            <Text className={styles.userName}>{user.name}</Text>
            <Text className={styles.schoolInfo}>🎓 {user.school} · {user.campus}</Text>
          </View>
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{createdActivities.length}</Text>
            <Text className={styles.statLabel}>发起活动</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{joinedActivities.length}</Text>
            <Text className={styles.statLabel}>参与活动</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>
              {joinedActivities.filter(a => a.status === 'completed').length}
            </Text>
            <Text className={styles.statLabel}>已成行</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>我的活动</Text>
            <Text className={styles.sectionMore}>查看全部 ›</Text>
          </View>
          <View className={styles.miniActivityList}>
            {joinedActivities.slice(0, 3).map(activity => (
              <View 
                key={activity.id} 
                className={styles.miniActivityItem}
                onClick={() => handleActivityClick(activity.id)}
              >
                <Text className={styles.miniActivityTitle}>{activity.title}</Text>
                <Text className={styles.miniActivityStatus}>{getStatusText(activity.status)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          {menuItems.map((item, index) => (
            <View 
              key={index} 
              className={styles.menuItem}
              onClick={item.action}
            >
              <View className={styles.menuIcon}>
                <Text>{item.icon}</Text>
              </View>
              <View className={styles.menuContent}>
                <Text className={styles.menuTitle}>{item.title}</Text>
                <Text className={styles.menuDesc}>{item.desc}</Text>
              </View>
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default MinePage;
