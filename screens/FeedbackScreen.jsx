import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import UserFeedbacks from "../components/Feedback"


export default function FeedbackScreen() {
  return (
    <View style={styles.container}>
      <UserFeedbacks />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c4650c',
    paddingBottom: 5,
    paddingTop: 5,
  },
});