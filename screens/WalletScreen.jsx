import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Wallet from "../components/Wallet"


export default function WalletScreen() {
  return (
    <View style={styles.container}>
      <Wallet />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingBottom: 5,
    paddingTop: 10,
  },
});