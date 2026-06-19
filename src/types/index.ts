export interface User {
  id: string;
  name: string;
  avatar: string;
  campus: string;
  school: string;
}

export interface Script {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  duration: string;
  description: string;
  playerCount: string;
}

export interface SignUpInfo {
  userId: string;
  userName: string;
  userAvatar: string;
  campus: string;
  school: string;
  station: string;
  budgetMin: number;
  budgetMax: number;
  canOvernight: boolean;
  preferredRole: string;
  needAccommodation: boolean;
  signUpTime: string;
}

export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  category: 'transport' | 'accommodation' | 'ticket' | 'taxi' | 'meal' | 'other';
  note?: string;
}

export interface VoteItem {
  scriptId: string;
  score: number;
  redFlags: string;
}

export interface Activity {
  id: string;
  title: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  targetCity: string;
  targetShop: string;
  scripts: Script[];
  startDate: string;
  endDate: string;
  days: number;
  maxMembers: number;
  currentMembers: number;
  status: 'recruiting' | 'confirmed' | 'completed';
  description: string;
  signUps: SignUpInfo[];
  budgetItems: BudgetItem[];
  votes: { [userId: string]: VoteItem[] };
  finalScript?: Script;
  createTime: string;
}

export interface GroupedSignUps {
  byCampus: { [campus: string]: SignUpInfo[] };
  byStation: { [station: string]: SignUpInfo[] };
  noAccommodation: SignUpInfo[];
}

export type BudgetCategory = 'transport' | 'accommodation' | 'ticket' | 'taxi' | 'meal' | 'other';

export const BUDGET_CATEGORY_LABELS: Record<BudgetCategory, string> = {
  transport: '交通车票',
  accommodation: '住宿',
  ticket: '剧本门票',
  taxi: '打车',
  meal: '餐费',
  other: '其他'
};
