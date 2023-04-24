import React from 'react';
import { ActivityIndicator, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

const Footer = ({ promptText, setPromptText, responseLoading, handleSendMessage }) => (
  <View style={styles.messageInputContainer}>
    <TextInput
      style={styles.messageInput}
      value={promptText}
      onChangeText={setPromptText}
      placeholder="Digite uma mensagem..."
      placeholderTextColor={colors.placeholderGray}
    />
    <TouchableOpacity
      disabled={responseLoading}
      style={styles.sendButton}
      onPress={handleSendMessage}
    >
      {responseLoading ? (
        <ActivityIndicator size={20} color={colors.white} />
      ) : (
        <Ionicons name="ios-send" size={20} color={colors.white} />
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  messageInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: colors.textInputGray,
    borderRadius: 20,
    marginRight: 8,
    fontFamily: 'nunito-regular',
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default Footer;
