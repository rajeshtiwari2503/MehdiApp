import { View, StyleSheet } from 'react-native'
import React from 'react'
import DesignSection from '../components/Designs'
 


const DesignScreen = () => {
  return (
    <View style={styles.container}>
      <DesignSection />
   
    </View>
  )
}

export default DesignScreen
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#c4650c',
      paddingBottom: 5,
      paddingTop: 5,
    },
  });