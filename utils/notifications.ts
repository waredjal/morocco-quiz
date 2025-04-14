import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid } from "react-native";
import { Platform } from "react-native";

export async function requestUserPermission() {
  if (Platform.OS === "ios") {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      return await getFCMToken();
    }
  } else {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return await getFCMToken();
  }
}

export async function getFCMToken() {
  try {
    const fcmToken = await messaging().getToken();
    return fcmToken;
  } catch (error) {
    console.log("Error getting FCM token:", error);
    return null;
  }
}
