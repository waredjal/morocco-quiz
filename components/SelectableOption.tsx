import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

import { Image } from "expo-image";
import StyledText from "./StyledText";
import { Ionicons } from "@expo/vector-icons";
import { generalStyles } from "@/style/generalStyles";
import { colors } from "@/styles/globalColors";

const SelectableOption = ({
  onPress,
  isSelected,
  img,
  text,
  icon,
  iconColor,
}: {
  onPress: () => void;
  isSelected: boolean;
  img?: string;
  text: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {icon ? (
        <Ionicons name={icon} size={24} color={iconColor} />
      ) : (
        <Image source={img} contentFit="contain" style={styles.img} />
      )}
      <StyledText fontSize={16}>{text}</StyledText>
      {isSelected && <StyledText fontSize={18}>✅</StyledText>}
    </TouchableOpacity>
  );
};

export default SelectableOption;

const styles = StyleSheet.create({
  container: {
    ...generalStyles.row,
    padding: 12,
    backgroundColor: colors.surface,
    gap: 12,
    height: 50,
    borderRadius: 15
  },
  img: {
    width: 36,
    height: 36,
    borderRadius: 100,
  },
});
