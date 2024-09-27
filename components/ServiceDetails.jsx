import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import Modal from 'react-native-modal';
import { MaterialIcons } from '@expo/vector-icons';

export default function ServiceDetails({ isVisible, onClose, service }) {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
      <View style={styles.headerContainer}>
            <Text style={styles.header}>Service Details</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="cancel" size={40} color="red" />
            </TouchableOpacity>
          </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
         

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Product Information</Text>
            <DetailItem label="Product Name" value={service.productName} />
            <DetailItem label="Category Name" value={service.categoryName} />
            <DetailItem label="Brand" value={service.productBrand} />
            <DetailItem label="Model No" value={service.modelNo} />
            <DetailItem label="Serial No" value={service.serialNo} />
            <DetailItem label="Purchase Date" value={new Date(service.purchaseDate).toLocaleDateString()} />
            <DetailItem label="Warranty Status" value={service.warrantyStatus ? 'Yes' : 'No'} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Service Information</Text>
            <DetailItem label="Service ID" value={service._id} />
            <DetailItem label="Status" value={service.status} />
            <DetailItem label="Issue Type" value={service.issueType} />
            <DetailItem label="Detailed Description" value={service.detailedDescription} />
            <Image source={{ uri: service.issueImages }} style={styles.issueImage} />
            <DetailItem label="Error Messages" value={service.errorMessages} />
            <DetailItem label="Preferred Service Date" value={new Date(service.preferredServiceDate).toLocaleDateString()} />
            <DetailItem label="Preferred Service Time" value={service.preferredServiceTime} />
            <DetailItem label="Service Location" value={service.serviceLocation} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Customer Information</Text>
            <DetailItem label="Full Name" value={service.fullName} />
            <DetailItem label="Phone Number" value={service.phoneNumber} />
            <DetailItem label="Email Address" value={service.emailAddress} />
            <DetailItem label="Alternate Contact Info" value={service.alternateContactInfo} />
            <DetailItem label="Service Address" value={service.serviceAddress} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Assignment Information</Text>
            <DetailItem label="Assigned Service Center" value={service.assignServiceCenter} />
            <DetailItem label="Technician" value={service.assignTechnician} />
            <DetailItem label="Technician Contact" value={service.technicianContact} />
            <DetailItem label="Comments" value={service.comments} />
          </View>

        </ScrollView>
      </View>
    </Modal>
  )
}

const DetailItem = ({ label, value }) => (
  <View style={styles.detailContainer}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    height: '90%',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.PRIMARY,
  },
  detailContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    flex: 2,
    color: '#333',
  },
  detailValue: {
    flex: 2,
    color: '#666',
  },
  issueImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
