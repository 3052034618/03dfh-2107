import { Activity, User, Script, SignUpInfo, BudgetItem } from '@/types';

export const mockCurrentUser: User = {
  id: 'user-001',
  name: '林小雨',
  avatar: 'https://picsum.photos/id/64/200/200',
  campus: '东校区',
  school: '南京大学'
};

export const mockScripts: Script[] = [
  {
    id: 'script-001',
    name: '雾起云浮',
    type: '民国 / 推理 / 硬核',
    difficulty: '★★★★☆',
    duration: '6-7小时',
    description: '民国三年，一场迷雾中的离奇命案，层层反转的硬核推理之作。',
    playerCount: '5人（3男2女）'
  },
  {
    id: 'script-002',
    name: '须臾',
    type: '恐怖 / 变格 / 还原',
    difficulty: '★★★★★',
    duration: '7-8小时',
    description: '你听见了吗？那来自阴间的呼唤... 一个关于救赎与背叛的恐怖故事。',
    playerCount: '6人（3男3女）'
  },
  {
    id: 'script-003',
    name: '漓川怪谈簿',
    type: '日式 / 妖怪 / 情感',
    difficulty: '★★★☆☆',
    duration: '5-6小时',
    description: '常世之海，有怪谈存焉。人与妖的羁绊，跨越百年的爱恋。',
    playerCount: '7人（4男3女）'
  },
  {
    id: 'script-004',
    name: '年轮',
    type: '现代 / 硬核 / 烧脑',
    difficulty: '★★★★★',
    duration: '6-7小时',
    description: '一个关于时间、宿命和轮回的故事，硬核推理玩家的必玩之作。',
    playerCount: '5人（3男2女）'
  },
  {
    id: 'script-005',
    name: '舍离',
    type: '古风 / 情感 / 仙侠',
    difficulty: '★★☆☆☆',
    duration: '4-5小时',
    description: '三世情缘，舍离断爱。仙侠世界中的凄美爱情故事。',
    playerCount: '6人（3男3女）'
  }
];

const mockSignUps: SignUpInfo[] = [
  {
    userId: 'user-001',
    userName: '林小雨',
    userAvatar: 'https://picsum.photos/id/64/200/200',
    campus: '东校区',
    school: '南京大学',
    station: '南京南站',
    budgetMin: 500,
    budgetMax: 800,
    canOvernight: true,
    preferredRole: '任意',
    needAccommodation: true,
    signUpTime: '2024-01-15 10:30'
  },
  {
    userId: 'user-002',
    userName: '陈明轩',
    userAvatar: 'https://picsum.photos/id/91/200/200',
    campus: '东校区',
    school: '南京大学',
    station: '南京南站',
    budgetMin: 400,
    budgetMax: 700,
    canOvernight: false,
    preferredRole: '凶手位',
    needAccommodation: false,
    signUpTime: '2024-01-15 11:20'
  },
  {
    userId: 'user-003',
    userName: '王思琪',
    userAvatar: 'https://picsum.photos/id/177/200/200',
    campus: '鼓楼校区',
    school: '南京大学',
    station: '南京站',
    budgetMin: 600,
    budgetMax: 1000,
    canOvernight: true,
    preferredRole: '情感位',
    needAccommodation: true,
    signUpTime: '2024-01-15 14:05'
  },
  {
    userId: 'user-004',
    userName: '张子豪',
    userAvatar: 'https://picsum.photos/id/338/200/200',
    campus: '仙林校区',
    school: '南京师范大学',
    station: '南京南站',
    budgetMin: 300,
    budgetMax: 600,
    canOvernight: true,
    preferredRole: '硬核位',
    needAccommodation: true,
    signUpTime: '2024-01-15 16:45'
  },
  {
    userId: 'user-005',
    userName: '李梦瑶',
    userAvatar: 'https://picsum.photos/id/1027/200/200',
    campus: '仙林校区',
    school: '南京师范大学',
    station: '南京站',
    budgetMin: 400,
    budgetMax: 700,
    canOvernight: false,
    preferredRole: '反串也可',
    needAccommodation: false,
    signUpTime: '2024-01-16 09:15'
  },
  {
    userId: 'user-006',
    userName: '赵子涵',
    userAvatar: 'https://picsum.photos/id/237/200/200',
    campus: '浦口校区',
    school: '东南大学',
    station: '南京南站',
    budgetMin: 500,
    budgetMax: 900,
    canOvernight: true,
    preferredRole: '恐怖位',
    needAccommodation: true,
    signUpTime: '2024-01-16 10:30'
  }
];

