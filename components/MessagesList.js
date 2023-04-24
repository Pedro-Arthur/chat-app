import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import MessageBox from './MessageBox';

const MessagesList = ({ messages, flatListRef, handleContentSizeChange }) => (
  <FlatList
    data={messages}
    renderItem={MessageBox}
    keyExtractor={(item, index) => index.toString()}
    contentContainerStyle={styles.messagesContainer}
    style={styles.messages}
    keyboardShouldPersistTaps="always"
    ref={flatListRef}
    onContentSizeChange={handleContentSizeChange}
  />
);

const styles = StyleSheet.create({
  messages: {
    flex: 1,
    padding: 16,
    marginTop: 50 + Constants.statusBarHeight,
  },
  messagesContainer: {
    paddingBottom: 16,
  },
});

export default MessagesList;
