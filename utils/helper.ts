import { AVPlaybackStatus, Audio } from "expo-av";
import {
    GroupedQuizzes,
    Language,
    UserI,
} from "./types";
import analytics from "@react-native-firebase/analytics";
// import useAppState from "./state/useStore";
// import {
//     getUserData,
//     updateUserData as updateUserDataDB,
//     writeToDocument,
// } from "./firebase/firestore";
// import { posthog } from "./posthog";
import { PaywallProduct } from "./InAppPurchaseController";
import { Platform } from "react-native";
// import { afLogEvent, mixpanel } from "./analytics";
import firestore from "@react-native-firebase/firestore";
// import { channel } from "expo-updates";
import Purchases, { PACKAGE_TYPE } from "react-native-purchases";
// import {
//     cancelScheduledNotificationAsync,
//     scheduleNotificationAsync,
// } from "expo-notifications";
import i18n from "@/i18n.config";
import auth from "@react-native-firebase/auth";
// import { showToast } from "./Alert";
// import { authErrors } from "./constants";
// import { LOGIN_TYPE } from "./enums";
// import colors from "@/styles/colors";
import { updateUserData } from "@/api/firestore";
import useAppState from "./state/useStore";
import * as FileSystem from 'expo-file-system';


export async function playAudio(
    audio: any,
    onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void
): Promise<Audio.Sound | undefined> {
    try {
        if (audio) {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
            });

            const { sound } = await Audio.Sound.createAsync(
                typeof audio === "string" ? { uri: audio } : audio,
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );

            await sound.playAsync();

            return sound;
        } else {
            onPlaybackStatusUpdate && onPlaybackStatusUpdate({ didJustFinish: true });
        }
    } catch (error) {
        throw new Error(error as string);
    }
}

export function isDarkColor(hex: string) {
    "worklet";
    // https://stackoverflow.com/a/69353003/9999202
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // https://stackoverflow.com/a/58270890/9999202
    const hsp = Math.sqrt(0.299 * r ** 2 + 0.587 * g ** 2 + 0.114 * b ** 2);
    return hsp < 170;
}

// This function generates a random string of 24 hex characters (0-9, a-f)
export function generateID(): string {
    let id = "";

    for (let i = 0; i < 24; i++) {
        const randomDigit = Math.floor(Math.random() * 10);
        id += randomDigit.toString();
    }

    return id;
}

export const shuffleArray = (array: any[]): any[] => {
    const newArray = [...array]; // Create a new array to avoid modifying the original array

    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
};

export const successSound = () =>
    new Promise(async (resolve, reject) => {
        try {
            const sound = await playAudio(
                require("../assets/audio/correct.mp3"),
                (status) => {
                    if (status?.didJustFinish) {
                        sound?.unloadAsync().catch(() => { });
                        resolve(true);
                    }
                }
            );
        } catch (error) {
            reject(error);
        }
    });

export const wrongSound = () =>
    new Promise(async (resolve, reject) => {
        try {
            const sound = await playAudio(
                require("../assets/audio/wrong.mp3"),
                (status) => {
                    if (status?.didJustFinish) {
                        sound?.unloadAsync().catch(() => { });
                        resolve(true);
                    }
                }
            );
        } catch (error) {
            reject(error);
        }
    });


export const timerSound = (volume = 1.0) =>
    new Promise(async (resolve, reject) => {
        try {
            const timerSound = await playAudio(
                require("../assets/audio/timer.mp3"),
                (status) => {
                    if (status?.didJustFinish) {
                        timerSound?.unloadAsync().catch(() => { });
                        resolve(true);
                    }
                }
            );

            // Set volume after loading the sound
            await timerSound.setVolumeAsync(volume);
        } catch (error) {
            reject(error);
        }
    });


