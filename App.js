import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Barra de status superior
import { StatusBar } from 'expo-status-bar';

// Importação de utilização de fontes no Expo.
import * as Font from 'expo-font';

// Biblioteca de ícones.
import { Ionicons } from '@expo/vector-icons';

// OpenAI
import { Configuration, OpenAIApi } from 'openai';

// Cores
import colors from './theme/colors';

import 'react-native-url-polyfill/auto';

const configuration = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);

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
  // Status de carregamento da mensagem.
  const [responseLoading, setResponseLoading] = useState(false);

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

  // Função que manda a mensagem e aguarda resposta.
  const handleSendMessage = async () => {
    if (promptText.trim()) {
      setResponseLoading(true);
      const newMessages = [...messages];

      try {
        newMessages.push({ text: promptText.trim(), sender: 'me' });
        setMessages(newMessages);

        await AsyncStorage.setItem('messages', JSON.stringify(newMessages));

        setPromptText('');
        Keyboard.dismiss();

        const response = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: promptText }],
          temperature: 0,
        });

        newMessages.push({ text: response.data.choices[0].message.content, sender: 'other' });
        setMessages(newMessages);

        await AsyncStorage.setItem('messages', JSON.stringify(newMessages));
      } catch (e) {
        newMessages.push({ text: e.message, sender: 'other', error: true });
        setMessages(newMessages);
        await AsyncStorage.setItem('messages', JSON.stringify(newMessages));
      } finally {
        setResponseLoading(false);
      }
    }
  };

  // Função que abre modal inicial.
  const handleShowInitialModal = () => {
    setShowInitialModal(true);
  };

  // Função que lida com a mudança de tamanho da lista de mensagens.
  const handleContentSizeChange = (contentWidth, contentHeight) => {
    const paddingBottom = 16;
    const scrollHeight = contentHeight - paddingBottom;
    // Dá scroll até o final da lista.
    scrollViewRef.current.scrollTo({ y: scrollHeight });
  };

  // Função que fecha modal inicial.
  const handleCloseInitialModal = async () => {
    if (userName) {
      await AsyncStorage.setItem('userName', userName);

      const newMessages = [...messages];
      newMessages.push({ text: `Olá ${userName}! Como posso te ajudar?`, sender: 'other' });
      setMessages(newMessages);

      await AsyncStorage.setItem('messages', JSON.stringify(newMessages));

      setShowInitialModal(false);
    }
  };

  // Função que limpa histórico de mensagens.
  const clearMessages = async () => {
    const newMessages = [{ text: `Olá ${userName}! Como posso te ajudar?`, sender: 'other' }];
    setMessages(newMessages);
    await AsyncStorage.setItem('messages', JSON.stringify(newMessages));
  };

  // Função que lida com os dados guardados no storage.
  const handleStoredData = async () => {
    const storedUserName = await AsyncStorage.getItem('userName');
    const storedMessages = JSON.parse(await AsyncStorage.getItem('messages')) || [];

    if (storedUserName) {
      setUserName(storedUserName);

      const newMessages = [...storedMessages];
      newMessages.push({ text: `Olá ${storedUserName}! Como posso te ajudar?`, sender: 'other' });
      setMessages(newMessages);

      await AsyncStorage.setItem('messages', JSON.stringify(newMessages));
    } else {
      handleShowInitialModal();
    }
  };

  // Função que retorna um componente que renderiza o container da mensagem.
  const renderMessage = ({ text, sender, error }, index) => {
    let messageStyle;
    let messageContainerStyle;
    let { messageText } = styles;

    if (sender === 'me') {
      messageStyle = styles.myMessage;
      messageContainerStyle = styles.myMessageContainer;
    } else if (error === true) {
      messageStyle = styles.errorMessage;
      messageContainerStyle = styles.otherMessageContainer;
      messageText = styles.errorMessageText;
    } else {
      messageStyle = styles.otherMessage;
      messageContainerStyle = styles.otherMessageContainer;
    }

    return (
      <View key={index} style={messageContainerStyle}>
        <View style={[styles.message, messageStyle]}>
          <Text style={messageText}>{text}</Text>
        </View>
      </View>
    );
  };

  // Executa quando abre a tela.
  useEffect(() => {
    loadFonts();
    handleStoredData();
  }, []);

  // Se as fontes não estiverem carregadas mostre um texto de loading.
  if (!fontLoaded) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar translucent style="light" backgroundColor={colors.primary} />

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
        <Text style={styles.headerTitle}>TransitTalk</Text>
        <TouchableOpacity
          disabled={responseLoading}
          onPress={clearMessages}
          style={styles.headerButton}
        >
          <Ionicons name="ios-trash-outline" size={20} color={colors.red} />
        </TouchableOpacity>
      </View>

      {/* Lista de mensagens */}
      <ScrollView
        contentContainerStyle={styles.messagesContainer}
        style={styles.messages}
        keyboardShouldPersistTaps="always"
        ref={scrollViewRef}
        onContentSizeChange={handleContentSizeChange}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Footer de mensagens */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },

  // Modal
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

  // Header
  header: {
    height: 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    marginTop: Constants.statusBarHeight,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'nunito-bold',
  },
  headerButton: {
    position: 'absolute',
    right: 16,
  },

  // Mensagens
  messages: {
    flex: 1,
    padding: 16,
    marginTop: 50 + Constants.statusBarHeight,
  },
  messagesContainer: {
    paddingBottom: 16,
  },
  message: {
    borderRadius: 5,
    padding: 8,
  },
  myMessage: {
    backgroundColor: colors.myMessage,
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: colors.otherMessage,
    alignSelf: 'flex-start',
  },
  errorMessage: {
    backgroundColor: colors.red,
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
    color: colors.black,
    fontFamily: 'nunito-regular',
  },
  errorMessageText: {
    color: colors.white,
    fontFamily: 'nunito-regular',
  },

  // Footer de mensagens
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

export default App;
