import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useHeartStore } from "@/utils/state/heartStore";
import { useRouter } from "expo-router";
import { Timestamp } from "@react-native-firebase/firestore";
import useAppState from "@/utils/state/useStore";
import auth from "@react-native-firebase/auth";


const Header = () => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  const { hearts, addHeart } = useHeartStore();
  const { _id, is_premium_user: isPremium, name: username, email } = useAppState();

  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());

      if (hearts.lastHeartLost && hearts.current < 5) {
        const timeSinceLastHeart =
          Date.now() - hearts.lastHeartLost.toDate().getTime();
        const oneHour = 60 * 60 * 1000;

        if (timeSinceLastHeart >= oneHour) {
          addHeart(_id);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [hearts, _id]);

  const formatTimeRemaining = (timestamp: Timestamp | null): string => {
    if (!timestamp) return "";
    const nextHeartTime = timestamp.toDate().getTime() + 60 * 60 * 1000;
    const remaining = nextHeartTime - currentTime;

    if (remaining <= 0) return "0:00";

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  /**
   * return 'guest' is the user is in guest mode
   * otherwise the userName if available otherwise the email
   */
  const getUserTitle = () => {
    if (auth().currentUser?.isAnonymous) {
      return t('home.guest')
    } else {
      return username || email
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/app-icon.png")}
          style={styles.logoIcon}
        />
      </View>
      <View style={styles.subContainer}>
        <View style={styles.leftSection}>
          <Text style={styles.greeting}>{t("home.greeting")}</Text>
          <Text style={styles.username}>{getUserTitle()}</Text>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity
            onPress={() => { !isPremium && router.push("/premium") }}
            style={styles.heartContainer}
          >
            {hearts.current < 5 && hearts.lastHeartLost && !isPremium && (
              <Text style={styles.timerBadge}>
                {formatTimeRemaining(hearts.lastHeartLost)}
              </Text>
            )}
            <Ionicons name="heart" size={24} color="#FF0000" />
            <Text style={styles.heartText}>
              {" "}
              x {!isPremium ? hearts.current : "∞"}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => console.log("notifications")}>
            <Ionicons name="notifications-outline" size={24} color="#000000" />
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  subContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  leftSection: {
    flexDirection: "column",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    marginRight: 16,
  },
  logoIcon: {
    height: 50,
    width: 50,
    borderRadius: 15
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  greeting: {
    fontSize: 14,
    color: "#666",
  },
  heartContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  heartText: {
    fontSize: 16,
    color: "#333",
  },
  timerBadge: {
    backgroundColor: "#FF6B6B",
    color: "white",
    fontSize: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default Header;