export const sendEbook = async (
    email: string,
    language: Language
): Promise<void | Response> => {
    const url = "https://api.sendinblue.com/v3/smtp/email";

    const body = {
        sender: { name: "Vivre Maroc", email: "contact@vivremaroc.com" },
        to: [
            {
                email,
            },
        ],
        replyTo: { email: "contact@vivremaroc.com", name: "Vivre Maroc" },
        params: { email },
        templateId: language === "fr" ? 14 : 20,
    };

    const options = {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            "api-key":
                "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",
        },
        body: JSON.stringify(body),
        json: true,
    };

    try {
        return await fetch(url, options);
    } catch (error) {
        console.error(error);
    }
};

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getRandomOptions(
    options: OptionI[],
    correctOption: OptionI,
    length: number
) {
    const allOptions = [correctOption];

    while (allOptions.length < length) {
        const randomOption = options[Math.floor(Math.random() * options.length)];
        if (!allOptions.some((opti) => opti._id === randomOption._id)) {
            allOptions.push(randomOption);
        }
    }

    return allOptions;
}

export function generateExercises(lessonOptions: OptionI[]): ExerciseI[] {
    if (lessonOptions.length > 0) {
        let matchItemsExerciseAdded = false;

        let data = shuffleArray(
            lessonOptions
                .map((option) => {
                    const correctOption = option;

                    let type: ExerciseType;
                    let options: OptionI[];

                    const randomType = Math.random();

                    if (randomType < 0.33) {
                        type = "guess_meaning";
                        options = getRandomOptions(lessonOptions, correctOption, 3);
                    } else if (randomType < 0.66) {
                        type = "listen_choose";
                        options = getRandomOptions(lessonOptions, correctOption, 2).map(
                            (option) => ({
                                ...option,
                                isCorrect: option.text === correctOption.text,
                            })
                        );
                    }

                    return {
                        _id: generateID(),
                        options,
                        type,
                    };
                })
                .filter((e) => e?.options?.length > 0)
        );

        const LIMIT = 10;

        data = data.slice(0, LIMIT - 1);

        if (!matchItemsExerciseAdded) {
            data.push({
                _id: generateID(),
                options: lessonOptions,
                type: "match_items",
            });
            matchItemsExerciseAdded = true;
        }

        return data;
    } else {
        return [];
    }
}

// export async function logEvent(
//     event: string,
//     params?: {
//         [key: string]: any;
//     }
// ) {
//     if (channel === "production") {
//         // const name = event.toLocaleLowerCase().split(" ").join("_");
//         // posthog.capture(name, params);
//         // mixpanel.track(name, params);
//         // await analytics().logEvent(name, params);
//     }
// }

export function stringToDate(date: string): Date {
    const parts = date.split("/");
    // pay attention to the month (parts[1]); JavaScript counts months from 0:
    // January - 0, February - 1, etc.
    const jsDate = new Date(parts[0], parts[1] - 1, parts[2]);
    return jsDate;
}

export function calcScore(questions: number, errors: number): number {
    const result = ((questions - errors) / questions) * 100;
    return isNaN(result) ? 0 : result;
}

export async function activateUser(planType: PACKAGE_TYPE) {
    try {

        const { setUserData, language, email, _id } = useAppState.getState();
        // update local state
        const newData = {
            is_premium_user: true,
            premium_type: planType,
        }
        setUserData(newData);
        // if user is signed in update db
        if (_id) {
            await updateUserData(_id, newData);
            // email && planType === PACKAGE_TYPE.ANNUAL &&
            //     (await sendEbook(email, language)); // TODO: implement
        }
    } catch (e) {
        if (__DEV__) {
            console.error("error in activateUser - helper.ts", e)
        }
    }
}

// export async function trackPurchase(
//     product: PaywallProduct,
//     from: string,
//     triggeredBy: string
// ) {
//     const price = product.revenueCatPackage.product.price;
//     const currency = product.revenueCatPackage.product.currencyCode.toString();

//     logEvent("user_subscribed", {
//         plan: product.revenueCatPackage.packageType.toLowerCase(),
//         plan_id: product.id,
//         platform: Platform.OS,
//         from,
//         trigger: triggeredBy === undefined ? "" : triggeredBy,
//     });

