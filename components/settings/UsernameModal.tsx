import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { updateUsername } from "@/api/firestore";
import useAppState from "@/utils/state/useStore";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const UsernameModal = ({ visible, onClose }: Props) => {
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  const { _id } = useAppState();

  const handleSubmit = async () => {
    if (newUsername.length < 3) {
      setError("Le nom d'utilisateur doit contenir au moins 3 caractères");
      return;
    }

    try {
      updateUsername(_id, newUsername);

      useAppState.setState({ name: newUsername });
      setNewUsername("");
      onClose();
    } catch (e) {
      setError("Une erreur est survenue lors du changement de nom");
      console.error(e);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      >
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardView}
          >
            <TouchableWithoutFeedback onPress={handleSubmit}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>
                  Changer le nom d'utilisateur
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Nouveau nom d'utilisateur"
                  value={newUsername}
                  onChangeText={setNewUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onClose}
                  >
                    <Text style={styles.buttonText}>Annuler</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.submitButton]}
                    onPress={handleSubmit}
                  >
                    <Text style={[styles.buttonText, styles.submitText]}>
                      Confirmer
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardView: {
    width: "100%",
    alignItems: "center",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  submitButton: {
    backgroundColor: "#E74C3C",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  submitText: {
    color: "white",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default UsernameModal;
