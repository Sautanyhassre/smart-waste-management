/**
 * Smart Collection Priority Calculation Engine
 * 
 * Score Formula:
 * Priority Score = (Fill Level % * 0.55) + (Hours Since Collection * 0.3) + Criticality Bonus
 * 
 * Classification:
 * - >= 80  : Critical (Red)
 * - 60-79  : High (Orange)
 * - 40-59  : Medium (Yellow)
 * - < 40   : Low (Green)
 */
function calculateBinPriority(fillLevel, lastCollectedAt) {
  const fill = Math.min(100, Math.max(0, Number(fillLevel) || 0));
  const now = new Date();
  const lastDate = lastCollectedAt ? new Date(lastCollectedAt) : new Date(now.getTime() - 24 * 3600 * 1000);
  const hoursElapsed = Math.max(0, (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60));

  let criticalityBonus = 0;
  if (fill > 90) criticalityBonus = 25;
  else if (fill > 75) criticalityBonus = 15;
  else if (fill > 50) criticalityBonus = 5;

  const score = Math.min(100, Math.round((fill * 0.55) + (hoursElapsed * 0.3) + criticalityBonus));

  let level = 'Low';
  let status = 'Low';

  if (fill <= 25) status = 'Low';
  else if (fill <= 50) status = 'Moderate';
  else if (fill <= 75) status = 'High';
  else if (fill <= 90) status = 'Very High';
  else status = 'Critical';

  if (score >= 80) level = 'Critical';
  else if (score >= 60) level = 'High';
  else if (score >= 40) level = 'Medium';

  return {
    priorityScore: score,
    priorityLevel: level,
    status
  };
}

module.exports = { calculateBinPriority };
