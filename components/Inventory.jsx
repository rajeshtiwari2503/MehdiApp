import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Colors } from '@/constants/Colors';
import Stocks from './Stocks';
import Orders from './Orders';
 
 
 
const StockTab = ({data}) => (
  <View style={styles.content}>
   <Stocks  />
  </View>
);

const OrderTab = () => (
  <View style={styles.content}>
  <Orders />
  </View>
);

const Inventory = ( ) => {
  const [selectedTab, setSelectedTab] = useState('stock');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'stock' && styles.selectedTab]}
          onPress={() => setSelectedTab('stock')}
        >
          <Text style={styles.tabText}>Stocks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Order' && styles.selectedTab]}
          onPress={() => setSelectedTab('Order')}
        >
          <Text style={styles.tabText}>Orders</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'stock' ? <StockTab   /> : <OrderTab />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        width:"100%",
        // marginTop: 25,
        borderRadius: 30
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#333', // Dark background for tabs
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#444', // Default tab background
  },
  selectedTab: {
    backgroundColor: '#0284c7', // Highlighted tab background
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Inventory;

 