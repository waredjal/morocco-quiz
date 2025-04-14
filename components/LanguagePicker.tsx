import { ActivityIndicator, FlatList } from "react-native";
import React, { useEffect } from "react";
import useAppState from "../utils/state/useStore";
import { Language, LanguageObj } from "../utils/types";
import { useTranslation } from "react-i18next";
// import { logEvent } from "@/utils/helpers";
// import { updateUserData } from "@/utils/firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import SelectableOption from "./SelectableOption";
import { updateUserData } from "@/api/firestore";
import { LANGUAGES } from "@/utils/constants";
import { t } from "i18next";


const LanguagePicker = () => {
  const {
    email,
    _id,
    setLanguage,
    setUserData,
    language,
    languages,
    setLanguages,
    isFirstLaunch,
  } = useAppState();
  const { i18n } = useTranslation();

  // useEffect(() => { setLanguages(LANGUAGES) }, [])


  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (!languages?.length) {
  //       firestore()
  //         .collection("general")
  //         .doc("app")
  //         .get()
  //         .then((snapshot) => {
  //           if (snapshot?.exists && snapshot?.data()) {
  //             setLanguages(snapshot?.data()?.langauges);
  //           }
  //         });
  //     }
  //   }, 5000);

  //   // Clean up the timer if the component unmounts or `languages` state changes
  //   return () => clearTimeout(timer);
  // }, [languages]);

  const selectLang = React.useCallback(
    async (lang: Language) => {
      setLanguage(lang);
      setUserData({ language: lang });
      i18n.changeLanguage(lang);
      if (!isFirstLaunch) {
        // logEvent("language_" + lang);
        if (email && _id) {
          await updateUserData(_id, { language: lang });
        }
      }
    },
    [_id, isFirstLaunch]
  );

  const renderLang = React.useCallback(
    ({ item }: { item: LanguageObj }) => {
      const isSelected = language === item?.lang || language === item?.code;
      const link = `https://hatscripts.github.io/circle-flags/flags/${item.flag}.svg`;
      return (
        <SelectableOption
          isSelected={isSelected}
          text={t(item.name)}
          img={link}
          onPress={() => selectLang(item?.lang || item?.code)}
        />
      );
    },
    [language]
  );


  if (Array.isArray(languages) && languages?.length > 0) {
    return (
      <FlatList
        data={languages}
        renderItem={renderLang}
        contentContainerStyle={{ gap: 16 }}
      />
    );
  }

  return <ActivityIndicator size="large" style={{ flex: 1 }} />;
};

export default LanguagePicker;
