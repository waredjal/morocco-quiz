import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import { Language } from "@/utils/types";

import { useTranslation } from "react-i18next";
import { isAndroid } from "@/utils/platform";
import useAppState from "@/utils/state/useStore";
import { LANGUAGES } from "@/utils/constants";

const LanguageSelector = () => {
  const [showLanguages, setShowLanguages] = useState(false);
  const { t, i18n } = useTranslation();


  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setShowLanguages(false);
    useAppState.setState({ language: langCode as Language });
  };

  const countryCode = LANGUAGES.find(
    (lang) => lang.code === i18n.language
  )?.flag;

  return (
    <>
      <Pressable
        style={styles.languageSelector}
        onPress={() => setShowLanguages(!showLanguages)}
      >
        <Image
          source={`https://hatscripts.github.io/circle-flags/flags/${countryCode}.svg`}
          style={{ width: 20, height: 20 }}
          contentFit="contain"
        />
        <Text style={styles.languageText}>
          {t(LANGUAGES.find((lang) => lang.code === i18n.language)?.name)}
        </Text>
      </Pressable>

      {showLanguages && (
        <View style={styles.languageDropdown}>
          {LANGUAGES.map((lang) => (
            <Pressable
              key={lang.code}
              style={styles.languageOption}
              onPress={() => changeLanguage(lang.code)}
            >
              <Image
                source={`https://hatscripts.github.io/circle-flags/flags/${lang.flag}.svg`}
                style={{ width: 20, height: 20 }}
                contentFit="contain"
              />
              <Text style={styles.languageOptionText}>{t(lang.name)}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </>
  );
};

export default LanguageSelector;

const styles = StyleSheet.create({
  languageSelector: {
    backgroundColor: "#fff",
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    gap: 10,
    top: 15,
    right: 10,
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
    width: "30%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4285F4",
  },
  languageText: {
    color: "#4285F4",
    fontSize: 14,
    fontWeight: "600",
  },
  languageDropdown: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 42,
    padding: 5,
    width: "40%",
    zIndex: 1000,
    ...(isAndroid
      ? { elevation: 5 }
      : {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }),
  },
  languageOption: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  languageOptionText: {
    color: "#333",
    fontSize: 16,
  },
});
