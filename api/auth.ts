import auth, {
  FirebaseAuthTypes,
  getAuth,
  signInWithCredential,
} from "@react-native-firebase/auth";
import appleAuth from "@invertase/react-native-apple-authentication";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { addToFirestore, getUser } from "./firestore";
import { defaultCategoryProgress, UserI } from "../utils/types";
import {
  getGuestUID,
  saveGuestUID,
  removeGuestUID,
} from "../utils/asyncStorage";
import { usernameGenerator } from "../utils/utils";
import useAppState from "@/utils/state/useStore";


GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
});



export async function googleSignIn() {
  const { language, initUser } = useAppState.getState();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  // Déconnexion de Google avant de se reconnecter
  await GoogleSignin.signOut();

  const idToken = (await GoogleSignin.signIn()).data?.idToken;

  if (!idToken) {
    throw new Error("No ID token found");
  }

  const credential = auth.GoogleAuthProvider.credential(idToken);

  return await signInWithCredential(getAuth(), credential).then(async (userCredential) => {
    // const dbUser = await getUser(x.user.uid as string);

    // if (!dbUser) {
    //   await createUser(
    //     x.user.uid,
    //     x.user.displayName || "",
    //     x.user.email || ""
    //   );
    //   return x.user.uid;
    // }

    // await initUser(dbUser._id);
    // return dbUser._id;
    return getUserId(userCredential.user)
  });
}

export async function guestSignIn() {
  try {
    const { initUser } = useAppState.getState();
    // const savedUID = await getGuestUID();

    // if (savedUID) {
    //   const dbUser = await getUser(savedUID);
    //   if (dbUser) {
    //     await initUser(savedUID);
    //     return savedUID;
    //   }
    // }

    const { user } = await auth().signInAnonymously();

    return getUserId(user, usernameGenerator())

    // await createUser(user.uid, usernameGenerator(), "");
    // await saveGuestUID(user.uid);

    // return user.uid;
  } catch (error: any) {
    console.error("Erreur lors de la connexion invité:", error);
    throw error;
  }
}

export async function appleSignIn() {
  try {

    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    if (!appleAuthRequestResponse.identityToken) {
      throw new Error("Apple Sign-In failed - no identify token returned");
    }

    const { identityToken, nonce } = appleAuthRequestResponse;

    console.log('identityToken, nonce', identityToken, nonce)

    if (!identityToken || !nonce) {
      throw new Error('Failed to retrieve identityToken or nonce from Apple Sign-In.');
    }

    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce
    );

    return auth()
      .signInWithCredential(appleCredential)
      .then(async (userCredential) => {

        return getUserId(userCredential.user)

      });
  } catch (e) {
    console.log("error in appleSignIn == ", e)
  }
}

export async function logout() {
  try {
    const currentUser = auth().currentUser;
    if (currentUser) {
      await auth().signOut();
    }
    await removeGuestUID();
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    throw error;
  }
}

async function createUser(uid: string, name: string, email: string) {
  const language = useAppState.getState().language;

  const newUser: UserI = {
    _id: uid,
    name: name,
    email: email,
    is_premium_user: false,
    created_at: Date.now(),
    language: language,
    progress: {
      history: defaultCategoryProgress,
      geography: defaultCategoryProgress,
      culture: defaultCategoryProgress,
    },
    hearts: {
      current: 5,
      lastHeartLost: null,
    },
    first_time_feedback: true,
  };

  await addToFirestore("users", newUser, uid).then(() => {
    const { initUser } = useAppState.getState();
    initUser(uid);
  });
}


const getUserId = async (firebaseAuthUser: FirebaseAuthTypes.User, userName?: string) => {

  try {

    const { initUser } = useAppState.getState();

    const dbUser = await getUser(firebaseAuthUser.uid as string);
    if (!dbUser) {
      await createUser(
        firebaseAuthUser.uid,
        userName || firebaseAuthUser.displayName || "",
        firebaseAuthUser.email || ""
      );
      return firebaseAuthUser.uid;
    }

    await initUser(dbUser._id);
    return dbUser._id;
  } catch (e) {
    console.log("error in getUserId - auth.ts", e)
  }
}