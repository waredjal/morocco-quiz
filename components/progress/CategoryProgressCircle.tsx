import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { AnimatedCircularProgress } from 'react-native-circular-progress';

import Svg, { Circle } from "react-native-svg";
import { useTranslation } from "react-i18next";
import { globalStyle } from "@/styles/globalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/styles/globalColors";

type Props = {
  progress: number;
};

const ProgressCircle = ({ progress }: Props) => {
  const progressRadius = 38;
  const circumference = 2 * Math.PI * progressRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const { t } = useTranslation();
  return (
    <View style={styles.container}>


      <View style={styles.innerContainer}>

        <AnimatedCircularProgress
          size={160}
          width={8}
          fill={progress}
          tintColor={colors.accent}
          onAnimationComplete={() => console.log('onAnimationComplete')}
          lineCap='round'
        // backgroundColor="#f2f2f2"
        />
      </View>


      <LinearGradient
        colors={["#DFE2E8", "#F9F9FA"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.progressNumber}>{progress}%</Text>
        <Text style={styles.progressText}>{t('progress')}</Text>
      </LinearGradient>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    // display: "flex",
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
    width: 170,
    height: 170,
    borderRadius: 100,
    alignSelf: 'center',
    ...globalStyle.shadowBox,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: '#fff',
  },
  innerContainer: {
    position: "absolute",
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 140,
    borderRadius: 100,
    backgroundColor: "#F5F7FB",
    ...globalStyle.shadowBox,
    shadowRadius: 15,
    shadowOpacity: 0.4
  },
  gradient: {
    width: 120,
    height: 120,
    borderRadius: 100,
    position: "absolute",
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...globalStyle.shadowBox,
    shadowRadius: 45,

  },
  progressText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: colors.secondary_text,
  },
  progressNumber: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    // color: colors.gray,
  },
});

export default ProgressCircle;
