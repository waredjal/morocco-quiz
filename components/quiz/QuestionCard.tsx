import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CustomButton } from "../CustomButton";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

import { useHeartStore } from "@/utils/state/heartStore";
import { randomAds, shuffleArray } from "@/utils/utils";
import { ERROR, SUCCESS } from "@/styles/globalColors";
import { LinearGradient } from "expo-linear-gradient";
import useAppState from "@/utils/state/useStore";
import { generalStyles } from "@/style/generalStyles";
import { globalStyle } from "@/styles/globalStyles";
import { playAudio, startTimerSound, stopTimerSound, successSound, timerSound, wrongSound } from "@/utils/helper";


interface QuestionCardProps {
  options: {
    title: string;
    id: number;
  }[];
  question: string;
  answer: string;
  totalQuestions: number;
  questionIndex: number;
  setQuestionIndex: (index: number) => void;
  setRandom: (random: number) => void;
  isPremium: boolean;
}

const QuestionCard = ({
  options,
  question,
  answer,
  totalQuestions,
  questionIndex,
  setQuestionIndex,
  setRandom,
  isPremium,
}: QuestionCardProps) => {
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [answerSelected, setAnswerSelected] = useState("");
  const [shuffledOptions, setShuffledOptions] = useState(options);

  const {
    setCurrentScore,
    currentScore,
    progress,
    _id,
    currentQuiz,
    updateScore } = useAppState();

  const { hearts, loseHeart } = useHeartStore();

  const { t } = useTranslation();
  const router = useRouter();

  const groupName = currentQuiz!.groupName
  const quizName = currentQuiz!.quiz.name

  // Mélanger les options au chargement de la question
  useEffect(() => {
    setShuffledOptions(shuffleArray(options));
  }, [question]);

  //wrong answer or time up
  const isIncorrect =
    (answerSelected !== answer && answerSelected.length > 0) || timeLeft === 0;

  useEffect(() => {
    if (timeLeft === 0 || answerSelected.length > 0) {
      setIsTimeUp(true);
      // stopTimerSound()
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
      timerSound(timeLeft > 15 ? 0.1 : timeLeft > 10 ? 0.2 : 0.5)
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, answerSelected, isTimeUp]);

  useEffect(() => {
    const lastTimeScore = progress[groupName]?.[quizName]?.score || 0;

    if (currentScore > lastTimeScore) {
      updateScore(_id, groupName, quizName, currentScore);
    }
  }, [answerSelected]);

  const handleAnswerSelected = async (option: string) => {
    setAnswerSelected(option);

    if (option === answer) {
      await successSound()
      setCurrentScore(currentScore + 1);
    } else {
      await wrongSound()
      if (!isPremium) {
        loseHeart(_id);
      }
    }
  };


  const handleNextQuestion = () => {
    setRandom(randomAds());
    setAnswerSelected("");
    setIsTimeUp(false);
    setTimeLeft(20);
    setQuestionIndex(questionIndex + 1);
  };

  const handleFinish = async () => {

    await playAudio(require("@/assets/audio/success.mp3"));

    updateScore(_id, groupName, quizName, currentScore, true);
    setQuestionIndex(0);

    setTimeout(() => router.push("./quiz/result"), 250)

  };

  const getButtonBackgroundColor = (option: string) => {
    if (answerSelected.length === 0 && !isTimeUp) return "white";
    if (option === answerSelected && option !== answer) return "#e1513e";
    if (option === answer) return "#7aac67";
    return "white";
  };

  useEffect(() => {
    if (timeLeft === 0 && !isPremium) {
      loseHeart(_id);
    }
  }, [timeLeft]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#dfd5da", "#fbeeed"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.2 }}
        style={styles.subContainer}
      >
        <View style={styles.card}>
          <Text style={styles.questionText}>{question}</Text>
          <View style={styles.timerContainer}>
            <Ionicons
              name="hourglass-outline"
              size={20}
              color={timeLeft <= 10 ? "red" : "white"}
            />
            <Text
              style={[
                styles.timerText,
                timeLeft <= 10 && styles.timerTextWarning,
              ]}
            >
              {timeLeft.toString().padStart(2, "0")}
            </Text>
          </View>
          <View style={styles.heartContainer}>
            <Ionicons
              name={isIncorrect ? "heart-dislike-outline" : "heart"}
              size={20}
              color="red"
            />
            <Text style={styles.heartText}>
              x {!isPremium ? hearts.current : "∞"}
            </Text>
          </View>
        </View>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          {shuffledOptions.map((option, index) => (
            <CustomButton
              key={index}
              title={option.title}
              style={[
                styles.optionButton,
                { backgroundColor: getButtonBackgroundColor(option.title) },
              ]}
              textStyle={{ fontSize: 16 }}
              onPress={() => handleAnswerSelected(option.title)}
              disabled={isTimeUp || answerSelected.length > 0}
              outline
            />
          ))}
        </View>

        <View style={styles.feedbackContainer}>
          {/* if incorrect */}
          {isIncorrect && (
            <>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="red"
              />
              <Text style={styles.feedbackText}>
                {timeLeft === 0
                  ? t("question.timeup")
                  : t("question.incorrect")}
              </Text>
            </>
          )}
          {/* if correct */}
          {!isIncorrect && answerSelected.length > 0 && (
            <Text style={styles.successText}>Great Job! 🎉</Text>
          )}
        </View>
      </LinearGradient>
      {isTimeUp &&
        (questionIndex + 1 !== totalQuestions ? (
          <CustomButton
            variant="primary"
            title={t("question.next")}
            textStyle={{ fontSize: 16 }}
            onPress={handleNextQuestion}
          />
        ) : (
          <CustomButton
            title={t("question.finish")}
            onPress={handleFinish}
            style={{ backgroundColor: "green" }}
            textStyle={{ color: "white", fontSize: 16 }}
            variant="success"
          />
        ))}
    </View>
  );
};

export default QuestionCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: '5%',
    gap: 10
  },
  subContainer: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fbeeed",
    padding: 20,
    paddingTop: 5,
    marginTop: 20,
    borderRadius: 20,
  },
  card: {
    // flex: .7,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 40,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 5,
    overflow: "hidden",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 25,
    marginBottom: 20,
  },
  timerContainer: {
    height: 35,
    width: "45%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 25,
    backgroundColor: "#848b93",
    position: "absolute",
    left: 0,
    bottom: 0,
    gap: 5,
  },
  timerText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  timerTextWarning: {
    color: "red",
  },
  heartContainer: {
    height: 35,
    width: "45%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 25,
    backgroundColor: "#848b93",
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  heartText: { marginLeft: 5, color: "white" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },

  optionsContainer: { marginVertical: 20, gap: 10 },
  optionButton: { padding: 15, marginVertical: 10 },
  defaultOption: { backgroundColor: "#ffffff" },
  correctOption: { backgroundColor: SUCCESS },
  incorrectOption: { backgroundColor: ERROR },
  optionText: { textAlign: "center", fontSize: 16, fontWeight: "500" },
  feedbackContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxHeight: 20,
  },
  feedbackText: { color: "red", fontSize: 16 },
  successText: {
    textAlign: "center",
  },
});
