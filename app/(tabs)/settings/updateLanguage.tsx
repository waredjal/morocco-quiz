import { StyleSheet } from "react-native";
import React from "react";
import Page from "@/components/Page";
import LanguagePicker from "@/components/LanguagePicker";


const UpdateLanguage = () => {
  return (
    <Page style={styles.container}>
      <LanguagePicker />
    </Page>
  );
};

export default UpdateLanguage;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 16,
  },
});
