import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Colors } from '@/constants/Colors';
import BankTransactions from './BankTransactions';
import BankDetails from './BankDetails';
 
const TransactionsList = () => (
  <View style={styles.content}>
   <BankTransactions />
  </View>
);

const Others = () => (
  <View style={styles.content}>
  <BankDetails />
  </View>
);

const Wallet = () => {
  const [selectedTab, setSelectedTab] = useState('transactions');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'transactions' && styles.selectedTab]}
          onPress={() => setSelectedTab('transactions')}
        >
          <Text style={styles.tabText}>Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'others' && styles.selectedTab]}
          onPress={() => setSelectedTab('others')}
        >
          <Text style={styles.tabText}>Bank Details</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'transactions' ? <TransactionsList /> : <Others />}
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
        marginBottom: 5,
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

export default Wallet;

 