import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

const App = () => {
  const [text, setText] = useState('');
  const scrollViewRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [messages, setMessages] = useState([]);
  const [fontLoaded, setFontLoaded] = useState(false);

  const handleSend = () => {
    if (text.trim()) {
      messages.push({ id: messages.length + 1, text: text.trim(), sender: 'me' });
      setText('');
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMessages([
      { id: 1, text: `Hello ${name}!`, sender: 'me' },
      { id: 2, text: 'Hey there!', sender: 'other' },
      { id: 3, text: 'How are you?', sender: 'me' },
      { id: 4, text: 'I am doing well, thanks. How about you?', sender: 'other' },
    ]);
  };

  async function loadFonts() {
    await Font.loadAsync({
      // eslint-disable-next-line global-require
      'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf'),
      // eslint-disable-next-line global-require
      'nunito-bold': require('./assets/fonts/Nunito-Bold.ttf'),
    });
    setFontLoaded(true);
  }

  useEffect(() => {
    loadFonts();
    handleShowModal();
  }, []);

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

  if (!fontLoaded) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Modal
        visible={showModal}
        transparent
        onRequestClose={handleCloseModal}
        backdropDismiss={false}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Digite seu nome:</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={setName}
            value={name}
            placeholder="Seu nome aqui"
          />
          <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

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
          <Ionicons name="ios-send" size={20} color="white" />
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
  modalContainer: {
    padding: 20,
    borderRadius: 10,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'nunito-regular',
  },
  textInput: {
    backgroundColor: '#eee',
    borderRadius: 5,
    height: 40,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
    fontFamily: 'nunito-regular',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: '#fff',

    textAlign: 'center',
    fontFamily: 'nunito-bold',
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

    fontFamily: 'nunito-bold',
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
    fontFamily: 'nunito-regular',
  },
  otherMessageText: {
    color: '#000',
    fontFamily: 'nunito-regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: 'nunito-regular',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    fontFamily: 'nunito-regular',
  },
  sendButton: {
    backgroundColor: '#4caf50',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: '#fff',

    fontFamily: 'nunito-bold',
  },
});
