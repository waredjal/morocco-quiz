import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
} from "react-native";
import SectionHeader from "@/components/header/SectionHeader";
import QuestionCard from "@/components/quiz/QuestionCard";
import { useHeartStore } from "@/utils/state/heartStore";
import { shuffleArray } from "@/utils/utils";
import { useAdStore } from "@/utils/state/adStore";
import AddBanner from "@/components/home/AddBanner";
import ViewContainer from "@/components/layout/ViewContainer";
import Premium from "./premium";
import { router } from "expo-router";
import RefillHearts from "@/components/premium/RefillHearts";
import useAppState from "@/utils/state/useStore";

const Quiz = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [random, setRandom] = useState(0);
  const [showPaywall, setShowPaywall] = useState<boolean>(false)
  const [showRefillHearts, setShowRefillHearts] = useState<boolean>(false)


  const { language, setCurrentScore, is_premium_user: isPremium } = useAppState()
  const { currentQuiz }: any = useAppState();
  const { hearts } = useHeartStore();
  const { ads } = useAdStore();



  const [shuffledQuestion, setShuffledQuestion]: any = useState(
    shuffleArray(currentQuiz.quiz.questions)
  );

  // useEffect(() => { // TODO: put back
  //   handleNoHearts()
  // }, [hearts])

  useEffect(() => {
    setCurrentScore(0);
  }, [shuffledQuestion]);



  /**
   * shows the paywall if no more hears and if normal user
   */
  const handleNoHearts = () => {
    if (!isPremium && hearts.current == 0) {
      setShowRefillHearts(true)
    }
  }

  /**
   * if the user pays it closes it closes the modal to continue the quiz
   * otherwise navigates to home
   */
  const handlePaywallClose = () => {
    if (isPremium) {
      setShowPaywall(false)
    } else {
      router.back()
    }
  }

  const answerIndex = shuffledQuestion[questionIndex].answer;
  const answer: any = shuffledQuestion[questionIndex].options.find(
    (o: any) => o.id === answerIndex
  );

  const getLocalizedQuestion = () => {
    const question = shuffledQuestion[questionIndex];
    return question[`question_${language}` || "question_en"];
  };

  const getLocalizedAnswer = () => {
    return answer?.[`option_${language}`];
  };

  const getLocalizedOptions = () => {
    return shuffledQuestion[questionIndex].options.map((opt: any) => ({
      title: opt[`option_${language}`],
      id: opt.id,
    }));
  };

  const handleShowingPaywall = () => {
    setShowRefillHearts(false)

    setTimeout(() => setShowPaywall(true), 500) // avoid showing multiple modal issues in ios
  }

  const hideHeartsModal = useCallback(() => {
    setShowRefillHearts(false);
    router.back();
  }, []);

  if (!shuffledQuestion || !answer) return null;

  return (
    <>
      <ViewContainer style={styles.container}>

        <SectionHeader
          title={`Question ${questionIndex + 1}/${shuffledQuestion.length}`}
        />
        <QuestionCard
          question={getLocalizedQuestion()}
          options={getLocalizedOptions()}
          answer={getLocalizedAnswer()}
          setQuestionIndex={setQuestionIndex}
          questionIndex={questionIndex}
          totalQuestions={shuffledQuestion.length}
          setRandom={setRandom}
          isPremium={isPremium}
        />
        <Premium isModal isVisible={showPaywall} onClose={handlePaywallClose} />

        <RefillHearts
          visible={showRefillHearts}
          hide={hideHeartsModal}
          goToPremiumScreen={handleShowingPaywall}
          hideModal={() => setShowRefillHearts(false)} />

        {
          !isPremium && ads && hearts.current > 0 // TODO: put back
          // true
          && (
            <AddBanner />
          )}
      </ViewContainer>
    </>
  );
};

const styles = StyleSheet.create({
  // container: { flex: 1, padding: 20, backgroundColor: "#FFF" },
  adContainer: {
    height: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  adImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default Quiz;