const mockBudgetItems: BudgetItem[] = [
  { id: 'budget-001', name: '高铁往返', amount: 320, category: 'transport', note: '南京南-上海虹桥' },
  { id: 'budget-002', name: '酒店住宿', amount: 280, category: 'accommodation', note: '双人房AA，两晚' },
  { id: 'budget-003', name: '剧本门票', amount: 268, category: 'ticket', note: '城限本' },
  { id: 'budget-004', name: '打车费用', amount: 80, category: 'taxi', note: '车站到酒店等' },
  { id: 'budget-005', name: '聚餐餐费', amount: 150, category: 'meal', note: '两正一早' }
];

export const mockActivities: Activity[] = [
  {
    id: 'activity-001',
    title: '寒假上海硬核本之旅',
    creatorId: 'user-001',
    creatorName: '林小雨',
    creatorAvatar: 'https://picsum.photos/id/64/200/200',
    targetCity: '上海',
    targetShop: 'M谋已久·剧本杀推理馆（静安店）',
    scripts: mockScripts.slice(0, 3),
    startDate: '2024-02-05',
    endDate: '2024-02-06',
    days: 2,
    maxMembers: 8,
    currentMembers: 6,
    status: 'recruiting',
    description: '寒假一起去上海打硬核本！计划两天打两个本，晚上可以一起逛外滩～',
    signUps: mockSignUps,
    budgetItems: mockBudgetItems,
    votes: {
      'user-001': [
        { scriptId: 'script-001', score: 5, redFlags: '无' },
        { scriptId: 'script-002', score: 4, redFlags: '不太想玩太恐怖的' },
        { scriptId: 'script-003', score: 3, redFlags: '对情感本一般' }
      ],
      'user-002': [
        { scriptId: 'script-001', score: 4, redFlags: '可以接受' },
        { scriptId: 'script-002', score: 5, redFlags: '无' },
        { scriptId: 'script-003', score: 2, redFlags: '不玩情感本' }
      ]
    },
    createTime: '2024-01-10 14:30'
  },
  {
    id: 'activity-002',
    title: '苏州古风情感本约伴',
    creatorId: 'user-003',
    creatorName: '王思琪',
    creatorAvatar: 'https://picsum.photos/id/177/200/200',
    targetCity: '苏州',
    targetShop: '姑苏剧本杀体验馆',
    scripts: mockScripts.slice(3, 5),
    startDate: '2024-02-10',
    endDate: '2024-02-11',
    days: 2,
    maxMembers: 6,
    currentMembers: 4,
    status: 'recruiting',
    description: '苏州一日游+古风本，顺便逛逛平江路和拙政园～',
    signUps: mockSignUps.slice(0, 4),
    budgetItems: mockBudgetItems.slice(0, 4),
    votes: {},
    createTime: '2024-01-12 09:00'
  },
  {
    id: 'activity-003',
    title: '国庆杭州剧本杀团建',
    creatorId: 'user-002',
    creatorName: '陈明轩',
    creatorAvatar: 'https://picsum.photos/id/91/200/200',
    targetCity: '杭州',
    targetShop: '西湖区剧本杀探案馆',
    scripts: mockScripts.slice(1, 4),
    startDate: '2023-10-02',
    endDate: '2023-10-04',
    days: 3,
    maxMembers: 10,
    currentMembers: 10,
    status: 'completed',
    description: '国庆杭州三天两夜，三个本连打！',
    signUps: mockSignUps,
    budgetItems: mockBudgetItems,
    votes: {},
    finalScript: mockScripts[1],
    createTime: '2023-09-15 16:00'
  }
];

export const mockUserActivities = {
  created: ['activity-001'],
  joined: ['activity-001', 'activity-002', 'activity-003']
};
