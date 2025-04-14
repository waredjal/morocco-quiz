import { Timestamp } from "@react-native-firebase/firestore";
import { StyleProp, TextProps, TextStyle } from "react-native";
import { PACKAGE_TYPE } from "react-native-purchases";

export type Language = "en" | "fr" | "es" | "it" | "de";
export type Levels = "easy" | "intermediate" | "advanced";
export type Categories = "history" | "geography" | "culture";


export type AdType = {
  _id: string;
  go_to_url: string;
  img_url: string;
  img_url_en?: string;
};


export type UserI = {
  _id: string;
  email: string | null;
  name: string;
  is_premium_user: boolean;
  premium_type: null | PACKAGE_TYPE
  created_at: number | null;
  language?: Language;
  progress?: Progress;
  hearts: {
    current: number;
    lastHeartLost: Timestamp | null;
  };
  first_time_feedback: boolean;
};

// export interface Category {
//   id: string;
//   name: string
//   level: Level[];
// }

export interface Level {
  difficulty: Difficulty;
  questions: Question[];
}

export enum Difficulty {
  EASY = 'easy',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export interface Question {
  id: string;
  question_en: string;
  question_fr: string;
  answer: number;
  options: Option[];
}



export type Progress = {
  [groupName: string]: {
    [quizName: string]: {
      correctAnswers: number;
      is_finished: boolean;
      score: number;
    };
  };
};
export type OldProgress = {
  [category in Categories]: {
    [difficulty in Levels]: {
      correctAnswers: number;
      is_finished: boolean;
      score: number;
    };
  };
};

export const defaultCategoryProgress = {
  easy: { correctAnswers: 0, is_finished: false, score: 0 },
  intermediate: { correctAnswers: 0, is_finished: false, score: 0 },
  advanced: { correctAnswers: 0, is_finished: false, score: 0 },
};


export type StyledTextProps = TextProps & {
  type?: "body" | "heading" | "semiBold";
  weight?: 400 | 500 | 600;
  textStyle?: StyleProp<TextStyle>;
  children?: any;
  color?: string;
  fontSize?: number;
  shadow?: boolean;
};

export type GroupedQuizzes = {
  groupName: string // e.g., "easy", "intermediate", "advanced", etc.
  quizzes: Quiz[]
  order: number
};

export type Quiz = {
  id: string;
  name: string;
  desc: string;
  questions: QuizQuestion[];
};
export type QuizQuestion = {
  answer: number;
  options: Option[];
  question_en: string;
  question_fr: string;
};
export interface Option {
  id: number;
  option_en: string;
  option_fr: string;
}



export type OldCategory = {
  id: string;
  name: string;
  easy?: Question[];
  intermediate?: Question[];
  advanced?: Question[];
};

export type CurrentQuiz = {
  groupName: string,
  quiz: Quiz
}

export type LanguageObj = {
  code: string;
  lang?: string;
  name: string;
  flag: string
};

export type Link = {
  text_fr: string;
  text_en: string;
  text_es: string;
  // text_it: string;
  // text_de: string;
  icon: string;
  url: string;
  color: string;
};
