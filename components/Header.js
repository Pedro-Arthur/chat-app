import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import colors from '../theme/colors';

const Header = ({ responseLoading, clearMessages }) => (
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
);

const styles = StyleSheet.create({
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
});
export default Header;
