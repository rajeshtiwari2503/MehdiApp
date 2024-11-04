import { View, StyleSheet } from 'react-native'
import React from 'react'
import MyOrders from '../components/MyOrders'

const OrderScreen = () => {
  return (
    <View style={styles.container}>
      <MyOrders />
    </View>
  )
}

export default OrderScreen
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#c4650c',
      paddingBottom: 5,
      paddingTop: 5,
    },
  });