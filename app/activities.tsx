import { StyleSheet, View } from "react-native";
import QuestionCard from "@/components/activities/ActivityQuestionCard";
import ProgressPill from "@/components/activities/ActivityCategory";
import { globalStyle } from "@/styles/globalStyles";
import Header from "@/components/header/Header";
import ActivityCard from "@/components/activities/ActivityCard";

const Activities = () => {
  const categories = [
    { label: "History" },
    { label: "Sport" },
    { label: "Geography" },
  ];
  const questions = [
    {
      question: "Who was the founder of the Almoravid dynasty in Morocco?",
      answer: "Youssef Ibn Tachfin",
      image: require("@/assets/images/question1.jpg"),
    },
    {
      question:
        "Which Moroccan city is famous for its blue-painted streets and buildings?",
      answer: "Chefchaouen",
      image: require("@/assets/images/question2.jpg"),
    },
  ];
  return (
    <View style={globalStyle.container}>
      <Header />
      <ActivityCard />
      <View style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <ProgressPill key={index} title={category.label} />
        ))}
      </View>
      <View>
        {questions.map((q, index) => (
          <QuestionCard
            key={index}
            question={q.question}
            answer={q.answer}
            image={q.image}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
});

export default Activities;
