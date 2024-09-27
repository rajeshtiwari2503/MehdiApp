import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Supports from "../components/Supports"


export default function SupportScreen() {
  return (
    <View style={styles.container}>
      <Supports />
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