//     const afTime = Date.now();
//     await afLogEvent("af_purchase", {
//         af_revenue: price,
//         af_currency: currency,
//     });
//     console.log(`afLogEvent took: ${Date.now() - afTime}ms`);
// }

/**
 * 5000 api calls max monthly limit
 * @param from
 * @param to
 * @param amount
 * @returns
 */
export async function convertCurrency(
    from: string,
    to: string,
    amount: number
) {
    return fetch(
        `https://api.fxfeed.io/v1/convert?api_key=fxf_0X7iPmZmagnVJj3sYumO&from=${from}&to=${to}&amount=${amount}`
    );
}

export function calculatePercentageDifference(
    oldValue: number,
    newValue: number
): number {
    if (oldValue === 0) {
        return 0;
    }
    const difference = ((newValue - oldValue) / oldValue) * 10;
    return Math.floor(difference) * 10;
}

export async function trackAffiliateSale(
    code: string,
    affiliate: string,
    price: number,
    currency: string
) {
    logEvent("affiliate_sale", {
        code,
        affiliate,
    });

    const affiliateDocRef = firestore().collection("affiliates").doc(affiliate);

    if (currency === "USD") {
        await affiliateDocRef.set(
            {
                id: affiliate,
                sales: firestore.FieldValue.arrayUnion({
                    amount: price,
                    code,
                    date: Date.now(),
                }),
            },
            { merge: true } // Ensures the document is created if it doesn't exist
        );
    } else {
        const convertPrice = await convertCurrency(currency, "USD", price);
        const usdPrice = await convertPrice.json();
        await affiliateDocRef.set(
            {
                id: affiliate,
                sales: firestore.FieldValue.arrayUnion({
                    amount: usdPrice.result,
                    code,
                    date: Date.now(),
                }),
            },
            { merge: true } // Ensures the document is created if it doesn't exist
        );
    }
}

export function isVersionLessThan(valA: string, valB: string): boolean {
    if (typeof valA === "string" && typeof valB === "string") {
        const valAParts = valA.split(".").map(Number);
        const valBParts = valB.split(".").map(Number);

        const length = Math.max(valAParts.length, valBParts.length);

        for (let i = 0; i < length; i++) {
            const valAPart = valAParts[i] || 0; // Defaults to 0 if undefined
            const valBPart = valBParts[i] || 0; // Defaults to 0 if undefined

            if (valAPart < valBPart) return true;
            if (valAPart > valBPart) return false;
        }
    }

    return false; // They are equal, so not less than
}

// Function to schedule a notification for a word
export const scheduleWordOfTheDayNotification = async (
    date: Date,
    word: DictionaryWord,
    language: string
): Promise<void> => {
    await scheduleNotificationAsync({
        identifier: word._id,
        content: {
            title: i18n.t("daily_darija.title"),
            body: `${word.text} = ${word?.[`translation_${language}`]}`,
            sound: true,
            data: {
                screen: "/(tabs)/home/dailyDarija",
                id: word._id,
                cat_id: word.cat_id,
            },
        },
        trigger: {
            hour: date.getHours(),
            minute: date.getMinutes(),
            day: date.getDate(),
            month: date.getMonth() + 1, // Months are 0-indexed in JS
            year: date.getFullYear(),
            repeats: false, // Don't repeat for each word, only one time
        },
    });
};

export async function wordOfTheDayNotifications() {
    const { basis, language } = useAppState.getState();

    const words = basis.flatMap((cat) =>
        cat.words.map((word) => {
            return {
                ...word,
                screen: "/dailyDarija",
                cat_id: cat._id,
            };
        })
    );

    // Ensure we start scheduling notifications from tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Set the start date to tomorrow

    const days = Platform.OS === "ios" ? 30 : 100;

    // Loop through the words and schedule a notification for each word
    for (let index = 0; index < days; index++) {
        const word = words[index];
        const notificationDate = new Date(tomorrow); // Start from tomorrow
        notificationDate.setDate(notificationDate.getDate() + index); // Increment the day for each word
        notificationDate.setHours(19); // Set the hour for the notification
        notificationDate.setMinutes(0); // Set the minutes to 0

        // Schedule the notification for this word at the calculated time
        await scheduleWordOfTheDayNotification(notificationDate, word, language);
    }
}

