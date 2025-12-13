// Configuration constants for the application

export const COMMENT_CONFIG = {
  MAX_LENGTH: 1000,
  MIN_LENGTH: 1,
} as const

export const RANKING_WEIGHTS = {
  PRESENCE_RATE: 0.3,      // 30% - Attendance at sessions
  APPROVAL_RATE: 0.4,      // 40% - Success rate of approved proposals
  BUDGET_EFFICIENCY: 0.3,  // 30% - Responsible budget usage (lower is better)
} as const

export const RANKING_CONFIG = {
  SCORE_MULTIPLIER: 100,   // Multiplier to convert percentages to points (0-100 scale)
} as const

export const AUTOMATION_CONFIG = {
  // Prevent concurrent automation runs
  LOCK_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes
} as const
