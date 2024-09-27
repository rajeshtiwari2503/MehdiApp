import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const Knowledge = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>Knowledge Page</Text>
        <View style={styles.card}>
          <Text style={styles.subHeader}>Welcome to Lybley India Pvt. Ltd. Knowledge Hub</Text>
          <Text style={styles.text}>
            Lybley India Pvt. Ltd. is committed to delivering exceptional services and innovative solutions to meet the diverse needs of our customers. Our expertise spans across various domains, including technology, customer support, and after-sales services.
          </Text>
          <Text style={styles.sectionHeader}>Our Expertise</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Comprehensive after-sales service management</Text>
            <Text style={styles.listItem}>• Advanced technical support solutions</Text>
            <Text style={styles.listItem}>• Customer relationship management</Text>
            <Text style={styles.listItem}>• Innovative product solutions and support</Text>
          </View>
          <Text style={styles.sectionHeader}>Latest Articles and Insights</Text>
          <Text style={styles.text}>
            Stay updated with the latest trends, insights, and articles from our team of experts. Our knowledge hub provides valuable information to help you stay ahead in the industry.
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
          <Text style={styles.sectionHeader}>Contact Our Experts</Text>
          <Text style={styles.text}>
            Have questions or need assistance? Our team of experts is here to help. 
            <Text style={styles.link} onPress={() => {}}> Contact us</Text> for more information.
          </Text>
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
