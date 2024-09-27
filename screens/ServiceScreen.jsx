import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Services from "../components/Services"


export default function ServiceScreen() {
  return (
    <View style={styles.container}>
      <Services />
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