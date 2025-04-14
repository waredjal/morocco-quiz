import { Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SectionHeader from "@/components/header/SectionHeader";
import { globalStyle } from "@/styles/globalStyles";
import SubscriptionCards from "@/components/premium/SubscriptionCards";

const NoHeartScreen = () => {
  const [handleSubscription, setHandleSubscription] = useState("Yearly");
  return (
    <SafeAreaView style={globalStyle.container}>
      <SectionHeader title=" " />
      <View style={styles.card}>
        <Image
          source={require("@/assets/images/no_heart_icon.png")}
          style={styles.icon}
        />
        <View style={styles.noHeartContainer}>
          <Text style={styles.noHeartText}>Run out of hearts</Text>
        </View>
      </View>
      <Text style={styles.text}>
        Access to all quizzes with limited hearts and a 4-hour recharge
      </Text>
      <SubscriptionCards
        handleSubscription={handleSubscription}
        setHandleSubscription={setHandleSubscription}
      />
    </SafeAreaView>
  );
};

export default NoHeartScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    paddingBottom: 50,
    paddingTop: 20,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 5,
    overflow: "hidden",
  },
  icon: {
    width: 200,
    height: 200,
    marginLeft: 80,
  },
  noHeartContainer: {
    height: 35,
    width: "80%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 25,
    backgroundColor: "#E1513E",
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  noHeartText: { color: "white" },
  text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
  },
});
