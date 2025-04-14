import { Categories, Levels } from "@/utils/types";
import { create } from "zustand";
import { getCategory, getDifficulty } from "../asyncStorage";

interface CurrentCategoryState {
  category: Categories;
  difficulty: Levels;
  setCurrentCategory: (chapter: {
    category: Categories;
    difficulty: Levels;
  }) => void;
}

export const useCategoryStore = create<CurrentCategoryState>((set) => ({
  category: "history",
  difficulty: "easy",
  setCurrentCategory: ({ category, difficulty }) =>
    set({ category: category, difficulty: difficulty }),
}));

export const initCategoryAndDifficulty = async () => {
  const category = await getCategory();
  const difficulty = await getDifficulty();
  useCategoryStore.setState({
    category: (category as Categories) || "history",
    difficulty: (difficulty as Levels) || "easy",
  });
};
