import React from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../theme/colors';

const InitialModal = ({ showInitialModal, handleCloseInitialModal, setUserName, userName }) => (
  <Modal
    visible={showInitialModal}
    transparent
    onRequestClose={handleCloseInitialModal}
    backdropDismiss={false}
    animationType="slide"
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalBox}>
        <Text style={styles.modalTitle}>Digite seu nome:</Text>
        <TextInput
          style={styles.modalTextInput}
          onChangeText={setUserName}
          value={userName}
          placeholder="Seu nome aqui"
        />
        <TouchableOpacity style={styles.modalButton} onPress={handleCloseInitialModal}>
          <Text style={styles.modalButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    padding: 16,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: colors.white,
    width: '100%',
    borderRadius: 5,
    padding: 16,
  },
  modalTitle: {
    fontSize: 17,
    marginBottom: 10,
    fontFamily: 'nunito-regular',
  },
  modalTextInput: {
    backgroundColor: colors.textInputGray,
    borderRadius: 5,
    height: 40,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 16,
    fontFamily: 'nunito-regular',
  },
  modalButton: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    padding: 10,
  },
  modalButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'nunito-bold',
  },
});

export default InitialModal;
