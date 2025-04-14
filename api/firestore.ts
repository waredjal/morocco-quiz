import firestore, { doc, setDoc, Timestamp } from "@react-native-firebase/firestore";
import {
  Categories,
  Category,
  defaultCategoryProgress,
  GroupedQuizzes,
  Levels,
  OldCategory,
  Progress,
  QuizQuestion,
  UserI,
} from "../utils/types";

export async function addToFirestore(
  collection: string,
  data: any,
  doc?: string
) {
  try {
    if (doc) {
      return await firestore().collection(collection).doc(doc).set(data);
    } else {
      return await firestore().collection(collection).add(data);
    }
  } catch (e) {
    console.error("Problem while adding : ", e);
  }
}

export async function getUser(id: string) {
  try {
    const data = await firestore()
      .collection("users")
      .where("_id", "==", id)
      .limit(1)
      .get();
    const userData = data.docs.map((doc) => doc.data())[0] as UserI;
    return userData;
  } catch (e) {
    console.error(`Problem while fetching - getUser`, id);
  }
}

export async function getQuestions(): Promise<Category[]> {
  try {
    const questionsRef = firestore().collection("questions");
    const snapshot = await questionsRef.get();

    if (snapshot.empty) {
      console.log("No questions found.");
      return [];
    }

    const questions = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.id,
      ...doc.data(),
    }));
    return questions as Category[];
  } catch (e) {
    console.error("Problème lors de la récupération des questions:", e);
    throw e;
  }
}

export async function updateUsername(userId: string, newUsername: string) {
  try {
    return await firestore()
      .collection("users")
      .doc(userId)
      .update({ name: newUsername });
  } catch (e) {
    console.error("Problème lors de la mise à jour du nom d'utilisateur:", e);
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
  progress: Progress
) {
  // const userDoc = await firestore().collection("users").doc(UID).get();
  // const currentProgress = userDoc.data()?.progress || {};

  return await firestore()
    .collection("users")
    .doc(UID)
    .update({ progress });
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

export async function getHearts(UID: string) {
  const hearts = await firestore().collection("users").doc(UID).get();
  return hearts.data()?.hearts || 0;
}

export async function updateHearts(
  userId: string,
  hearts: number,
  lastHeartLost: Timestamp | null
) {
  try {
    console.log("userId==", userId, hearts,
      lastHeartLost)
    return await firestore()
      .collection("users")
      .doc(userId)
      .update({
        hearts: {
          current: hearts,
          lastHeartLost,
        },
      });
  } catch (e) {
    console.error("Erreur lors de la mise à jour des cœurs:", e);
    throw e;
  }
}

export const updateFirstTimeFeedback = async (userId: string) => {
  try {
    await firestore().collection("users").doc(userId).update({
      first_time_feedback: false,
    });
  } catch (error) {
    console.error("Error updating first time feedback:", error);
  }
};

export const addFeedback = async (userId: string, feedback: string) => {
  try {
    await firestore().collection("feedback").add({
      userId,
      feedback,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding feedback:", error);
  }
};

export const getAds = async () => {
  try {
    const ads = await firestore().collection("general").doc("ads").get();
    return ads.data()?.ads;
  } catch (error) {
    console.error("Error getting ads:", error);
  }
};

export async function updateUserData(doc: string, data: Partial<UserI>) {
  try {

    return firestore()
      .collection("users")
      .doc(doc)
      .update(data)
      .catch((error) => {
        console.error("updateUserData", error);
      });
  } catch (e) {
    console.log("error inside updateUserData - firestore.ts", e)
  }
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