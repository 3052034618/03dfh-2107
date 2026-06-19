import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockScripts, mockCurrentUser } from '@/data/mockData';
import { Script } from '@/types';
import { useStore } from '@/store';
import styles from './index.module.scss';

const CreateActivityPage: React.FC = () => {
  const { addActivity } = useStore();
  
  const [title, setTitle] = useState('');
  const [targetCity, setTargetCity] = useState('');
  const [targetShop, setTargetShop] = useState('');
  const [startDate, setStartDate] = useState('2024-02-05');
  const [endDate, setEndDate] = useState('2024-02-06');
  const [maxMembers, setMaxMembers] = useState(8);
  const [description, setDescription] = useState('');
  const [selectedScripts, setSelectedScripts] = useState<Script[]>([mockScripts[0]]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (submitting) return;
    
    if (!title.trim()) {
      Taro.showToast({ title: '请填写活动标题', icon: 'none' });
      return;
    }
    if (!targetCity.trim()) {
      Taro.showToast({ title: '请选择目的城市', icon: 'none' });
      return;
    }
    if (selectedScripts.length === 0) {
      Taro.showToast({ title: '请至少选择一个剧本', icon: 'none' });
      return;
    }

    setSubmitting(true);
    
    try {
      addActivity({
        title: title.trim(),
        targetCity: targetCity.trim(),
        targetShop: targetShop.trim(),
        startDate,
        endDate,
        maxMembers,
        description,
        scripts: selectedScripts,
        creator: {
          id: mockCurrentUser.id,
          name: mockCurrentUser.name,
          avatar: mockCurrentUser.avatar
        },
        days: Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)
      });

      console.log('[CreateActivity] Activity created successfully');
      
      Taro.showToast({ title: '活动创建成功！', icon: 'success' });
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/home/index' });
      }, 1500);
    } catch (error) {
      console.error('[CreateActivity] Failed to create activity:', error);
      Taro.showToast({ title: '创建失败，请重试', icon: 'none' });
      setSubmitting(false);
    }
  };

  const handleAddScript = () => {
    const unselected = mockScripts.filter(
      s => !selectedScripts.find(sel => sel.id === s.id)
    );
    if (unselected.length > 0) {
      setSelectedScripts([...selectedScripts, unselected[0]]);
    } else {
      Taro.showToast({ title: '没有更多剧本可选啦', icon: 'none' });
    }
  };

  const handleRemoveScript = (scriptId: string) => {
    setSelectedScripts(selectedScripts.filter(s => s.id !== scriptId));
  };

  const handleDateChange = (type: 'start' | 'end', e: any) => {
    const value = e.detail.value;
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
  };

  const handleMembersChange = (delta: number) => {
    const newValue = maxMembers + delta;
    if (newValue >= 2 && newValue <= 20) {
      setMaxMembers(newValue);
    }
  };

  return (
    <View className={styles.page}>
      <View className={styles.form}>
        <View className={styles.formSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>📝</Text>
            <Text className={styles.sectionTitle}>基本信息</Text>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>活动标题</Text>
            <Input
              className={styles.formInput}
              placeholder="请输入活动标题"
              placeholderClass={styles.formInputPlaceholder}
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>目的城市</Text>
            <Input
              className={styles.formInput}
              placeholder="请输入城市名称"
              placeholderClass={styles.formInputPlaceholder}
              value={targetCity}
              onInput={(e) => setTargetCity(e.detail.value)}
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>目标店铺</Text>
            <Input
              className={styles.formInput}
              placeholder="选择目标剧本店"
              placeholderClass={styles.formInputPlaceholder}
              value={targetShop}
              onInput={(e) => setTargetShop(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>📅</Text>
            <Text className={styles.sectionTitle}>时间人数</Text>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>出发日期</Text>
            <View className={styles.dateRow}>
              <Input
                type="string"
                className={styles.dateText}
                value={startDate}
                onInput={(e) => setStartDate(e.detail.value)}
              />
              <Text className={styles.dateSeparator}>~</Text>
              <Input
                type="string"
                className={styles.dateText}
                value={endDate}
                onInput={(e) => setEndDate(e.detail.value)}
              />
            </View>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>人数上限</Text>
            <View className={styles.counterRow}>
              <View 
                className={styles.counterBtn}
                onClick={() => handleMembersChange(-1)}
              >
                <Text>−</Text>
              </View>
              <Text className={styles.counterValue}>{maxMembers}人</Text>
              <View 
                className={styles.counterBtn}
                onClick={() => handleMembersChange(1)}
              >
                <Text>+</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>🎭</Text>
            <Text className={styles.sectionTitle}>备选剧本</Text>
          </View>
          <View className={styles.scriptList}>
            {selectedScripts.map(script => (
              <View key={script.id} className={styles.scriptTag}>
                <Text>{script.name}</Text>
                <Text 
                  className={styles.removeBtn}
                  onClick={() => handleRemoveScript(script.id)}
                >
                  ×
                </Text>
              </View>
            ))}
            <View 
              className={styles.addScriptBtn}
              onClick={handleAddScript}
            >
              <Text>+ 添加剧本</Text>
            </View>
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>💬</Text>
            <Text className={styles.sectionTitle}>活动说明</Text>
          </View>
          <View className={styles.textareaItem}>
            <Textarea
              className={styles.textarea}
              placeholder="介绍一下这次活动的安排和注意事项吧..."
              placeholderStyle="color: #9CA3AF"
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
              maxlength={500}
            />
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button className={styles.submitBtn} onClick={handleSubmit}>
          创建活动
        </Button>
      </View>
    </View>
  );
};

export default CreateActivityPage;
