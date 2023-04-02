import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Configuration, OpenAIApi } from 'openai';
import 'react-native-url-polyfill/auto';

export default function App() {
  const configuration = new Configuration({
    apiKey: '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',
  });

  const openai = new OpenAIApi(configuration);

  async function sendRequest() {
    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: 'Say about expo',
        max_tokens: 7,
        temperature: 0,
      });

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button onPress={sendRequest} title="Send request" />
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
});
