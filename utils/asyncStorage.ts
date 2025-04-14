import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveGuestUID(uid: string) {
  await AsyncStorage.setItem("guestUID", uid);
}

export async function getGuestUID() {
  return await AsyncStorage.getItem("guestUID");
}

export async function removeGuestUID() {
  try {
    await AsyncStorage.removeItem("guestUID");
  } catch (e) {
    console.error("Erreur lors de la suppression du guestUID:", e);
  }
}

export async function getCategory() {
  return await AsyncStorage.getItem("category");
}

export async function getDifficulty() {
  return await AsyncStorage.getItem("difficulty");
}

export async function saveCategory(category: string) {
  await AsyncStorage.setItem("category", category);
}

export async function saveDifficulty(difficulty: string) {
  await AsyncStorage.setItem("difficulty", difficulty);
}
