import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Colors } from '@/constants/Colors';
import Skills from './Skills';
import Performances from './Performance';
 
 
const Skill = ( ) => (
  <View style={styles.content}>
   <Skills  />
  </View>
);

const Performance = () => (
  <View style={styles.content}>
  <Performances />
  </View>
);

const SkillandPerformance = ({data}) => {
  const [selectedTab, setSelectedTab] = useState('skill');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'skill' && styles.selectedTab]}
          onPress={() => setSelectedTab('skill')}
        >
          <Text style={styles.tabText}>Skills</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'performance' && styles.selectedTab]}
          onPress={() => setSelectedTab('performance')}
        >
          <Text style={styles.tabText}>Performance</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'skill' ? <Skill  /> : <Performance />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        // paddingLeft: 20,
        // paddingRight: 20,
        paddingTop: 10,
        width:"100%",
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 30
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#333', // Dark background for tabs
    borderRadius: 8,
    marginBottom: 10,
    marginLeft:20,
   marginRight:20,
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

export default SkillandPerformance;

 