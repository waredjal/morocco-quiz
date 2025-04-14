import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { globalStyle } from "@/styles/globalStyles";
import useAppState from "@/utils/state/useStore";

const FeedbackScreen = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { name } = useAppState();
  const [feedback, setFeedback] = useState("");
  const [notation, setNotation] = useState({});

  const handleFeedback = () => {
    console.log(notation);
    console.log(feedback);

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[globalStyle.container, styles.container]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi {name}, have a good day 🌟</Text>
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </View>

        {/* Instruction */}
        <Text style={styles.subTitle}>
          Feel free to share your feedback with us
        </Text>

        {/* Slider with Emojis */}
        <View style={styles.feedbackRow}>
          {["😞", "😐", "😊", "😄"].map((emoji, index) => (
            <Text key={index} style={styles.emoji}>
              {emoji}
            </Text>
          ))}
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={5}
            value={5}
            step={0.1}
            minimumTrackTintColor="#FF3E3E"
            maximumTrackTintColor="#D3D3D3"
            thumbTintColor="#FF3E3E"
            onValueChange={(e) => {
              setNotation(e);
            }}
          />
        </View>

        {/* Text Input */}
        <Text style={styles.label}>Tell us about your experience</Text>

        <TextInput
          style={styles.textInput}
          placeholder="It’s an interesting app and I enjoyes..."
          textAlignVertical="top"
          value={feedback}
          onChange={(value) => {
            setFeedback(value.nativeEvent.text);
          }}
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => handleFeedback()}
        >
          <Text style={styles.submitText}>Send Feedback</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  subTitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  feedbackRow: {
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "white",
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  emoji: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  slider: {
    width: "100%",
    height: 40,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#FFF",
    marginBottom: 20,
    height: 150,
  },
  submitButton: {
    backgroundColor: "#FF3E3E",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
});

export default FeedbackScreen;
