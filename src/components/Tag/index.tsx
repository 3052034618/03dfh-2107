import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface TagProps {
  text: string;
  type?: 'primary' | 'success' | 'warning' | 'error' | 'default' | 'secondary';
  size?: 'small' | 'medium';
  className?: string;
}

const Tag: React.FC<TagProps> = ({ text, type = 'default', size = 'small', className }) => {
  return (
    <View className={classnames(styles.tag, styles[type], styles[size], className)}>
      <Text className={styles.text}>{text}</Text>
    </View>
  );
};

export default Tag;
