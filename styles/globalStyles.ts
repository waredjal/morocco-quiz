import { Platform, StyleSheet } from "react-native";

export const globalStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  header: {},
  shadowBox: {
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow position for iOS
    shadowOpacity: 0.15, // Shadow transparency for iOS
    shadowRadius: 2, // Shadow blur for iOS
    elevation: 5, // Shadow for Android
  },
});

export const shadowStyle = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  android: {
    elevation: 5,
  },
});