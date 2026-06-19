import React, { useState, useMemo } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useStore } from '@/store';
import { Activity } from '@/types';
import ActivityCard from '@/components/ActivityCard';
import styles from './index.module.scss';

type FilterType = 'all' | 'recruiting' | 'completed';

const HomePage: React.FC = () => {
  const { activities } = useStore();
  const [activeTab, setActiveTab] = useState<FilterType>('all');

  React.useEffect(() => {
    console.log('[Home] Activities updated, count:', activities.length);
  }, [activities]);

  const filteredActivities = useMemo(() => {
    if (activeTab === 'all') return activities;
    return activities.filter(a => a.status === activeTab);
  }, [activities, activeTab]);

  const handleCreate = () => {
    Taro.navigateTo({
      url: '/pages/create-activity/index'
    });
  };

  const handleTabChange = (tab: FilterType) => {
    setActiveTab(tab);
  };

  const handlePullDownRefresh = () => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };

  React.useEffect(() => {
    Taro.onPullDownRefresh(handlePullDownRefresh);
    return () => {
      Taro.offPullDownRefresh(handlePullDownRefresh);
    };
  }, []);

  const tabs: { key: FilterType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'recruiting', label: '招募中' },
    { key: 'completed', label: '已结束' }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.headerTop}>
          <View>
            <Text className={styles.title}>🎭 剧本杀约伴</Text>
            <Text className={styles.subtitle}>寒暑假跨城打本，费用AA超省心</Text>
          </View>
          <Button className={styles.createBtn} onClick={handleCreate}>
            + 创建活动
          </Button>
        </View>

        <View className={styles.filterTabs}>
          {tabs.map(tab => (
            <View
              key={tab.key}
              className={classnames(styles.tabItem, { [styles.active]: activeTab === tab.key })}
              onClick={() => handleTabChange(tab.key)}
            >
              <Text>{tab.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView scrollY className={styles.listContainer}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🎲</Text>
            <Text className={styles.emptyText}>暂无活动，快去创建一个吧～</Text>
          </View>
        )}
      </ScrollView>

      <View className={styles.floatingBtn} onClick={handleCreate}>
        <Text>+</Text>
      </View>
    </View>
  );
};

export default HomePage;
