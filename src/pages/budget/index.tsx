import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, Button, Input, Textarea, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import { useStore } from '@/store';
import { BudgetItem } from '@/types';
import { calculateTotalBudget, calculatePerPersonBudget, BUDGET_CATEGORY_LABELS, generateId } from '@/utils';
import styles from './index.module.scss';

const categoryIcons: Record<string, string> = {
  transport: '🚄',
  accommodation: '🏨',
  ticket: '🎫',
  taxi: '🚕',
  meal: '🍜',
  other: '📦'
};

interface EditingState {
  itemId: string;
  name: string;
  amount: string;
  note: string;
}

interface AddItemState {
  show: boolean;
  name: string;
  amount: string;
  category: BudgetItem['category'];
  note: string;
}

const BudgetPage: React.FC = () => {
  const router = useRouter();
  const { getActivityById, updateBudgetItems, addBudgetItem } = useStore();
  const activityId = router.params.id;

  const [activity, setActivity] = useState(() => getActivityById(activityId) || null);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [editingItem, setEditingItem] = useState<EditingState | null>(null);
  const [addingItem, setAddingItem] = useState<AddItemState>({
    show: false,
    name: '',
    amount: '',
    category: 'other',
    note: ''
  });

  useEffect(() => {
    const act = getActivityById(activityId);
    if (act) {
      console.log('[Budget] Activity loaded:', act.id, 'budget items:', act.budgetItems?.length || 0);
      
      let safeBudgetItems: BudgetItem[] = [];
      if (Array.isArray(act.budgetItems) && act.budgetItems.length > 0) {
        safeBudgetItems = act.budgetItems.map(item => ({
          id: item.id || generateId(),
          name: item.name || '未命名',
          amount: typeof item.amount === 'number' ? item.amount : 0,
          category: item.category || 'other',
          note: item.note || ''
        }));
      } else {
        console.log('[Budget] No budget items, initializing defaults');
        safeBudgetItems = [
          { id: generateId(), name: '交通车票', amount: 0, category: 'transport', note: '' },
          { id: generateId(), name: '酒店住宿', amount: 0, category: 'accommodation', note: '' },
          { id: generateId(), name: '剧本门票', amount: 0, category: 'ticket', note: '' },
          { id: generateId(), name: '打车费用', amount: 0, category: 'taxi', note: '' },
          { id: generateId(), name: '聚餐餐费', amount: 0, category: 'meal', note: '' }
        ];
      }
      
      console.log('[Budget] Safe budget items prepared:', safeBudgetItems.length, 'items');
      setActivity(act);
      setBudgetItems(safeBudgetItems);
    } else {
      console.error('[Budget] Activity not found:', activityId);
    }
  }, [activityId, getActivityById]);

  const totalBudget = useMemo(() => {
    return calculateTotalBudget(budgetItems);
  }, [budgetItems]);

  const perPersonBudget = useMemo(() => {
    const memberCount = activity?.currentMembers || 1;
    return calculatePerPersonBudget(budgetItems, memberCount);
  }, [budgetItems, activity]);

  const groupedItems = useMemo(() => {
    const groups: { [key: string]: BudgetItem[] } = {};
    budgetItems.forEach(item => {
      const category = item.category || 'other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    return groups;
  }, [budgetItems]);

  const handleEditItem = (item: BudgetItem) => {
    setEditingItem({
      itemId: item.id,
      name: item.name,
      amount: String(item.amount),
      note: item.note || ''
    });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    
    const amount = parseFloat(editingItem.amount);
    if (isNaN(amount) || amount < 0) {
      Taro.showToast({ title: '请输入有效金额', icon: 'none' });
      return;
    }

    setBudgetItems(prev => prev.map(item =>
      item.id === editingItem.itemId
        ? { ...item, name: editingItem.name, amount, note: editingItem.note }
        : item
    ));

    setEditingItem(null);
    Taro.showToast({ title: '已修改', icon: 'success' });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleAddItem = () => {
    setAddingItem(prev => ({ ...prev, show: true }));
  };

  const handleSaveAddItem = () => {
    const amount = parseFloat(addingItem.amount);
    if (!addingItem.name.trim()) {
      Taro.showToast({ title: '请输入费用名称', icon: 'none' });
      return;
    }
    if (isNaN(amount) || amount < 0) {
      Taro.showToast({ title: '请输入有效金额', icon: 'none' });
      return;
    }

    const newItem: BudgetItem = {
      id: generateId(),
      name: addingItem.name,
      amount,
      category: addingItem.category,
      note: addingItem.note
    };

    setBudgetItems(prev => [...prev, newItem]);

    setAddingItem({
      show: false,
      name: '',
      amount: '',
      category: 'other',
      note: ''
    });

    Taro.showToast({ title: '已添加', icon: 'success' });
  };

  const handleCancelAdd = () => {
    setAddingItem({
      show: false,
      name: '',
      amount: '',
      category: 'other',
      note: ''
    });
  };

  const handleDeleteItem = (itemId: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这个费用项吗？',
      success: (res) => {
        if (res.confirm) {
          setBudgetItems(prev => prev.filter(item => item.id !== itemId));
          Taro.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  };

  const handleSave = () => {
    if (!activityId) return;

    updateBudgetItems(activityId, budgetItems);

    Taro.showToast({
      title: '预算已保存',
      icon: 'success',
      duration: 1500
    });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1000);
  };

  const handleExport = () => {
    const lines = ['📋 费用明细清单', ''];
    Object.entries(groupedItems).forEach(([category, items]) => {
      const categoryLabel = BUDGET_CATEGORY_LABELS[category as keyof typeof BUDGET_CATEGORY_LABELS] || category;
      lines.push(`【${categoryLabel}】`);
      items.forEach(item => {
        lines.push(`  ${item.name}: ¥${item.amount}${item.note ? ` (${item.note})` : ''}`);
      });
      const categoryTotal = items.reduce((sum, i) => sum + i.amount, 0);
      lines.push(`  小计: ¥${categoryTotal}`);
      lines.push('');
    });
    lines.push(`💰 总预算: ¥${totalBudget}`);
    lines.push(`👤 人均费用: ¥${perPersonBudget}`);
    lines.push(`👥 参与人数: ${activity?.currentMembers || 0}人`);

    Taro.setClipboardData({
      data: lines.join('\n'),
      success: () => {
        Taro.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  };

  const getCategoryLabel = (category: string) => {
    return BUDGET_CATEGORY_LABELS[category as keyof typeof BUDGET_CATEGORY_LABELS] || category || '其他';
  };

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || '📦';
  };

  if (!activity) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📊</Text>
          <Text className={styles.emptyText}>活动数据加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scrollContent}>
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

        {Object.entries(groupedItems).length === 0 ? (
          <View className={styles.emptySection}>
            <Text className={styles.emptyIcon2}>📝</Text>
            <Text className={styles.emptyText2}>暂无费用项，点击下方添加</Text>
          </View>
        ) : (
          Object.entries(groupedItems).map(([category, items]) => (
            <View key={category} className={styles.section}>
              <View className={styles.sectionHeader}>
                <Text className={styles.sectionTitle}>
                  <Text className={styles.sectionIcon}>{getCategoryIcon(category)}</Text>
                  {getCategoryLabel(category)}
                </Text>
                <Text className={styles.sectionCount}>{items.length}项 · ¥{items.reduce((s, i) => s + i.amount, 0)}</Text>
              </View>
              {items.map(item => (
                <View key={item.id} className={styles.budgetItem}>
                  {editingItem?.itemId === item.id ? (
                    <View className={styles.editForm}>
                      <Input
                        className={styles.editInput}
                        placeholder="费用名称"
                        value={editingItem.name}
                        onInput={(e) => setEditingItem({ ...editingItem, name: e.detail.value })}
                      />
                      <View className={styles.editRow}>
                        <Text className={styles.editLabel}>金额：¥</Text>
                        <Input
                          className={styles.editAmountInput}
                          type="digit"
                          placeholder="0"
                          value={editingItem.amount}
                          onInput={(e) => setEditingItem({ ...editingItem, amount: e.detail.value })}
                        />
                      </View>
                      <Textarea
                        className={styles.editTextarea}
                        placeholder="备注（选填）"
                        value={editingItem.note}
                        onInput={(e) => setEditingItem({ ...editingItem, note: e.detail.value })}
                      />
                      <View className={styles.editActions}>
                        <Text className={styles.cancelBtn} onClick={handleCancelEdit}>取消</Text>
                        <Text className={styles.saveBtn} onClick={handleSaveEdit}>保存</Text>
                      </View>
                    </View>
                  ) : (
                    <>
                      <View className={styles.itemIcon}>
                        <Text>{getCategoryIcon(item.category)}</Text>
                      </View>
                      <View className={styles.itemInfo}>
                        <Text className={styles.itemName}>{item.name || '未命名'}</Text>
                        {item.note && <Text className={styles.itemNote}>{item.note}</Text>}
                      </View>
                      <View className={styles.itemRight}>
                        <Text className={styles.itemAmount}>¥{item.amount}</Text>
                        <View className={styles.itemActions}>
                          <Text className={styles.editBtn} onClick={() => handleEditItem(item)}>编辑</Text>
                          <Text className={styles.deleteBtn} onClick={() => handleDeleteItem(item.id)}>删除</Text>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              ))}
            </View>
          ))
        )}

        {addingItem.show ? (
          <View className={styles.section}>
            <View className={styles.addForm}>
              <Text className={styles.addFormTitle}>➕ 添加费用项</Text>
              <Input
                className={styles.editInput}
                placeholder="费用名称（如：高铁票、剧本杀门票等）"
                value={addingItem.name}
                onInput={(e) => setAddingItem({ ...addingItem, name: e.detail.value })}
              />
              <View className={styles.categoryRow}>
                <Text className={styles.categoryLabel}>分类：</Text>
                <View className={styles.categoryOptions}>
                  {Object.entries(BUDGET_CATEGORY_LABELS).map(([key, label]) => (
                    <Text
                      key={key}
                      className={classnames(styles.categoryOption, {
                        [styles.categoryOptionActive]: addingItem.category === key
                      })}
                      onClick={() => setAddingItem({ ...addingItem, category: key as BudgetItem['category'] })}
                    >
                      {label}
                    </Text>
                  ))}
                </View>
              </View>
              <View className={styles.editRow}>
                <Text className={styles.editLabel}>金额：¥</Text>
                <Input
                  className={styles.editAmountInput}
                  type="digit"
                  placeholder="0"
                  value={addingItem.amount}
                  onInput={(e) => setAddingItem({ ...addingItem, amount: e.detail.value })}
                />
              </View>
              <Textarea
                className={styles.editTextarea}
                placeholder="备注（选填，如：往返、2人拼房等）"
                value={addingItem.note}
                onInput={(e) => setAddingItem({ ...addingItem, note: e.detail.value })}
              />
              <View className={styles.editActions}>
                <Text className={styles.cancelBtn} onClick={handleCancelAdd}>取消</Text>
                <Text className={styles.saveBtn} onClick={handleSaveAddItem}>添加</Text>
              </View>
            </View>
          </View>
        ) : (
          <View className={styles.section}>
            <View className={styles.addItemBtn} onClick={handleAddItem}>
              <Text>+ 添加费用项</Text>
            </View>
          </View>
        )}

        <View className={styles.memberSection}>
          <View className={styles.memberHeader}>
            <Text className={styles.memberTitle}>👥 费用分摊</Text>
            <Text className={styles.memberSubtitle}>每人预计应付：¥{perPersonBudget}</Text>
          </View>
          <View className={styles.memberList}>
            {activity.signUps.length === 0 ? (
              <View className={styles.noMembers}>
                <Text>暂无报名成员</Text>
              </View>
            ) : (
              activity.signUps.map(signUp => (
                <View key={signUp.userId} className={styles.memberItem}>
                  <Image className={styles.memberAvatar} src={signUp.userAvatar} mode="aspectFill" />
                  <View className={styles.memberInfo}>
                    <Text className={styles.memberName}>{signUp.userName}</Text>
                    <Text className={styles.memberCampus}>{signUp.school} {signUp.campus}</Text>
                  </View>
                  <Text className={styles.memberShare}>¥{perPersonBudget}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View className={styles.bottomSpacer} />
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button className={styles.secondaryBtn} onClick={handleExport}>
          导出账单
        </Button>
        <Button className={styles.primaryBtn} onClick={handleSave}>
          保存预算
        </Button>
      </View>
    </View>
  );
};

export default BudgetPage;
