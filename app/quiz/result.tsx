import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useCategoryStore } from "@/utils/state/categoryStore";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@/components/CustomButton";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SectionHeader from "@/components/header/SectionHeader";
import ProgressCircle from "@/components/progress/CategoryProgressCircle";
import { useQuestionStore } from "@/utils/state/questionStore";
import { FeedbackModal } from "@/components/modals/FeedbackModal";
import { updateFirstTimeFeedback } from "@/api/firestore";
import { BG_CARD, colors } from "@/styles/globalColors";
import useAppState from "@/utils/state/useStore";
import ViewContainer from "@/components/layout/ViewContainer";
import CustomProgressBar from "@/components/CustomProgressBar";

const QuizResult = () => {
  // const { currentQuestionSet } = useQuestionStore();
  // const { category, difficulty } = useCategoryStore();
  const {
    currentScore,
    setCurrentScore,
    first_time_feedback, _id,
    currentQuiz,
    nextQuiz,
    setCurrentQuiz
  } =
    useAppState();
  const { t } = useTranslation();
  const router = useRouter();
  const [showFeedback, setShowFeedback] = useState(false);

  const totalQuestions = currentQuiz?.quiz.questions.length;
  const percentage = Math.round((currentScore / totalQuestions!) * 100);

  const handleRetry = () => {
    router.replace("/quiz");
    setCurrentScore(0);
  };

  const handleBackToHome = () => {
    router.replace("/(tabs)/home");
    setCurrentScore(0);
  };

  useEffect(() => {
    if (first_time_feedback) {
      setShowFeedback(true);
      updateFirstTimeFeedback(_id);
    }
  }, [currentScore, first_time_feedback]);


  const handleNextQuiz = () => {
    setCurrentScore(0);
    setCurrentQuiz(nextQuiz!)
    router.replace("/quiz");
  }

  const isNextQuizAvailable = currentQuiz?.quiz.id != nextQuiz?.quiz.id

  const getToNextQuizProgress = () => {
    return Math.floor((percentage * 100) / 85); // Ensures max is 100
  };

  return (
    <ViewContainer style={styles.container}>
      <SectionHeader title={t("result.title")} noBackBtn />
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            {currentQuiz?.groupName}
          </Text>
          <Text style={styles.title}>
            {currentQuiz?.quiz.name}
          </Text>
        </View>

        <View style={styles.scoreContainer}>
          <ProgressCircle progress={percentage} />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={24} color="#7aac67" />
            <Text style={styles.statText}>
              {currentScore} {t("result.correctAnswers")}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="close-circle" size={24} color="#e1513e" />
            <Text style={styles.statText}>
              {totalQuestions - currentScore} {t("result.wrongAnswers")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.quizButtonContainer}>
          <CustomButton
            title={t("result.retry")}
            onPress={handleRetry}
            style={[styles.nextButton, { backgroundColor: colors.active_surface }]}
            textStyle={{ color: colors.active, fontWeight: 'bold' }}
            icon={<Ionicons name="refresh-circle" size={25} color={colors.active} />}
          />
          {isNextQuizAvailable &&
            <CustomButton
              title={t("result.next_quiz")}
              onPress={handleNextQuiz}
              style={styles.nextButton}
              disabled={getToNextQuizProgress() < 100}
              textStyle={{ color: colors.white, fontWeight: 'bold' }}
              progress={getToNextQuizProgress()}
              icon={<Ionicons name="arrow-forward-circle" size={25} color={colors.white} />}
            />

          }
        </View>
        <CustomButton
          title={t("result.backHome")}
          onPress={handleBackToHome}
          style={styles.homeButton}
          icon={<Ionicons name="arrow-back" size={25} color={colors.title} />}
        />
      </View>
      {showFeedback && (
        <FeedbackModal
          visible={showFeedback}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </ViewContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  card: {
    backgroundColor: BG_CARD,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    gap: 15
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 16,
    color: "#666",
  },
  statsContainer: {
    marginTop: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  statText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    marginTop: 30,
    gap: 15,
  },
  quizButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  homeButton: {
    marginVertical: 0,
    // backgroundColor: colors.surface
  },
  nextButton: {
    marginVertical: 0,
    backgroundColor: colors.success,
    // width: '40%'
  },
  progressToNext: {
    position: 'absolute'
  }
});

export default QuizResult;
