import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const Knowledge = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>Knowledge Page</Text>
        <View style={styles.card}>
          <Text style={styles.subHeader}> Welcome to SMehndi.com Knowledge Hub</Text>
          <Text style={styles.text}>
          At SMehndi.com, we are dedicated to bringing you the best insights and
                                knowledge about Mehndi art, traditions, and techniques. Explore our
                                hub to learn more about this timeless craft and enhance your skills
                                with our expert tips and resources.
          </Text>
          <Text style={styles.sectionHeader}>Our Expertise</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Comprehensive guides to Mehndi designs</Text>
            <Text style={styles.listItem}>• Traditional and modern Mehndi techniques</Text>
            <Text style={styles.listItem}>• Insights into Mehndi culture and history</Text>
            <Text style={styles.listItem}>• Tips for perfecting your Mehndi art</Text>
          </View>
          <Text style={styles.sectionHeader}>Latest Articles and Insights</Text>
          <Text style={styles.text}>
          Discover the latest trends, articles, and tips from our Mehndi
                                experts. Stay inspired and elevate your Mehndi artistry with curated
                                content just for you.
          </Text>
          <View style={styles.list}>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.link}>Improving Customer Experience through Technology</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.link}>Top 5 After-Sales Service Strategies for 2024</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.link}>How to Manage Technical Support Efficiently</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.link}>Innovative Solutions for Customer Relationship Management</Text>
            </TouchableOpacity>
          </View>
         
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  subHeader: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  list: {
    marginBottom: 20,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  link: {
    fontSize: 16,
    color: '#1e90ff',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
});

export default Knowledge;
