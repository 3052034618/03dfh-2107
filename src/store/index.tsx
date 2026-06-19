import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Activity, BudgetItem, SignUpInfo, VoteItem } from '@/types';
import { mockActivities, mockCurrentUser, mockUserActivities } from '@/data/mockData';
import { generateId } from '@/utils';

interface StoreContextType {
  activities: Activity[];
  userActivities: { created: string[]; joined: string[] };
  addActivity: (activity: Omit<Activity, 'id' | 'currentMembers' | 'signUps' | 'budgetItems' | 'votes' | 'createTime' | 'status'>) => void;
  addSignUp: (activityId: string, signUp: Omit<SignUpInfo, 'userId' | 'userName' | 'userAvatar' | 'signUpTime'>) => void;
  updateBudgetItems: (activityId: string, budgetItems: BudgetItem[]) => void;
  addBudgetItem: (activityId: string, item: Omit<BudgetItem, 'id'>) => void;
  updateBudgetItem: (activityId: string, itemId: string, updates: Partial<BudgetItem>) => void;
  submitVote: (activityId: string, votes: VoteItem[]) => void;
  getActivityById: (id: string) => Activity | undefined;
  hasSignedUp: (activityId: string, userId: string) => boolean;
  getUserVote: (activityId: string, userId: string) => VoteItem[] | undefined;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  ACTIVITIES: 'scriptclub_activities',
  USER_ACTIVITIES: 'scriptclub_user_activities'
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('[Store] Failed to load activities from localStorage:', e);
    }
    return mockActivities;
  });

  const [userActivities, setUserActivities] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_ACTIVITIES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('[Store] Failed to load userActivities from localStorage:', e);
    }
    return mockUserActivities;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
      console.log('[Store] Activities saved to localStorage, count:', activities.length);
    } catch (e) {
      console.error('[Store] Failed to save activities to localStorage:', e);
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_ACTIVITIES, JSON.stringify(userActivities));
    } catch (e) {
      console.error('[Store] Failed to save userActivities to localStorage:', e);
    }
  }, [userActivities]);

  const addActivity: StoreContextType['addActivity'] = (activityData) => {
    const newActivity: Activity = {
      ...activityData,
      id: generateId(),
      currentMembers: 0,
      status: 'recruiting',
      signUps: [],
      budgetItems: [
        { id: generateId(), name: '交通车票', amount: 0, category: 'transport', note: '' },
        { id: generateId(), name: '酒店住宿', amount: 0, category: 'accommodation', note: '' },
        { id: generateId(), name: '剧本门票', amount: 0, category: 'ticket', note: '' },
        { id: generateId(), name: '打车费用', amount: 0, category: 'taxi', note: '' },
        { id: generateId(), name: '聚餐餐费', amount: 0, category: 'meal', note: '' }
      ],
      votes: {},
      createTime: new Date().toLocaleString('zh-CN')
    };

    setActivities(prev => [newActivity, ...prev]);
    setUserActivities(prev => ({
      ...prev,
      created: [newActivity.id, ...prev.created],
      joined: [...prev.joined]
    }));

    console.log('[Store] New activity added:', newActivity.id, newActivity.title);
    return newActivity;
  };

  const addSignUp: StoreContextType['addSignUp'] = (activityId, signUpData) => {
    const now = new Date().toLocaleString('zh-CN');
    const newSignUp: SignUpInfo = {
      ...signUpData,
      userId: mockCurrentUser.id,
      userName: mockCurrentUser.name,
      userAvatar: mockCurrentUser.avatar,
      signUpTime: now
    };

    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        const existingIndex = activity.signUps.findIndex(s => s.userId === newSignUp.userId);
        let newSignUps;
        if (existingIndex >= 0) {
          newSignUps = [...activity.signUps];
          newSignUps[existingIndex] = newSignUp;
        } else {
          newSignUps = [...activity.signUps, newSignUp];
        }
        return {
          ...activity,
          signUps: newSignUps,
          currentMembers: newSignUps.length
        };
      }
      return activity;
    }));

    setUserActivities(prev => {
      if (!prev.joined.includes(activityId)) {
        return {
          ...prev,
          joined: [activityId, ...prev.joined]
        };
      }
      return prev;
    });

    console.log('[Store] SignUp added to activity:', activityId, newSignUp.userName);
  };

  const updateBudgetItems: StoreContextType['updateBudgetItems'] = (activityId, budgetItems) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          budgetItems
        };
      }
      return activity;
    }));
    console.log('[Store] Budget items updated for activity:', activityId);
  };

  const addBudgetItem: StoreContextType['addBudgetItem'] = (activityId, itemData) => {
    const newItem: BudgetItem = {
      ...itemData,
      id: generateId()
    };

    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          budgetItems: [...activity.budgetItems, newItem]
        };
      }
      return activity;
    }));
    console.log('[Store] Budget item added:', newItem.name, newItem.amount);
  };

  const updateBudgetItem: StoreContextType['updateBudgetItem'] = (activityId, itemId, updates) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          budgetItems: activity.budgetItems.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          )
        };
      }
      return activity;
    }));
    console.log('[Store] Budget item updated:', itemId, updates);
  };

  const submitVote: StoreContextType['submitVote'] = (activityId, votes) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        return {
          ...activity,
          votes: {
            ...activity.votes,
            [mockCurrentUser.id]: votes
          }
        };
      }
      return activity;
    }));
    console.log('[Store] Vote submitted for activity:', activityId, 'by user:', mockCurrentUser.id);
  };

  const getActivityById: StoreContextType['getActivityById'] = (id) => {
    return activities.find(a => a.id === id);
  };

  const hasSignedUp: StoreContextType['hasSignedUp'] = (activityId, userId) => {
    const activity = activities.find(a => a.id === activityId);
    return activity ? activity.signUps.some(s => s.userId === userId) : false;
  };

  const getUserVote: StoreContextType['getUserVote'] = (activityId, userId) => {
    const activity = activities.find(a => a.id === activityId);
    return activity?.votes[userId];
  };

  return (
    <StoreContext.Provider value={{
      activities,
      userActivities,
      addActivity,
      addSignUp,
      updateBudgetItems,
      addBudgetItem,
      updateBudgetItem,
      submitVote,
      getActivityById,
      hasSignedUp,
      getUserVote
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
