import { Activity, SignUpInfo, GroupedSignUps, BudgetItem, VoteItem, Script } from '@/types';

export function getStatusText(status: Activity['status']): string {
  const map = {
    recruiting: '招募中',
    confirmed: '已成团',
    completed: '已结束'
  };
  return map[status];
}

export function getStatusColor(status: Activity['status']): string {
  const map = {
    recruiting: '#10B981',
    confirmed: '#7C3AED',
    completed: '#9CA3AF'
  };
  return map[status];
}

export function groupSignUps(signUps: SignUpInfo[]): GroupedSignUps {
  const byCampus: { [campus: string]: SignUpInfo[] } = {};
  const byStation: { [station: string]: SignUpInfo[] } = {};
  const noAccommodation: SignUpInfo[] = [];

  signUps.forEach(signUp => {
    const campusKey = `${signUp.school}-${signUp.campus}`;
    if (!byCampus[campusKey]) {
      byCampus[campusKey] = [];
    }
    byCampus[campusKey].push(signUp);

    if (!byStation[signUp.station]) {
      byStation[signUp.station] = [];
    }
    byStation[signUp.station].push(signUp);

    if (!signUp.needAccommodation) {
      noAccommodation.push(signUp);
    }
  });

  return { byCampus, byStation, noAccommodation };
}

export function calculateTotalBudget(budgetItems: BudgetItem[]): number {
  return budgetItems.reduce((sum, item) => sum + item.amount, 0);
}

export function calculatePerPersonBudget(budgetItems: BudgetItem[], personCount: number): number {
  if (personCount === 0) return 0;
  return Math.round(calculateTotalBudget(budgetItems) / personCount);
}

export function calculateScriptScores(
  scripts: Script[],
  votes: { [userId: string]: VoteItem[] }
): { script: Script; avgScore: number; voteCount: number; redFlags: string[] }[] {
  const allVotes = Object.values(votes).flat();
  
  return scripts.map(script => {
    const scriptVotes = allVotes.filter(v => v.scriptId === script.id);
    const avgScore = scriptVotes.length > 0
      ? scriptVotes.reduce((sum, v) => sum + v.score, 0) / scriptVotes.length
      : 0;
    const redFlags = scriptVotes
      .map(v => v.redFlags)
      .filter(f => f && f !== '无' && f !== '可以接受');
    
    return {
      script,
      avgScore: Math.round(avgScore * 10) / 10,
      voteCount: scriptVotes.length,
      redFlags
    };
  }).sort((a, b) => b.avgScore - a.avgScore);
}

export function getBestScriptRecommendation(
  scriptScores: { script: Script; avgScore: number; voteCount: number; redFlags: string[] }[],
  playerCount: number
): { script: Script; reason: string } | null {
  if (scriptScores.length === 0) return null;
  
  const viableScripts = scriptScores.filter(s => s.voteCount > 0);
  if (viableScripts.length === 0) {
    return { script: scriptScores[0].script, reason: '暂无投票数据，可先考虑此剧本' };
  }
  
  const best = viableScripts[0];
  const reasons: string[] = [];
  
  if (best.redFlags.length === 0) {
    reasons.push('无雷点，全员接受度高');
  } else if (best.redFlags.length <= 1) {
    reasons.push('雷点较少');
  }
  
  if (best.avgScore >= 4.5) {
    reasons.push('评分超高');
  } else if (best.avgScore >= 4) {
    reasons.push('评分优秀');
  }
  
  if (reasons.length === 0) {
    reasons.push('综合评分最高');
  }
  
  return {
    script: best.script,
    reason: reasons.join('，')
  };
}

export function formatDate(dateStr: string): string {
  return dateStr;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
