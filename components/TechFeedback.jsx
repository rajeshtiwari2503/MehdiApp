import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { Colors } from '@/constants/Colors';
import UserList from './UserList';
import FeedbackPage from './FeedbackList';
 
 
const FeedbackTab = ({data}) => (
  <View style={styles.content}>
   <FeedbackPage data={data}/>
  </View>
);

const UserTab = () => (
  <View style={styles.content}>
  <UserList />
  </View>
);

const TechFeedbacks = ({data}) => {
  const [selectedTab, setSelectedTab] = useState('feedback');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'feedback' && styles.selectedTab]}
          onPress={() => setSelectedTab('feedback')}
        >
          <Text style={styles.tabText}>Feedbacks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'users' && styles.selectedTab]}
          onPress={() => setSelectedTab('users')}
        >
          <Text style={styles.tabText}>Users</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'feedback' ? <FeedbackTab data={data} /> : <UserTab />}
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

export default TechFeedbacks;

 