import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const messages = [
  { id: 1, text: 'Hello!', sender: 'me' },
  { id: 2, text: 'Hey there!', sender: 'other' },
  { id: 3, text: 'How are you?', sender: 'me' },
  { id: 4, text: 'I am doing well, thanks. How about you?', sender: 'other' },
];

const App = () => {
  const [text, setText] = useState('');
  const scrollViewRef = useRef();

  const handleSend = () => {
    if (text.trim()) {
      messages.push({ id: messages.length + 1, text: text.trim(), sender: 'me' });
      setText('');
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const renderMessage = ({ id, text, sender }) => {
    const messageStyle = sender === 'me' ? styles.myMessage : styles.otherMessage;
    const messageContainerStyle =
      sender === 'me' ? styles.myMessageContainer : styles.otherMessageContainer;
    const messageTextStyle = sender === 'me' ? styles.myMessageText : styles.otherMessageText;

    return (
      <View key={id} style={messageContainerStyle}>
        <View style={[styles.message, messageStyle]}>
          <Text style={messageTextStyle}>{text}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat dos Mestres</Text>
      </View>
      <ScrollView
        style={styles.messages}
        contentContainerStyle={styles.messagesContainer}
        keyboardShouldPersistTaps="always"
        ref={scrollViewRef}
      >
        {messages.map(renderMessage)}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor="#757575"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  messages: {
    flex: 1,
    padding: 16,
    marginTop: 50,
  },
  message: {
    borderRadius: 8,
    padding: 8,
  },
  myMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  myMessageContainer: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  myMessageText: {
    color: '#000',
  },
  otherMessageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#4caf50',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
