import { isAndroid } from "@/utils/platform";
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
};

const ActivityCategory = ({ title }: Props) => (
  <TouchableOpacity style={[styles.categoryPill, styles.shadow]}>
    <Text style={styles.categoryText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  categoryPill: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  shadow: isAndroid
    ? { elevation: 5 }
    : {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
  categoryText: {
    fontSize: 16,
  },
});

export default ActivityCategory;
