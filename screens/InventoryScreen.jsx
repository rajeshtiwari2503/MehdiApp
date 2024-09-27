import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Inventory from "../components/Inventory"


export default function InventoryScreen() {
  return (
    <View style={styles.container}>
      <Inventory />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingBottom: 10,
    paddingTop: 10,
  },
});