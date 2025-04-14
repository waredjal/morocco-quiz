import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";

type Props = {
  image: ImageSourcePropType;
  question: string;
  answer: string;
};

const ActivityQuestionCard = ({ image, question, answer }: Props) => (
  <View style={styles.questionCard}>
    <Image source={image} style={styles.questionImage} />
    <View style={styles.questionContent}>
      <Text style={styles.questionText}>{question}</Text>
      <Text style={styles.answerText}>{answer}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  questionCard: {
    flexDirection: "row",
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
  },
  questionImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  questionContent: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  questionText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  answerText: {
    fontSize: 12,
    color: "#666",
  },
});

export default ActivityQuestionCard;
