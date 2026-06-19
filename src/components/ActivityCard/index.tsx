import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { Activity } from '@/types';
import { getStatusText, getStatusColor } from '@/utils';
import Tag from '@/components/Tag';
import styles from './index.module.scss';

interface ActivityCardProps {
  activity: Activity;
  className?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, className }) => {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/activity-detail/index?id=${activity.id}`
    });
  };

  return (
    <View className={classnames(styles.card, className)} onClick={handleClick}>
      <View className={styles.header}>
        <View className={styles.titleRow}>
          <Text className={styles.title}>{activity.title}</Text>
          <View 
            className={styles.statusBadge}
            style={{ backgroundColor: getStatusColor(activity.status) + '20', color: getStatusColor(activity.status) }}
          >
            <Text className={styles.statusText}>{getStatusText(activity.status)}</Text>
          </View>
        </View>
        <View className={styles.creatorRow}>
          <Image className={styles.creatorAvatar} src={activity.creatorAvatar} mode="aspectFill" />
          <Text className={styles.creatorName}>{activity.creatorName} 发起</Text>
        </View>
      </View>

      <View className={styles.infoRow}>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>目的地</Text>
          <Text className={styles.infoValue}>{activity.targetCity}</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>天数</Text>
          <Text className={styles.infoValue}>{activity.days}天</Text>
        </View>
        <View className={styles.infoItem}>
          <Text className={styles.infoLabel}>人数</Text>
          <Text className={styles.infoValue}>
            <Text className={styles.highlight}>{activity.currentMembers}</Text>
            /{activity.maxMembers}人
          </Text>
        </View>
      </View>

      <View className={styles.scriptTags}>
        {activity.scripts.slice(0, 3).map(script => (
          <Tag key={script.id} text={script.name} type="primary" size="small" />
        ))}
        {activity.scripts.length > 3 && (
          <Tag text={`+${activity.scripts.length - 3}`} type="default" size="small" />
        )}
      </View>

      <View className={styles.footer}>
        <Text className={styles.dateText}>📅 {activity.startDate} ~ {activity.endDate}</Text>
        <View className={styles.memberAvatars}>
          {activity.signUps.slice(0, 3).map((signUp, index) => (
            <Image 
              key={signUp.userId} 
              className={classnames(styles.memberAvatar, { [styles.first]: index === 0 })}
              src={signUp.userAvatar} 
              mode="aspectFill" 
            />
          ))}
          {activity.currentMembers > 3 && (
            <View className={classnames(styles.memberAvatar, styles.moreAvatar)}>
              <Text className={styles.moreText}>+{activity.currentMembers - 3}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ActivityCard;
