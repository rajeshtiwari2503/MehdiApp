import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import SkillandPerformance from "../components/SkillandPerformance"


export default function SkillScreen() {
  return (
    <View style={styles.container}>
      <SkillandPerformance />
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