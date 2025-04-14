import firestore, { setDoc } from "@react-native-firebase/firestore";
import {
    Categories,
    defaultCategoryProgress,
    GroupedQuizzes,
    Levels,
    Quiz,
} from "../utils/types";


export async function getGroupedQuizzes(): Promise<GroupedQuizzes[]> {
    try {
        const questionsRef = firestore().collection("groupedQuizzes");
        const snapshot = await questionsRef.get();

        if (snapshot.empty) {
            console.log("No questions found.");
            return [];
        }

        const data: GroupedQuizzes[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            groupName: doc.id,
            ...doc.data() as { groupProgress: number, categories: Quiz[] }
        }));
        return data;
    } catch (e) {
        console.error("Problème lors de la récupération des categories:", e);
        throw e;
    }
}


export async function createProgress(
    userId: string,
    category: Categories,
    difficulty: Levels
) {
    const userDoc = await firestore().collection("users").doc(userId).get();
    const currentProgress = userDoc.data()?.progress || {};

    return await firestore()
        .collection("users")
        .doc(userId)
        .update({
            progress: {
                ...currentProgress,
                [category]: {
                    ...currentProgress[category],
                    [difficulty]: defaultCategoryProgress[difficulty],
                },
            },
        });
}

export async function updateUserScore(
    UID: string,
    category: Categories,
    difficulty: Levels,
    score: number
) {
    const userDoc = await firestore().collection("users").doc(UID).get();
    const currentProgress = userDoc.data()?.progress || {};

    return await firestore()
        .collection("users")
        .doc(UID)
        .update({
            progress: {
                ...currentProgress,
                [category]: {
                    ...currentProgress[category],
                    [difficulty]: {
                        ...currentProgress[category][difficulty],
                        score,
                    },
                },
            },
        });
}

export async function updateUserCategory(
    UID: string,
    category: Categories,
    difficulty: Levels,
    isFinished: boolean
) {
    const userDoc = await firestore().collection("users").doc(UID).get();
    const currentProgress = userDoc.data()?.progress || {};

    return await firestore()
        .collection("users")
        .doc(UID)
        .update({
            progress: {
                ...currentProgress,
                [category]: {
                    ...currentProgress[category],
                    [difficulty]: {
                        ...currentProgress[category][difficulty],
                        is_finished: isFinished,
                    },
                },
            },
        });
}


export const overwritesCollection_saveCategoriesToFirestore = async (quizData: GroupedQuizzes[]) => {
    try {
        for (const group of quizData) {
            const levelDocRef = firestore().collection('categories').doc(group.groupName);

            // Prepare the data to be stored
            const dataToSave = {
                groupProgress: group.groupProgress || 0,
                categories: group.categories.map(category => ({
                    id: category.id,
                    name: category.name,
                    questions: category.questions,
                })),
            };

            // Save the document to Firestore
            await setDoc(levelDocRef, dataToSave);
            console.log(`Saved categories for group: ${group.groupName}`);
        }
    } catch (error) {
        console.error("Error saving categories to Firestore:", error);
    }
};

// export function formatToGroupedQuizzes(categories: OldCategory[]): GroupedQuizzes[] {
//   const groupedQuizzes: GroupedQuizzes[] = [];

//   const difficultyLevels = ["easy", "intermediate", "advanced"];

//   difficultyLevels.forEach((level) => {
//     const filteredCategories = categories
//       .map((category) => {
//         const questions = category[level as keyof OldCategory] as QuizQuestion[] | undefined;

//         if (!questions || questions.length === 0) return null;

//         return {
//           id: category.id,
//           name: category.name,
//           questions,
//         };
//       })
//       .filter((category): category is Category => category !== null);

//     if (filteredCategories.length > 0) {
//       groupedQuizzes.push({
//         groupName: level,
//         groupProgress: 0, // You can calculate progress based on user data if needed.
//         categories: filteredCategories,
//       });
//     }
//   });

//   return groupedQuizzes;
// }
// 
export async function renameCollection(oldCollectionName, newCollectionName) {
    const oldCollection = firestore().collection(oldCollectionName);
    const newCollection = firestore().collection(newCollectionName);

    const snapshot = await oldCollection.get();
    snapshot.forEach(async (doc) => {
        const docData = doc.data();
        await newCollection.doc(doc.id).set(docData);
    });

    // Optionally delete the old collection once you have copied all data
    // Firestore doesn't allow deleting collections directly, so you'd have to delete all documents
    snapshot.forEach(async (doc) => {
        await doc.ref.delete();
    });

    console.log(`Collection renamed from ${oldCollectionName} to ${newCollectionName}`);
}