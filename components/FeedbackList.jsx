import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Rating } from 'react-native-ratings';
import Modal from 'react-native-modal';

const FeedbackPage = ({ data }) => {
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleViewDetails = (item) => {
    setSelectedFeedback(item);
    setModalVisible(true);
  };

  const renderFeedbackItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.indexContainer}>
        <Text style={styles.indexText}>{item?.i}</Text>
      </View>
      <Text style={styles.itemText}>Ticket Number: {item.ticketNumber}</Text>
      <Text style={styles.itemText}>Customer: {item.customerName}</Text>
      <Text style={styles.itemText}>Created At: {new Date(item.createdAt).toLocaleString()}</Text>
      <Text style={styles.itemText}>Service Date: {item.serviceDate}</Text>
      <TouchableOpacity style={styles.viewButton} onPress={() => handleViewDetails(item)}>
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Feedback List</Text>
      {data?.length > 0 ?
        <FlatList
          data={data}
          keyExtractor={(item) => item?._id} // Replace with your unique ID field
          renderItem={renderFeedbackItem}
          contentContainerStyle={styles.listContainer}
        />
        :
        <View>
          <Text style={styles.noFeedback}>You have 0 feedback</Text>
        </View>
      }

      {/* Modal for displaying detailed feedback */}
      <Modal
        isVisible={modalVisible}
        transparent={true}
        animationType="slide"
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {selectedFeedback && (
              <ScrollView>
                <Text style={styles.modalHeader}>Feedback Details</Text>
                <Text style={styles.modalText}>Ticket Number: {selectedFeedback.ticketNumber}</Text>
                <Text style={styles.modalText}>Service Date: {selectedFeedback.serviceDate}</Text>
                <Text style={styles.modalText}>Customer: {selectedFeedback.customerName}</Text>
                <Text style={styles.modalText}>Issues Faced: {selectedFeedback.issuesFaced}</Text>
                <Text style={styles.modalText}>Comments: {selectedFeedback.comments}</Text>
                <Text style={styles.modalText}>Future Service Interest: {selectedFeedback.futureServiceInterest}</Text>
                <Text style={styles.modalText}>Created At: {new Date(selectedFeedback.createdAt).toLocaleString()}</Text>
                <View style={styles.row}>
                  <Text style={styles.modalText}>Overall Satisfaction:</Text>
                  <Rating
                    imageSize={20}
                    readonly
                    startingValue={selectedFeedback.overallSatisfaction}
                    style={styles.rating}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.modalText}>Service Quality:</Text>
                  <Rating
                    imageSize={20}
                    readonly
                    startingValue={selectedFeedback.serviceQuality}
                    style={styles.rating}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.modalText}>Timeliness:</Text>
                  <Rating
                    imageSize={20}
                    readonly
                    startingValue={selectedFeedback.timeliness}
                    style={styles.rating}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.modalText}>Professionalism:</Text>
                  <Rating
                    imageSize={20}
                    readonly
                    startingValue={selectedFeedback.professionalism}
                    style={styles.rating}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.modalText}>Recommendation Likelihood:</Text>
                  <Rating
                    imageSize={20}
                    readonly
                    startingValue={selectedFeedback.recommendationLikelihood}
                    style={styles.rating}
                  />
                </View>
              </ScrollView>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  indexContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0284c7',
    borderRadius: 100,
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  indexText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  row: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  rating: {
    marginLeft: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noFeedback: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: "90%",
    color: "red",
    marginBottom: 10,
  },
  viewButton: {
    marginTop: 10,
    backgroundColor: '#0284c7',
    padding: 10,
    borderRadius: 5,
  },
  viewButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#0284c7',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FeedbackPage;
