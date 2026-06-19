import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { mockActivities } from '@/data/mockData';
import { Activity, BudgetItem } from '@/types';
import { calculateTotalBudget, calculatePerPersonBudget, BUDGET_CATEGORY_LABELS } from '@/utils';
import styles from './index.module.scss';

const categoryIcons: Record<string, string> = {
  transport: '🚄',
  accommodation: '🏨',
  ticket: '🎫',
  taxi: '🚕',
  meal: '🍜',
  other: '📦'
};

const BudgetPage: React.FC = () => {
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);

  useEffect(() => {
    const id = router.params.id;
    const found = mockActivities.find(a => a.id === id);
    if (found) {
      setActivity(found);
      setBudgetItems(found.budgetItems);
    }
  }, [router.params.id]);

  const totalBudget = useMemo(() => calculateTotalBudget(budgetItems), [budgetItems]);
  const perPersonBudget = useMemo(
    () => calculatePerPersonBudget(budgetItems, activity?.currentMembers || 1),
    [budgetItems, activity]
  );

  const groupedItems = useMemo(() => {
    const groups: { [key: string]: BudgetItem[] } = {};
    budgetItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [budgetItems]);

  const handleEditItem = (itemId: string) => {
    // 编辑预算项功能
  };

  const handleAddItem = () => {
    // 添加预算项功能
  };

  const handleExport = () => {
    // 导出账单功能
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
        <Text className={styles.summaryTitle}>💰 总预算</Text>
        <Text className={styles.totalAmount}>¥ {totalBudget}</Text>
        <View className={styles.perPersonRow}>
          <View className={styles.perPersonItem}>
            <Text className={styles.perPersonLabel}>人均费用</Text>
            <Text className={styles.perPersonValue}>¥{perPersonBudget}</Text>
          </View>
          <View className={styles.perPersonItem}>
            <Text className={styles.perPersonLabel}>参与人数</Text>
            <Text className={styles.perPersonValue}>{activity.currentMembers}人</Text>
          </View>
          <View className={styles.perPersonItem}>
            <Text className={styles.perPersonLabel}>费用项目</Text>
            <Text className={styles.perPersonValue}>{budgetItems.length}项</Text>
          </View>
        </View>
      </View>

      {Object.entries(groupedItems).map(([category, items]) => (
        <View key={category} className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>{categoryIcons[category] || '📦'}</Text>
              {BUDGET_CATEGORY_LABELS[category as keyof typeof BUDGET_CATEGORY_LABELS] || category}
            </Text>
            <Text className={styles.sectionCount}>{items.length}项</Text>
          </View>
          {items.map(item => (
            <View key={item.id} className={styles.budgetItem}>
              <View className={styles.itemIcon}>
                <Text>{categoryIcons[item.category] || '📦'}</Text>
              </View>
              <View className={styles.itemInfo}>
                <Text className={styles.itemName}>{item.name}</Text>
                {item.note && <Text className={styles.itemNote}>{item.note}</Text>}
              </View>
              <View className={styles.itemRight}>
                <Text className={styles.itemAmount}>¥{item.amount}</Text>
                <Text className={styles.editBtn} onClick={() => handleEditItem(item.id)}>
                  编辑
                </Text>
              </View>
            </View>
          ))}
        </View>
      ))}

      <View className={styles.section}>
        <View className={styles.addItemBtn} onClick={handleAddItem}>
          <Text>+ 添加费用项</Text>
        </View>
      </View>

      <View className={styles.memberSection}>
        <View className={styles.memberHeader}>
          <Text className={styles.memberTitle}>👥 费用分摊</Text>
        </View>
        <View className={styles.memberList}>
          {activity.signUps.map(signUp => (
            <View key={signUp.userId} className={styles.memberItem}>
              <Image className={styles.memberAvatar} src={signUp.userAvatar} mode="aspectFill" />
              <Text className={styles.memberName}>{signUp.userName}</Text>
              <Text className={styles.memberShare}>¥{perPersonBudget}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button className={styles.secondaryBtn} onClick={handleExport}>
          导出账单
        </Button>
        <Button className={styles.primaryBtn}>
          保存预算
        </Button>
      </View>
    </View>
  );
};

export default BudgetPage;
