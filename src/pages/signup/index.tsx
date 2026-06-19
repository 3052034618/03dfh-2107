import React, { useState } from 'react';
import { View, Text, Input, Button, Switch } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { mockCurrentUser } from '@/data/mockData';
import styles from './index.module.scss';

const roleOptions = ['任意', '凶手位', '情感位', '硬核位', '恐怖位', '反串也可'];

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const [campus, setCampus] = useState(mockCurrentUser.campus);
  const [school, setSchool] = useState(mockCurrentUser.school);
  const [station, setStation] = useState('南京南站');
  const [budgetMin, setBudgetMin] = useState(400);
  const [budgetMax, setBudgetMax] = useState(800);
  const [canOvernight, setCanOvernight] = useState(true);
  const [needAccommodation, setNeedAccommodation] = useState(true);
  const [preferredRole, setPreferredRole] = useState('任意');

  const handleSubmit = () => {
    if (!campus.trim()) {
      Taro.showToast({ title: '请填写出发校区', icon: 'none' });
      return;
    }
    Taro.showToast({ title: '报名成功！', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const handleBudgetChange = (type: 'min' | 'max', value: string) => {
    const num = parseInt(value) || 0;
    if (type === 'min') {
      setBudgetMin(Math.min(num, budgetMax));
    } else {
      setBudgetMax(Math.max(num, budgetMin));
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.form}>
        <View className={styles.formSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>🏫</Text>
            <Text className={styles.sectionTitle}>出发信息</Text>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>所在学校</Text>
            <Input
              className={styles.formInput}
              placeholder="请输入学校名称"
              placeholderClass={styles.formInputPlaceholder}
              value={school}
              onInput={(e) => setSchool(e.detail.value)}
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>出发校区</Text>
            <Input
              className={styles.formInput}
              placeholder="如：东校区、仙林校区"
              placeholderClass={styles.formInputPlaceholder}
              value={campus}
              onInput={(e) => setCampus(e.detail.value)}
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>出发车站</Text>
            <Input
              className={styles.formInput}
              placeholder="如：南京南站"
              placeholderClass={styles.formInputPlaceholder}
              value={station}
              onInput={(e) => setStation(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>💰</Text>
            <Text className={styles.sectionTitle}>预算范围</Text>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>最低预算</Text>
            <Input
              type="number"
              className={styles.formInput}
              value={String(budgetMin)}
              onInput={(e) => handleBudgetChange('min', e.detail.value)}
            />
            <Text style={{ marginLeft: '8rpx', color: '#9CA3AF' }}>元</Text>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>最高预算</Text>
            <Input
              type="number"
              className={styles.formInput}
              value={String(budgetMax)}
              onInput={(e) => handleBudgetChange('max', e.detail.value)}
            />
            <Text style={{ marginLeft: '8rpx', color: '#9CA3AF' }}>元</Text>
          </View>
          <View className={styles.budgetRange}>
            <Text>预算区间：{budgetMin} - {budgetMax} 元</Text>
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>⭐</Text>
            <Text className={styles.sectionTitle}>个人偏好</Text>
          </View>
          <View className={styles.switchItem}>
            <View>
              <Text className={styles.switchLabel}>能接受熬夜场</Text>
              <Text className={styles.switchDesc}>是否可以打到凌晨</Text>
            </View>
            <Switch
              checked={canOvernight}
              onChange={(e) => setCanOvernight(e.detail.value)}
              color="#7C3AED"
            />
          </View>
          <View className={styles.switchItem}>
            <View>
              <Text className={styles.switchLabel}>需要拼住宿</Text>
              <Text className={styles.switchDesc}>是否需要安排酒店拼房</Text>
            </View>
            <Switch
              checked={needAccommodation}
              onChange={(e) => setNeedAccommodation(e.detail.value)}
              color="#7C3AED"
            />
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>🎭</Text>
            <Text className={styles.sectionTitle}>角色偏好</Text>
          </View>
          <View className={styles.roleOptions}>
            {roleOptions.map(role => (
              <View
                key={role}
                className={classnames(styles.roleOption, { [styles.active]: preferredRole === role })}
                onClick={() => setPreferredRole(role)}
              >
                <Text>{role}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.feeNote}>
          <Text>💡 提示：预算为预估费用，实际以AA为准。报名后团长会联系确认细节。</Text>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button className={styles.submitBtn} onClick={handleSubmit}>
          确认报名
        </Button>
      </View>
    </View>
  );
};

export default SignUpPage;
