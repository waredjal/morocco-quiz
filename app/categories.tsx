import React, { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { globalStyle } from "@/styles/globalStyles";
import SectionHeader from "@/components/header/SectionHeader";
import { useRouter } from "expo-router";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { useCategoryStore } from "@/utils/state/categoryStore";
import { Categories, Category, Levels } from "@/utils/types";
import { LevelCard } from "@/components/categories/LevelCard";
import { useTranslation } from "react-i18next";
import { useQuestionStore } from "@/utils/state/questionStore";
import { saveCategory, saveDifficulty } from "@/utils/asyncStorage";
import useAppState from "@/utils/state/useStore";

const CategoriesScreen = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { questions } = useQuestionStore();
  const { progress, initProgress, _id } = useAppState();

  const setCurrentCategory = useCategoryStore(
    (state) => state.setCurrentCategory
  );
  const router = useRouter();
  const { t } = useTranslation();

  const getUnlockedLevels = (categoryId: Categories): Levels[] => {
    const categoryProgress = progress?.[categoryId];
    const unlockedLevels: Levels[] = ["easy"];

    if (categoryProgress?.easy?.is_finished) {
      unlockedLevels.push("intermediate");
      if (categoryProgress.intermediate?.is_finished) {
        unlockedLevels.push("advanced");
      }
    }

    return unlockedLevels;
  };

  const handleLevelPress = (category: Categories, difficulty: Levels) => {
    saveCategory(category);
    saveDifficulty(difficulty);
    setCurrentCategory({ category, difficulty });
    if (!progress[category]?.[difficulty])
      initProgress(_id, category, difficulty);
    router.push("/(tabs)/home");
  };

  const getPercentage = (category: Categories, difficulty: Levels): number => {
    const actualScore = progress?.[category]?.[difficulty]?.score || 0;
    const currentQuestions: any = questions?.find(
      (cat: Category) => cat.id === category
    );

    if (!currentQuestions) return 0;

    const totalQuestions = currentQuestions[difficulty]?.length || 1;
    return (actualScore / totalQuestions) * 100;
  };

  return (
    <View style={[globalStyle.container, styles.container]}>
      <SectionHeader title={t("title.category")} />
      <FlatList<Categories>
        data={questions.map((q) => q.id as Categories)}
        renderItem={({ item: category }: { item: Categories }) => (
          <View style={styles.categorySection}>
            <CategoryCard
              category={category}
              isExpanded={expandedCategory === category}
              onPress={() =>
                setExpandedCategory(
                  expandedCategory === category ? null : category
                )
              }
            />

            {expandedCategory === category && (
              <View style={styles.difficultyContainer}>
                {["easy", "intermediate", "advanced"].map((difficulty) => (
                  <LevelCard
                    key={difficulty}
                    category={category}
                    difficulty={difficulty as Levels}
                    progress={getPercentage(category, difficulty as Levels)}
                    isUnlocked={getUnlockedLevels(category).includes(
                      difficulty as Levels
                    )}
                    onPress={() =>
                      handleLevelPress(category, difficulty as Levels)
                    }
                  />
                ))}
              </View>
            )}
          </View>
        )}
        keyExtractor={(category) => category}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  listContainer: {
    paddingTop: 20,
  },
  categorySection: {
    marginBottom: 15,
  },
  difficultyContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
});

export default CategoriesScreen;
