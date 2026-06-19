import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { mockActivities } from '@/data/mockData';
import { Activity, SignUpInfo, GroupedSignUps } from '@/types';
import { groupSignUps } from '@/utils';
import styles from './index.module.scss';

type TabType = 'campus' | 'station' | 'accommodation';

const GroupingPage: React.FC = () => {
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('campus');

  useEffect(() => {
    const id = router.params.id;
    const found = mockActivities.find(a => a.id === id);
    if (found) {
      setActivity(found);
    }
  }, [router.params.id]);

  const groupedData = useMemo((): GroupedSignUps | null => {
    if (!activity) return null;
    return groupSignUps(activity.signUps);
  }, [activity]);

  const tabs: { key: TabType; label: string }[] = [
    { key: 'campus', label: '按校区' },
    { key: 'station', label: '按车站' },
    { key: 'accommodation', label: '住宿情况' }
  ];

  const renderMemberItem = (signUp: SignUpInfo) => (
    <View key={signUp.userId} className={styles.memberItem}>
      <Image className={styles.memberAvatar} src={signUp.userAvatar} mode="aspectFill" />
      <View className={styles.memberInfo}>
        <Text className={styles.memberName}>{signUp.userName}</Text>
        <View className={styles.memberMeta}>
          <Text className={styles.memberTag}>{signUp.school}</Text>
          <Text className={styles.memberTag}>{signUp.campus}</Text>
          {signUp.canOvernight && (
            <Text className={styles.memberTag} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
              可熬夜
            </Text>
          )}
        </View>
      </View>
      <View className={styles.rightSection}>
        <Text className={styles.budgetText}>¥{signUp.budgetMin}-{signUp.budgetMax}</Text>
        <Text className={styles.timeText}>{signUp.preferredRole}</Text>
      </View>
    </View>
  );

  const renderByCampus = () => {
    if (!groupedData) return null;
    const entries = Object.entries(groupedData.byCampus);
    return entries.map(([campus, members]) => (
      <View key={campus} className={styles.groupCard}>
        <View className={styles.groupHeader}>
          <Text className={styles.groupTitle}>🏫 {campus}</Text>
          <Text className={styles.groupCount}>{members.length}人</Text>
        </View>
        <View className={styles.memberList}>
          {members.map(renderMemberItem)}
        </View>
      </View>
    ));
  };

  const renderByStation = () => {
    if (!groupedData) return null;
    const entries = Object.entries(groupedData.byStation);
    return entries.map(([station, members]) => (
      <View key={station} className={styles.groupCard}>
        <View className={styles.groupHeader}>
          <Text className={styles.groupTitle}>🚄 {station}</Text>
          <Text className={styles.groupCount}>{members.length}人</Text>
        </View>
        <View className={styles.memberList}>
          {members.map(renderMemberItem)}
        </View>
      </View>
    ));
  };

  const renderByAccommodation = () => {
    if (!groupedData) return null;
    const needAccommodation = activity?.signUps.filter(s => s.needAccommodation) || [];
    const noAccommodation = groupedData.noAccommodation;

    return (
      <>
        <View className={styles.groupCard}>
          <View className={styles.groupHeader}>
            <Text className={styles.groupTitle}>🏨 需要拼住宿</Text>
            <Text className={styles.groupCount}>{needAccommodation.length}人</Text>
          </View>
          <View className={styles.memberList}>
            {needAccommodation.map(renderMemberItem)}
          </View>
        </View>
        <View className={styles.groupCard}>
          <View className={styles.groupHeader}>
            <Text className={styles.groupTitle}>🚶 只打本不住宿</Text>
            <Text className={styles.groupCount}>{noAccommodation.length}人</Text>
          </View>
          <View className={styles.memberList}>
            {noAccommodation.length > 0 ? (
              noAccommodation.map(renderMemberItem)
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyText}>暂无不住宿的成员</Text>
              </View>
            )}
          </View>
        </View>
      </>
    );
  };

  if (!activity) {
    return (
      <View className={styles.page}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.summaryCard}>
        <Text className={styles.summaryTitle}>📊 报名统计</Text>
        <View className={styles.summaryStats}>
          <View className={styles.summaryStat}>
            <Text className={styles.statNumber}>{activity.currentMembers}</Text>
            <Text className={styles.statLabel}>总报名人数</Text>
          </View>
          <View className={styles.summaryStat}>
            <Text className={styles.statNumber}>
              {activity.signUps.filter(s => s.needAccommodation).length}
            </Text>
            <Text className={styles.statLabel}>需住宿</Text>
          </View>
          <View className={styles.summaryStat}>
            <Text className={styles.statNumber}>
              {activity.signUps.filter(s => s.canOvernight).length}
            </Text>
            <Text className={styles.statLabel}>可熬夜</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabs}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, { [styles.active]: activeTab === tab.key })}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.content}>
        {activeTab === 'campus' && renderByCampus()}
        {activeTab === 'station' && renderByStation()}
        {activeTab === 'accommodation' && renderByAccommodation()}
      </View>
    </View>
  );
};

export default GroupingPage;
