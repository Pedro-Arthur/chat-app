import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';

const MessageBox = ({ item }) => {
  let messageStyle;
  let messageContainerStyle;
  let { messageText } = styles;

  if (item.sender === 'me') {
    messageStyle = styles.myMessage;
    messageContainerStyle = styles.myMessageContainer;
  } else if (item.error === true) {
    messageStyle = styles.errorMessage;
    messageContainerStyle = styles.otherMessageContainer;
    messageText = styles.errorMessageText;
  } else {
    messageStyle = styles.otherMessage;
    messageContainerStyle = styles.otherMessageContainer;
  }

  return (
    <View style={messageContainerStyle}>
      <View style={[styles.message, messageStyle]}>
        <Text style={messageText}>{item.text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default MessageBox;
