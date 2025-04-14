import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Categories, Levels } from "@/utils/types";
import { useCategoryStore } from "@/utils/state/categoryStore";
import { useTranslation } from "react-i18next";

interface LevelCardProps {
  category: Categories;
  difficulty: Levels;
  isUnlocked: boolean;
  progress: number;
  onPress: () => void;
}

export const LevelCard = ({
  category,
  difficulty,
  isUnlocked,
  progress,
  onPress,
}: LevelCardProps) => {
  const { t } = useTranslation();
  const {setCurrentCategory} = useCategoryStore();

  const handlePress = () => {
    if (isUnlocked) {
      setCurrentCategory({
        category,
        difficulty,
      });
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.difficultyCard, !isUnlocked && styles.lockedCard]}
      disabled={!isUnlocked}
      onPress={handlePress}
    >
      <View style={styles.difficultyHeader}>
        <Text style={styles.difficultyTitle}>{t(`levels.${difficulty}`)}</Text>
        {!isUnlocked && <Text style={styles.lockIcon}>🔒</Text>}
      </View>
      {isUnlocked && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  difficultyCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 8,
  },
  lockedCard: {
    opacity: 0.5,
  },
  difficultyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  difficultyTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
  },
  lockIcon: {
    fontSize: 16,
  },
  progressContainer: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#E74C3C",
    borderRadius: 3,
  },
  progressText: {
    position: "absolute",
    right: -25,
    top: -10,
    fontSize: 10,
    color: "#666",
  },
});
