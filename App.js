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

// Importação de utilização de fontes no Expo.
import * as Font from 'expo-font';

// Biblioteca de ícones.
import { Ionicons } from '@expo/vector-icons';

const App = () => {
  // Nome do usuário.
  const [userName, setUserName] = useState('');
  // Guarda texto digitado.
  const [promptText, setPromptText] = useState('');
  // Status do modal inicial.
  const [showInitialModal, setShowInitialModal] = useState(false);
  // Mensagens enviadas e recebidas.
  const [messages, setMessages] = useState([]);
  // Status de carregamento da fonte Nunito.
  const [fontLoaded, setFontLoaded] = useState(false);

  // Ref do Scroll onde as mensagens ficam.
  const scrollViewRef = useRef();

  // Função que carrega as fontes.
  const loadFonts = async () => {
    await Font.loadAsync({
      'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf'),
      'nunito-bold': require('./assets/fonts/Nunito-Bold.ttf'),
    });
    setFontLoaded(true);
  };

  // Função que manda a mensagem.
  const handleSendMessage = () => {
    if (promptText.trim()) {
      messages.push({ id: messages.length + 1, text: promptText.trim(), sender: 'me' });
      setPromptText('');

      // A cada mensagem enviada navega até o final do scroll.
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  // Função que abre modal inicial.
  const handleShowInitialModal = () => {
    setShowInitialModal(true);
  };

  // Função que fecha modal inicial.
  const handleCloseInitialModal = () => {
    setShowInitialModal(false);
    setMessages([
      { id: 1, text: `Hello ${userName}!`, sender: 'me' },
      { id: 2, text: 'Hey there!', sender: 'other' },
      { id: 3, text: 'How are you?', sender: 'me' },
      { id: 4, text: 'I am doing well, thanks. How about you?', sender: 'other' },
    ]);
  };

  // Função que retorna um componente que renderiza o container da mensagem.
  const renderMessage = ({ id, text, sender }) => {
    const messageStyle = sender === 'me' ? styles.myMessage : styles.otherMessage;
    const messageContainerStyle =
      sender === 'me' ? styles.myMessageContainer : styles.otherMessageContainer;

    return (
      <View key={id} style={messageContainerStyle}>
        <View style={[styles.message, messageStyle]}>
          <Text style={styles.messageText}>{text}</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    loadFonts();
    handleShowInitialModal();
  }, []);

  // Se as fontes não estiverem carregadas mostre um texto de loading.
  if (!fontLoaded) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Modal inicial */}
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

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat dos Mestres</Text>
      </View>

      {/* Lista de mensagens */}
      <ScrollView style={styles.messages} keyboardShouldPersistTaps="always" ref={scrollViewRef}>
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Footer de mensagens */}
      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          value={promptText}
          onChangeText={setPromptText}
          placeholder="Digite uma mensagem..."
          placeholderTextColor="#757575"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="ios-send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // Modal
  modalContainer: {
    padding: 20,
    borderRadius: 10,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'nunito-regular',
  },
  modalTextInput: {
    backgroundColor: '#eee',
    borderRadius: 5,
    height: 40,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
    fontFamily: 'nunito-regular',
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'nunito-bold',
  },

  // Header
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

  // Mensagens
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
  messageText: {
    color: '#000',
    fontFamily: 'nunito-regular',
  },

  // Footer de mensagens
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageInput: {
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
});

export default App;
