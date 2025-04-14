import { StateCreator } from "zustand";
import { CurrentQuiz, GroupedQuizzes } from "../types";
import { getGroupedQuizzes } from "@/api/quizzes";

export type QuizzesSlice = {
    groupedQuizzes: GroupedQuizzes[];
    currentQuiz: CurrentQuiz | null
    nextQuiz: CurrentQuiz | null
    initQuizzes: () => Promise<void>; // Define the async action here
    setCurrentQuiz: (currentQuiz: CurrentQuiz) => void
};

const createQuizzesSlice: StateCreator<QuizzesSlice> = (set, get) => ({
    groupedQuizzes: [],
    currentQuiz: null,
    nextQuiz: null,

    initQuizzes: async () => {
        const data: GroupedQuizzes[] = await getGroupedQuizzes();

        const currentQuiz = !get().currentQuiz ? getInitialQuiz(data) : get().currentQuiz
        const nextQuiz = getNextQuiz(data, currentQuiz!)

        set(state => ({
            groupedQuizzes: data,
            currentQuiz: currentQuiz,
            nextQuiz: nextQuiz || state.nextQuiz
        }));
    },
    setCurrentQuiz: (currentQuiz: CurrentQuiz) => {
        const nextQuiz = getNextQuiz(get().groupedQuizzes, currentQuiz)

        set({ currentQuiz, nextQuiz: nextQuiz || get().nextQuiz })
    },
});

const getInitialQuiz = (groupedQuizzes: GroupedQuizzes[]): CurrentQuiz => {

    const firstGroup = groupedQuizzes.sort((a, b) => a.order - b.order)[0]

    return {
        groupName: firstGroup.groupName,
        quiz: firstGroup.categories[0]
    }
}


const getNextQuiz = (groupedQuizzes: GroupedQuizzes[], currentQuiz: CurrentQuiz): CurrentQuiz | undefined => {

    const { groupName, quiz } = currentQuiz;
    const currentGroup = groupedQuizzes.find(group => group.groupName === groupName);

    if (!currentGroup) return null;

    const currentQuizIndex = currentGroup.categories.findIndex(q => q.id === quiz.id);

    if (currentQuizIndex === -1) return null;

    // Check if there's a next quiz in the current group
    if (currentQuizIndex < currentGroup.categories.length - 1) {

        const nextQuiz = currentGroup.categories[currentQuizIndex + 1];
        return { groupName, quiz: nextQuiz }

    } else {

        // Move to the next group by order
        const sortedGroups = [...groupedQuizzes].sort((a, b) => a.order - b.order);
        const currentGroupIndex = sortedGroups.findIndex(group => group.groupName === groupName);

        if (currentGroupIndex === -1 || currentGroupIndex === sortedGroups.length - 1) return null;

        const nextGroup = sortedGroups[currentGroupIndex + 1];

        if (nextGroup.categories.length > 0) {

            return { groupName: nextGroup.groupName, quiz: nextGroup.categories[0] }
        }
    }
}

export const getQuestionsNumber = (groupedQuiz: GroupedQuizzes): number => {
    let questionsNum = 0
    for (const quiz of groupedQuiz.categories) {
        questionsNum += quiz.questions.length
    }

    return questionsNum
}




export default createQuizzesSlice;
