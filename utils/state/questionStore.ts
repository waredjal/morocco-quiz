import { getQuestions } from "@/api/firestore";
import { Category } from "../types";

import { Categories, Levels, Question } from "../types";
import { create } from "zustand";

interface QuestionState {
  questions: Category[];
  currentQuestionSet: Question[];
}

export const useQuestionStore = create<QuestionState>((set) => ({
  questions: [],
  currentQuestionSet: [],
}));

export const initQuestions = async () => {
  return getQuestions().then((questions) => {
    useQuestionStore.setState({ questions: questions });
  });
};

export const setQuestionsByCategoryAndDifficulty = (
  category: Categories,
  difficulty: Levels
) => {
  const categoryQuestions: any = useQuestionStore
    .getState()
    .questions.find((question) => (question.id as Categories) === category);

  if (!categoryQuestions) {
    useQuestionStore.setState({ currentQuestionSet: [] });
    return;
  }

  useQuestionStore.setState({
    currentQuestionSet: categoryQuestions[difficulty] || [],
  });
};
