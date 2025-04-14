import React from "react";
import { View, ActivityIndicator, StyleSheet, ColorValue } from "react-native";

type Props = {
  size?: "small" | "large" | undefined;
  color?: ColorValue;
};

const Loader = ({ size = "large", color = "#E1513E" }: Props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loader;
