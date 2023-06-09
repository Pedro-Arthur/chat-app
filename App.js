import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Keyboard, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Env
import { API_KEY } from '@env';

// Barra de status superior
import { StatusBar } from 'expo-status-bar';

// Importação de utilização de fontes no Expo.
import * as Font from 'expo-font';

// OpenAI
import { Configuration, OpenAIApi } from 'openai';

// NetInfo
import NetInfo from '@react-native-community/netinfo';

// Cores
import colors from './theme/colors';

import 'react-native-url-polyfill/auto';

// Components
import Footer from './components/Footer';
import Header from './components/Header';
import InitialModal from './components/InitialModal';
import MessagesList from './components/MessagesList';

// Questões
import questions from './utils/questions';

// Config
const configuration = new Configuration({
  apiKey: API_KEY,
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
  const flatListRef = useRef();

  // Função que carrega as fontes.
  const loadFonts = async () => {
    await Font.loadAsync({
      'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf'),
      'nunito-bold': require('./assets/fonts/Nunito-Bold.ttf'),
    });
    setFontLoaded(true);
  };

  // Função que checa status da conexão.
  const checkInternetConnection = async () => {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      Alert.alert('Sem conexão com a internet', 'Verifique sua conexão e tente novamente.');
    }
  };

  // Função que manda a mensagem e aguarda resposta.
  const handleSendMessage = async () => {
    const replacedValue = promptText.trim().replace(/[^0-9]/g, '');
    if (replacedValue) {
      setResponseLoading(true);
      const newMessages = [...messages];

      try {
        newMessages.push({ text: replacedValue, sender: 'me' });
        setMessages(newMessages);

        await AsyncStorage.setItem('messages', JSON.stringify(newMessages));

        setPromptText('');
        Keyboard.dismiss();

        const lastMessageByOther = messages[messages.length - 1];

        if (lastMessageByOther.type && lastMessageByOther.type === 'categoryQuestion') {
          const findCategory = questions.find((i) => i.id.toString() === replacedValue);

          if (findCategory) {
            newMessages.push({
              text: `Selecione uma pergunta:\n${findCategory.questions
                .map((i) => `\n${i.id}) ${i.text}`)
                .join('')}`,
              sender: 'other',
              type: 'question',
            });
          } else {
            newMessages.push({ text: 'Opção inválida!', sender: 'other', error: true });
            newMessages.push({
              text: `Selecione uma categoria:\n${questions
                .map((i) => `\n${i.id}) ${i.category}`)
                .join('')}`,
              sender: 'other',
              type: 'categoryQuestion',
            });
          }
        } else {
          const myMessages = messages.filter((i) => i.sender === 'me');

          const findCategory = questions.find(
            (i) => i.id.toString() === myMessages[myMessages.length - 1].text
          );

          const findQuestion = findCategory.questions.find(
            (i) => i.id.toString() === replacedValue
          );

          if (!findQuestion) {
            newMessages.push({ text: 'Opção inválida!', sender: 'other', error: true });
            newMessages.push({
              text: `Selecione uma categoria:\n${questions
                .map((i) => `\n${i.id}) ${i.category}`)
                .join('')}`,
              sender: 'other',
              type: 'categoryQuestion',
            });
          } else {
            const response = await openai.createChatCompletion({
              model: 'gpt-3.5-turbo',
              messages: [{ role: 'user', content: findQuestion.text }],
              temperature: 0,
            });

            newMessages.push({ text: response.data.choices[0].message.content, sender: 'other' });
            newMessages.push({
              text: `Selecione uma categoria:\n${questions
                .map((i) => `\n${i.id}) ${i.category}`)
                .join('')}`,
              sender: 'other',
              type: 'categoryQuestion',
            });
          }
        }

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
    flatListRef.current.scrollToOffset({ offset: scrollHeight });
  };

  // Função que fecha modal inicial.
  const handleCloseInitialModal = async () => {
    if (userName) {
      await AsyncStorage.setItem('userName', userName);

      const newMessages = [...messages];
      newMessages.push({
        text: `Olá ${userName}! Selecione uma categoria:\n${questions
          .map((i) => `\n${i.id}) ${i.category}`)
          .join('')}`,
        sender: 'other',
        type: 'categoryQuestion',
      });
      setMessages(newMessages);

      await AsyncStorage.setItem('messages', JSON.stringify(newMessages));

      setShowInitialModal(false);
    }
  };

  // Função que limpa histórico de mensagens.
  const clearMessages = async () => {
    const newMessages = [
      {
        text: `Olá ${userName}! Selecione uma categoria:\n${questions
          .map((i) => `\n${i.id}) ${i.category}`)
          .join('')}`,
        sender: 'other',
        type: 'categoryQuestion',
      },
    ];
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
      newMessages.push({
        text: `Olá ${storedUserName}! Selecione uma categoria:\n${questions
          .map((i) => `\n${i.id}) ${i.category}`)
          .join('')}`,
        sender: 'other',
        type: 'categoryQuestion',
      });
      setMessages(newMessages);

      await AsyncStorage.setItem('messages', JSON.stringify(newMessages));
    } else {
      handleShowInitialModal();
    }
  };

  // Executa quando abre a tela.
  useEffect(() => {
    checkInternetConnection();
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
      <InitialModal
        handleCloseInitialModal={handleCloseInitialModal}
        setUserName={setUserName}
        userName={userName}
        showInitialModal={showInitialModal}
      />

      {/* Header */}
      <Header responseLoading={responseLoading} clearMessages={clearMessages} />

      {/* Lista de mensagens */}
      <MessagesList
        messages={messages}
        flatListRef={flatListRef}
        handleContentSizeChange={handleContentSizeChange}
      />

      {/* Footer de mensagens */}
      <Footer
        handleSendMessage={handleSendMessage}
        promptText={promptText}
        setPromptText={setPromptText}
        responseLoading={responseLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
});

export default App;
