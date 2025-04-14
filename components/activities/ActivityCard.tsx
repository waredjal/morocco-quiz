import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";

const ActivityCard = () => (
  <View style={styles.progressCard}>
    <View style={styles.progressHeader}>
      <Text style={styles.progressTitle}>History of Morocco</Text>
      <TouchableOpacity>
        <Feather name="arrow-up-right" size={24} color="#4A4A4A" />
      </TouchableOpacity>
    </View>
    <Text style={styles.progressMainTitle}>Today's progress summary</Text>
    <View style={styles.progressFooter}>
      <Text style={styles.tasksText}>20 Tasks</Text>
      <View style={styles.ratingContainer}>
        <FontAwesome name="star" size={16} color="#FFD700" />
        <Text style={styles.ratingText}>5.0 (302) 🤩</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  progressCard: {
    backgroundColor: "#FF7F6A",
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressTitle: {
    color: "white",
    fontSize: 16,
  },
  progressMainTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  tasksText: {
    color: "white",
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    gap: 5,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 5,
  },
});

export default ActivityCard;