export async function cancellWordOfTheDayNotifications() {
    const { basis } = useAppState.getState();

    const words = basis
        .flatMap((cat) =>
            cat.words.map((word) => {
                return {
                    ...word,
                    screen: "/dailyDarija",
                    cat_id: cat._id,
                };
            })
        )
        .slice(0, 100);

    for (let index = 0; index < words.length; index++) {
        await cancelScheduledNotificationAsync(words[index]._id);
    }
}

export const createUser = async (
    userData: UserI,
    isPremiumUser: boolean,
    callback: () => void,
    isNew?: boolean
) => {
    const { setUserData, setIsLoggedin, language } = useAppState.getState();
    const id = auth().currentUser?.uid;
    try {
        const newUser: UserI = {
            ...userData,
            _id: id as string,
            created_at: Date.now(),
        };
        const user = isNew ? null : await getUserData(newUser.email);
        if (user) {
            if (user?.authType === "email") {
                alert(authErrors["email-already-in-use"][language]);
                return;
            } else {
                return getUser(
                    newUser.email,
                    newUser?.authType,
                    isPremiumUser,
                    callback,
                    newUser.password
                );
            }
        } else {
            await writeToDocument("users", id as string, newUser);
            mixpanel.identify(newUser._id);
            mixpanel.getPeople().set("$email", newUser.email);
            logEvent("user_signed_up");
            if (
                isPremiumUser &&
                newUser.email &&
                newUser?.premium_type === PACKAGE_TYPE.ANNUAL
            ) {
                await sendEbook(newUser.email, language);
            }
            setUserData(newUser);
            setIsLoggedin(true);
            showToast(i18n.t("general.successful_operation"));
            callback();
        }
    } catch (error) {
        console.error("registerUser", String(error));
    }
};

export async function getUser(
    email: string,
    authType: LOGIN_TYPE | undefined,
    isPremiumUser: boolean,
    callback: () => void,
    password?: string
): Promise<void> {
    try {
        const { setUserData, setIsLoggedin, userData } = useAppState.getState();
        const user = await getUserData(email);
        if (!user && authType !== "email") {
            return await createUser(
                {
                    ...userData,
                    email,
                    password: password || "",
                    authType,
                },
                isPremiumUser,
                callback,
                true
            );
        } else if (user) {
            mixpanel.identify(user._id);
            mixpanel.getPeople().set("$email", email);
            await Purchases.logIn(user._id);
            await Purchases.setEmail(email);
            logEvent("user_logged_in");
            setUserData(user);
            setIsLoggedin(true);
            showToast(i18n.t("account.login_success"));
            callback();
        }
    } catch (error) {
        console.error("getUser", String(error));
    }
}

export function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Get today's date as a seed (e.g., "2023-10-05")
export function getDailySeed() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

export function scoreColoryByValue(scoreValue: number) {
    return scoreValue <= 0
        ? colors.gray
        : scoreValue <= 30
            ? colors.error
            : scoreValue < 70
                ? colors.orange
                : colors.success;
}


export function capitalizeFirstLetter(str: string) {
    if (str.length === 0) return str; // Handle empty string case
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const saveGroupedQuizzesToFile = async (groupedQuizzes: GroupedQuizzes[]) => {
    const fileUri = `${FileSystem.documentDirectory}quizzesData.json`;

    try {
        const jsonData = JSON.stringify(groupedQuizzes, null, 2);
        await FileSystem.writeAsStringAsync(fileUri, jsonData);
        console.log(`✅ Successfully saved to ${fileUri}`);
    } catch (error) {
        console.error(`❌ Error saving file: ${error}`);
    }
};