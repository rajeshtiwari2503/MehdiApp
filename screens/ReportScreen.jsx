import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Report from "../components/Report"


export default function ReportScreen() {
  return (
    <View style={styles.container}>
      <Report />
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