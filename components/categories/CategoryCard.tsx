import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Categories } from "@/utils/types";
import { useTranslation } from "react-i18next";

interface CategoryCardProps {
  category: Categories;
  isExpanded: boolean;
  onPress: () => void;
}

export const CategoryCard = ({
  category,
  isExpanded,
  onPress,
}: CategoryCardProps) => {
  const { t } = useTranslation();

  const categoryImages: Record<Categories, ImageSourcePropType> = {
    history: require("@/assets/images/history.png"),
    geography: require("@/assets/images/geography.png"),
    culture: require("@/assets/images/culture.png"),
  };

  return (
    <TouchableOpacity
      style={[styles.categoryCard, isExpanded && styles.categoryCardSelected]}
      onPress={onPress}
    >
      <Image source={categoryImages[category]} style={styles.categoryIcon} />
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryTitle}>
          {t(`home.category.${category}`)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    borderColor: "lightgray",
    borderWidth: 1,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryCardSelected: {
    borderColor: "#E74C3C",
    borderWidth: 2,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  categoryProgress: {
    fontSize: 14,
    color: "#666",
  },
});
