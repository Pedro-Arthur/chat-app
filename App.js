import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Configuration, OpenAIApi } from 'openai';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-native-url-polyfill/auto';

export default function App() {
  const configuration = new Configuration({
    apiKey: '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',
  });

  const openai = new OpenAIApi(configuration);

  const [prompt, setPrompt] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = async () => {
    if (prompt) {
      setLoading(true);
      try {
        const response = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0,
        });

        setResponseMessage(response.data.choices[0].message.content);
        setPrompt(null);
        setError(null);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="light" backgroundColor="#1abc9c" />

      {error !== null && <Text style={styles.errorText}>Erro: {error.message}</Text>}

      {loading ? <ActivityIndicator size="large" /> : <Text>{responseMessage}</Text>}

      <TextInput
        placeholder="Digite uma pergunta..."
        value={prompt}
        onChangeText={(text) => setPrompt(text)}
      />

      <Button onPress={() => sendRequest()} title="Enviar" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
  },
});
