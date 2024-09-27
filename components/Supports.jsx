import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '@/constants/Colors';
import Contact from './Contact';
import Knowledge from './Knowledge';
import Chat from './chat/page';

export default function Supports() {
  const [currentSection, setCurrentSection] = useState('Contact'); // State to track the current section

  const renderSection = () => {
    switch (currentSection) {
      case 'Contact':
        return  <Contact />;
      case 'Knowledge':
        return  <Knowledge />
      case 'Chat':
        return <Chat />
      default:
        return <Text style={styles.sectionText}>Please select a section</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleHeader}>
      <Text style={styles.title}>Supports</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.menuButton,
            currentSection === 'Contact' && styles.activeTab,
          ]}
          onPress={() => setCurrentSection('Contact')}
        >
          <Text style={[
            styles.menuText,
            currentSection === 'Contact' && styles.activeTabText,
          ]}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuButton,
            currentSection === 'Knowledge' && styles.activeTab,
          ]}
          onPress={() => setCurrentSection('Knowledge')}
        >
          <Text style={[
            styles.menuText,
            currentSection === 'Knowledge' && styles.activeTabText,
          ]}>Knowledge</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuButton,
            currentSection === 'Chat' && styles.activeTab,
          ]}
          onPress={() => setCurrentSection('Chat')}
        >
          <Text style={[
            styles.menuText,
            currentSection === 'Chat' && styles.activeTabText,
          ]}>Chat</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>{renderSection()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    backgroundColor: '#FFFF',
    marginTop: 5,
        marginBottom: 5,
    borderRadius: 30,
  },
  titleHeader:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    marginTop:10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
borderRadius:15,
    width:150,
    color:"white",
    backgroundColor: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row', // Align items horizontally
    justifyContent: 'space-around', // Space items evenly
    marginBottom: 10,
  },
  menuButton: {
    backgroundColor:Colors.GRAY,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: Colors.PRIMARY, // Change background color for active tab
  },
  menuText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#FFFF', // Change text color for active tab if needed
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  sectionText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
