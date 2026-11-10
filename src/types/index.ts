export interface VisitorData {
  visitorId: string;
  visitorName: string;
  snapchatAnswer?: string;
  snapchatId?: string;
  memoryAnswer?: string;
  memoryFollowUp?: string;
  personalMessage?: string;
  finalAnswer?: 'YES' | 'NO';
  completionStatus: 'in_progress' | 'completed';
  currentScene: number;
  createdAt: string;
  updatedAt: string;
}

export type SceneId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
