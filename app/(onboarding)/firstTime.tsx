import { Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { CustomButton } from "@/components/CustomButton";
import { useRouter } from "expo-router";

const FirstTime = () => {
  const router = useRouter();
  const handlePress = () => {
    router.navigate("./login");
  };
  return (
    <View style={styles.bg}>
      <BlurView intensity={50} tint="light" style={styles.gradientContainer}>
        <LinearGradient
          colors={["rgba(255, 253, 254,0.8)", "#fbe7e4"]}
          style={styles.linearGradient}
        >
          <View style={styles.textContainer}>
            <Text style={styles.text1}>
              Welcome to Morocco Quiz, discover the rich history of this
              beautiful country
            </Text>
            <Text style={styles.text2}>
              Play quizzes, earn hearts, and explore themes !
            </Text>
          </View>
          <CustomButton
            title="Get started"
            variant="primary"
            onPress={handlePress}
            style={styles.button}
          />
        </LinearGradient>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "green",
  },
  gradientContainer: {
    flex: 1,
    width: "100%",
    height: "40%",
    position: "absolute",
    alignItems: "center",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    overflow: "hidden",
  },
  linearGradient: {
    flex: 1,
    width: "100%",
    justifyContent: "space-around",
    padding: 20,
    alignItems: "center",
  },
  textContainer: {
    flex: 0.7,
    width: "90%",
    justifyContent: "space-between",
    textAlign: "center",
  },
  text1: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  text2: {
    fontSize: 15,
    textAlign: "center",
  },
  button: {
    width: "65%",
  },
});

export default FirstTime;
