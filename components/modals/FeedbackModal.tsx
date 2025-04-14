import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, TextInput, ViewComponent } from "react-native";
import { CustomButton } from "../CustomButton";
import { useTranslation } from "react-i18next";
import InAppReview from "react-native-in-app-review";
import { addFeedback } from "@/api/firestore";
import useAppState from "@/utils/state/useStore";
import ViewContainer from "../layout/ViewContainer";

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FeedbackModal = ({ visible, onClose }: FeedbackModalProps) => {
  const [isPositive, setIsPositive] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState("");
  const { t } = useTranslation();
  const { _id } = useAppState();

  const handleResponse = async (enjoyed: boolean) => {
    setIsPositive(enjoyed);

    if (enjoyed) {
      if (InAppReview.isAvailable()) {
        try {
          await InAppReview.RequestInAppReview();
        } catch (error) {
          console.log("Error requesting review:", error);
        }
      }
      onClose();
    }
  };

  const handleSubmitFeedback = async () => {
    if (feedback.trim()) {
      await addFeedback(_id, feedback);
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <ViewContainer style={styles.container}>
        <View style={styles.content}>
          {isPositive === null ? (
            <>
              <Text style={styles.title}>{t("feedback.enjoyingApp")}</Text>
              <View style={styles.buttonContainer}>
                <CustomButton
                  title={t("common.yes")}
                  onPress={() => handleResponse(true)}
                />
                <CustomButton
                  title={t("common.no")}
                  onPress={() => handleResponse(false)}
                />
              </View>
            </>
          ) : (
            !isPositive && (
              <>
                <Text style={styles.title}>
                  {t("feedback.improvementSuggestion")}
                </Text>
                <TextInput
                  style={styles.input}
                  multiline
                  numberOfLines={4}
                  value={feedback}
                  onChangeText={setFeedback}
                  placeholder={t("feedback.placeholder")}
                />
                <CustomButton
                  title={t("common.submit")}
                  onPress={handleSubmitFeedback}
                />
              </>
            )
          )}
        </View>
      </ViewContainer>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
});
