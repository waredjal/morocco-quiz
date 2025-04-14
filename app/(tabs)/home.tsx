import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import Header from "../../components/header/Header";
import { globalStyle } from "../../styles/globalStyles";
import { useRouter } from "expo-router";
import auth from "@react-native-firebase/auth";
import { useCategoryStore } from "@/utils/state/categoryStore";
import { setQuestionsByCategoryAndDifficulty } from "@/utils/state/questionStore";
import { Feather } from "@expo/vector-icons";
import Loader from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { initHeart } from "@/utils/state/heartStore";
import ProgressBar from "@/components/home/ProgressBar";
import useAppState from "@/utils/state/useStore";

const Home = () => {
  const [initializing, setInitializing] = useState(true);
  const { category, difficulty } = useCategoryStore();
  const { initUser } = useAppState.getState();

  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (user) => {
      if (user) {
        console.log("uid in home", user.uid)
        await initUser(user.uid);
        await initHeart(user.uid);
        setQuestionsByCategoryAndDifficulty(category, difficulty);
      }
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, []);

  useEffect(() => {
    if (category && difficulty) {
      setQuestionsByCategoryAndDifficulty(category, difficulty);
    }
  }, [category, difficulty]);

  if (initializing) return <Loader />;

  const LoadingFallback = () => <Loader />;

  return (

    <View style={[globalStyle.container]}>
      <Header />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("home.headerTitle")}</Text>
        <Image
          style={styles.icon}
          source={require("@/assets/images/happy-face.png")}
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'space-evenly' }}>

        {/* Category Title and Button */}
        <View style={styles.categoryRow}>
          <Text style={styles.chapterTitle}>{t("home.progressBar.title")}</Text>
          {/* <TouchableOpacity
          style={styles.chapterButton}
          onPress={() => router.push("../categories")}
        >
          <Feather name="repeat" size={20} style={styles.chapterIcon} />
        </TouchableOpacity> */}
        </View>
        <ProgressBar
          color="#FFF"
          backgroundColor="rgba(255,255,255,0.2)"
          height={8}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    paddingRight: 10,
  },
  icon: {
    height: 30,
    width: 30,
  },
  chapterIcon: {
    margin: 15,
    color: "#666",
  },
  chapterTitle: {
    fontSize: 20,
    color: "#666",
  },
  chapterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
  },
  chapterButtonText: {
    fontSize: 20,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default Home;
