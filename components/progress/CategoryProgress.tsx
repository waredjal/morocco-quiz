import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { globalStyle } from "@/styles/globalStyles";
import ProgressBar from "../home/ProgressBar";
import CustomProgressBar from "../CustomProgressBar";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Quiz } from "@/utils/types";
import useAppState from "@/utils/state/useStore";

import { QUIZ_ICONS } from "@/utils/quizIcons"
import { colors } from "@/styles/globalColors";
import ScoreProgress from "./ScoreProgress";

type Props = {
  index: number;
  quiz: Quiz
  disabled: boolean;
  onPress(): void
};

const CategoryProgress = ({ index, quiz, disabled, onPress }: Props) => {


  const { getQuizProgress } = useAppState()

  const icon = QUIZ_ICONS[quiz.name].icon
  const quizProgress = getQuizProgress(quiz.name)

  return (
    <TouchableOpacity
      activeOpacity={.8}
      onPress={onPress}
      key={index}
      style={[styles.categoryCard, disabled && { opacity: 0.5 }]}
    >


      <View style={styles.titleAndIcon}>

        <View style={styles.iconContainer}>
          <Image source={icon} style={styles.icon} />
          {/* <AnimatedCircularProgress
            size={55}
            width={3}
            fill={100}
            prefill={100}
            // tintColor={quizProgress == 100 ? colors.success : colors.accent}
            tintColor={colors.accent} // TODO: handle color logic
            lineCap='round'
            backgroundColor="#fdfdfd"
            style={{ position: 'absolute' }}
          /> */}
        </View>
        <View style={{ gap: 8 }}>
          <Text style={styles.categoryName}>{quiz.name}</Text>
          <Text style={styles.categoryDesc}>
            {quiz.desc ||
              // '// TODO: add desc to data'
              'Découvre les bases de la culture marocaine : vêtements traditionnels, fêtes, plats populaires et coutumes du quotidien. Idéal pour se familiariser avec l’essentiel.'
            }
          </Text>
        </View>
      </View>

      <ScoreProgress progress={quizProgress} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
    backgroundColor: colors.surface,
    // borderWidth: 1,
    // borderColor: colors.gray,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    // ...globalStyle.shadowBox,
    // shadowRadius: 10,

  },
  titleAndIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.light_gray,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
    // textAlign: "center",
    color: "#333",
  },
  categoryDesc: {
    fontSize: 14,
    color: colors.secondary_text,
    width: '25%'
  },
  progressBar: {
    width: "100%",
    height: 5,
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ff4500",
  },
});

export default CategoryProgress;
