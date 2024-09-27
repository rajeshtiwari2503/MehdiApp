import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Profile from "../components/Profile"


export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Profile />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingBottom: 5,
    paddingTop: 5,
  },
});