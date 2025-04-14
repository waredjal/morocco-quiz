import { StateCreator } from "zustand";
import {
  createProgress,
  getUser,
  updateUserCategory,
  updateUserScore,
} from "@/api/firestore";
import {
  Categories,
  defaultCategoryProgress,
  Language,
  Levels,
} from "../types";
import { Progress, UserI } from "../types";
import { MAX_HEARTS } from "../constants";

export type UserSlice = UserI & {
  progress: Progress;
  currentScore: number;
  setCurrentScore: (score: number) => void;
  setIsPremiumUser: (isPremium: boolean) => void;
  setUserData: (data: Partial<UserI>) => void;
  initUser: (UID: string) => Promise<void>;
  initProgress: (UID: string, category: Categories, difficulty: Levels) => Promise<void>;
  updateScore: (UID: string, groupName: string, quizName: string, score: number, isFinished?: boolean) => Promise<void>;
  getQuizProgress: (quizName: string) => number;
  getGroupProgress: (groupName: string, totalPossibleScore: number) => number;
};


const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set, get) => ({
  _id: "",
  name: "",
  email: "",
  is_premium_user: false,
  premium_type: null,
  created_at: null,
  hearts: {
    current: MAX_HEARTS,
    lastHeartLost: null,
  },
  progress: {},
  currentScore: 0,
  first_time_feedback: true,

  setCurrentScore: (score: number) => set({ currentScore: score }),

  setIsPremiumUser: (isPremium: boolean) => {
    set({ is_premium_user: isPremium });
  },

  // setLanguage: (language: Language) => set({ language }),

  setUserData: (newData: Partial<UserI>) =>
    set((state: UserSlice) => ({ ...state, ...newData })),

  initUser: async (UID: string) => {
    const user = await getUser(UID);
    set({
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      is_premium_user: user?.is_premium_user,
      // language: user?.language,
      created_at: user?.created_at,
      progress: user?.progress || {},
      hearts: user?.hearts,
      first_time_feedback: user?.first_time_feedback,
    });
  },

  initProgress: async (UID: string, category: Categories, difficulty: Levels) => {
    await createProgress(UID, category, difficulty);
  },
  getQuizProgress: (quizName: string): number => {
    const progress = get().progress;

    for (const groupName in progress) {
      if (progress[groupName][quizName]) {
        const quizProgress = progress[groupName][quizName];
        const { score } = quizProgress;

        // Assuming progress is determined by score percentage
        // if (is_finished) return 100; // Completed quizzes have 100% progress
        return score * 10; // If not finished, return the current score as progress
      }
    }

    return 0; // If quiz not found, return 0
  },
  getGroupProgress: (groupName: string, totalPossibleScore: number): number => {
    const progress = get().progress;

    if (!progress[groupName]) return 0;

    const quizzes = progress[groupName];
    const quizNames = Object.keys(quizzes);

    if (quizNames.length === 0) return 0;

    const totalProgress = quizNames.reduce((sum, quizName) => {
      const { score, is_finished } = quizzes[quizName];

      return sum + score;
    }, 0);


    return (totalProgress / totalPossibleScore) * 100;
  },

  updateScore: async (UID: string, groupName: string, quizName: string, score: number, isFinished?: boolean) => {
    try {

      const { progress } = get();
      const newProgress = getNewProgress(progress, groupName, quizName, score, isFinished)

      await updateUserScore(UID, newProgress);

      set(({ progress: newProgress }))

    } catch (e) {
      console.log('error in udpateScore===', e)
    }
  },

});


const getNewProgress = (progress: Progress, groupName: string, quizName: string, score: number, isFinished?: boolean): Progress => {
  const updatedProgress = { ...progress }

  if (!updatedProgress[groupName]) {
    updatedProgress[groupName] = {};
  }

  if (!updatedProgress[groupName][quizName]) {
    updatedProgress[groupName][quizName] = {};
  }

  updatedProgress[groupName][quizName] = {
    ...updatedProgress[groupName][quizName],
    score,
    ...(isFinished !== undefined ? { is_finished: isFinished } : {})
  };

  return updatedProgress
}

export default createUserSlice;
