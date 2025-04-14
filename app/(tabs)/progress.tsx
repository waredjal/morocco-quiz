import React, { Suspense } from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import SectionHeader from "@/components/header/SectionHeader";
import { useTranslation } from "react-i18next";
import Loader from "@/components/Loader";

import { colors, PRIMARY } from "@/styles/globalColors";
import { Quiz } from "@/utils/types";
import useAppState from "@/utils/state/useStore";
import ViewContainer from "@/components/layout/ViewContainer";
import StyledText from "@/components/StyledText";
import CustomProgressBar from "@/components/CustomProgressBar";
import { capitalizeFirstLetter } from "@/utils/helper";
import { useRouter } from "expo-router";
import { getQuestionsNumber } from "@/utils/state/quizzesState";
import ScoreProgress from "@/components/progress/ScoreProgress";


// Lazy load les composants
const QuizProgress = React.lazy(
  () => import("@/components/progress/CategoryProgress")
);
const ProgressCircle = React.lazy(
  () => import("@/components/progress/CategoryProgressCircle")
);

const Progress = () => {
  const router = useRouter();

  const { groupedQuizzes, getGroupProgress, setCurrentQuiz } = useAppState();

  const { t } = useTranslation();


  const navigateToQuiz = (groupName: string, quiz: Quiz) => {
    setCurrentQuiz({ groupName, quiz })
    router.push("/quiz");
  }


  const generalProgress = +(
    (groupedQuizzes.reduce((sum, group) => sum + getGroupProgress(group.groupName, getQuestionsNumber(group)), 0) /
      (groupedQuizzes.length * 100)) *
    100
  ).toFixed(2);

  const LoadingFallback = () => <Loader size="large" color={PRIMARY} />;

  return (
    <ViewContainer style={{ gap: 15 }}>
      <SectionHeader title={t("title.category")} noBackBtn />

      {/* Progress Circle avec Suspense */}
      <Suspense fallback={<LoadingFallback />} >
        <ProgressCircle
          progress={generalProgress}
        />
      </Suspense>

      <Text style={styles.mainDesc}>
        {t('categories_tab.main_desc')}
      </Text>

      {/* Categories avec Suspense */}
      <ScrollView contentContainerStyle={styles.categoriesContainer}>
        {groupedQuizzes.sort((a, b) => a.order - b.order).map((group, index) => {
          const groupProgress = Math.floor(getGroupProgress(group.groupName, getQuestionsNumber(group)))
          return (
            <Suspense key={index} fallback={<LoadingFallback />}>
              <View style={styles.groupNameContainer}>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>

                  <StyledText fontSize={28} type='heading'>
                    {capitalizeFirstLetter(t(group.groupName))}
                  </StyledText>
                  <ScoreProgress progress={groupProgress} />
                </View>

                <CustomProgressBar progress={groupProgress} />
              </View>

              {group.categories.map((quiz: Quiz, index: numbers) =>

                <QuizProgress
                  onPress={() => navigateToQuiz(group.groupName, quiz)}
                  key={quiz.name}
                  index={index}
                  quiz={quiz}
                  showDivider={group.categories[index + 1]}
                  disabled={
                    quiz.name === t("home.progress.personalities") ||
                    quiz.name === t("home.progress.monuments")
                  }
                />

              )}
            </Suspense>
          )
        })}
      </ScrollView>
    </ViewContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 2,
  },
  categoriesContainer: {
    // flexDirection: "row",
    // flexWrap: "wrap",
    // justifyContent: "space-between",
    // paddingHorizontal: 20,
    // paddingTop: 10
  },
  groupNameContainer: {
    width: '100%',
    paddingVertical: '8%',
    gap: 15
  },
  mainDesc: {
    color: colors.secondary_text,
    textAlign: 'center',
    paddingTop: 8,
    fontSize: 16
  }

});

export default Progress;
