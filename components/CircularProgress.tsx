import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  textColor?: string;
}

export const CircularProgress = ({
  percentage,
  size = 200,
  strokeWidth = 15,
  color = "#7aac67",
  textColor = "#333",
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circum = radius * 2 * Math.PI;
  const svgProgress = ((100 - percentage) * circum) / 100;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#f1f1f1"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={`${circum} ${circum}`}
          strokeDashoffset={svgProgress}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <Text style={[styles.progressText, { color: textColor }]}>
          {percentage}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 200,
  },
});
