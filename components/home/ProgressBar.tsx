import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, Alert } from "react-native";
import { CustomButton } from "../CustomButton";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import useAppState from "@/utils/state/useStore";
import { colors } from "@/styles/globalColors";
import { QUIZ_ICONS } from "@/utils/quizIcons";
import { generalStyles } from "@/style/generalStyles";
import HalfCircleProgress from "./HalfCirclProgress";


interface ProgressBarProps {
  color?: string;
  backgroundColor?: string;
  height?: number;
}

const ProgressBar = ({
  color = "#E74C3C",
  backgroundColor = "rgba(255,255,255,0.2)",
  height = 6,
}: ProgressBarProps) => {

  const [progress, setProgress] = useState(0);
  const { progress: userProgress, currentQuiz, setCurrentQuiz, nextQuiz } = useAppState();

  const { t } = useTranslation();
  const router = useRouter();


  useEffect(() => {
    const calculatePercentage = () => {
      const score = userProgress?.[currentQuiz?.groupName]?.[currentQuiz?.quiz.name]?.score || 0;
      const total = currentQuiz?.quiz.questions.length || 0;
      return (score / total) * 100;
    };
    const percentage = calculatePercentage();
    setProgress(percentage);
  }, [currentQuiz]);


  const getButtonTitle = () => {
    if (progress === 0) return t('quiz.start');
    if (progress < 85) return t('quiz.try_again');
    return t('quiz.next');
  }

  console.log("nextQuiz===", nextQuiz)

  const icon = QUIZ_ICONS[currentQuiz?.quiz.name].icon
  // TODO: add localization to quiz data
  return (
    <>
      <View>

        {/* {t(`home.category.${currentQuiz?.groupName}`)} - {t(`levels.${currentQuiz?.quiz.name}`)} */}

        <View style={styles.progressCard}>
          <View style={styles.progressTitleContainer}>
            <View style={[generalStyles.row, { gap: 15 }]}>
              <View style={styles.iconContainer}>
                <Image source={icon} style={styles.icon} />
              </View>
              <View>
                <Text style={styles.progressSubTitle}>{currentQuiz?.groupName} </Text>
                <Text style={styles.progressTitle}>{currentQuiz?.quiz.name}</Text>
              </View>
            </View>
          </View>
          <View style={styles.progressCircle}>
            <HalfCircleProgress progress={progress} />
            <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
          </View>
          <CustomButton
            title={getButtonTitle()}
            variant="primary"
            onPress={() => {
              if (progress >= 85) {
                setCurrentQuiz(nextQuiz!)
              }
              router.push("/quiz");
            }}
            textStyle={{ color: colors.accent, fontSize: 18 }}
            style={styles.button}
          />
        </View>
      </View>

      <View style={styles.messageCard}>
        <Text style={styles.messageText}>Next Quiz:</Text>
        <Text style={styles.nextQuizTitle}>{nextQuiz?.quiz?.name}</Text>
        <CustomButton
          title={t('home.next_quiz_title')}
          variant='secondary'
          onPress={() => {
            if (progress >= 85) {
              setCurrentQuiz(nextQuiz!)
              router.push("/quiz");
            } else {
              Alert.alert(t("home.no_enough_progress")) // TODO: implement logic
            }
          }}
          style={{ backgroundColor: colors.white }}
          textStyle={{ fontSize: 18, color: colors.active }}
        />
      </View>

    </>
  );
};



const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.accent_surface,
    borderWidth: 1,
    borderColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
  },
  progressCard: {
    backgroundColor: colors.accent,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  progressTitleContainer: {
    gap: 10
  },
  progressTitle: {
    color: "#FFF",
    fontWeight: 'bold',
    fontSize: 25,
  },
  progressSubTitle: {
    color: "#fff",
    // fontWeight: 'bold',
    fontSize: 18,
  },
  progressCircle: {
    alignItems: "center",
    justifyContent: "center",
    // height: 150,
    paddingVertical: '15%',
    width: "100%",
    gap: 20,
  },
  progressText: {
    position: 'absolute',
    bottom: 35,
    color: "#FFF",
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
  },
  nextText: {
    color: colors.secondary_text,
    fontSize: 15,
    textAlign: "center"

  },
  messageCard: {
    display: "flex",
    justifyContent: "center",
    gap: 15,
    backgroundColor: colors.surface,
    borderWidth: .5,
    borderColor: colors.border,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    // alignItems: "flex-start",
    // ...shadowStyle,
  },
  messageText: {
    fontSize: 12,
    marginLeft: 10,
    color: colors.secondary_text
  },
  nextQuizTitle: {
    fontSize: 16,
    marginLeft: 10,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttons: {},
  button: {
    backgroundColor: colors.white,
  },
});

export default ProgressBar;
