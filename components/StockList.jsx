import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
import Toast from 'react-native-toast-message';
 
import { Colors } from '@/constants/Colors';
 

const StockList = (props) => {

  

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedValue = await AsyncStorage.getItem("user");
      if (storedValue) {
        setUserData(JSON.parse(storedValue));
      }
    };

    fetchUserData();
  }, []);

  // const filterData = props?.data?.filter((item) => item?.userId === userData?.user?._id);
  const filterData = props?.data;
  const data = props?.data;

  
 
  
  const renderItem = ({ item ,index}) => (
    <View key={index} style={styles.row}>
      <Text style={{ width: 50 }}>{item.i}</Text>
      <Text style={[{ paddingLeft: 13, width: 120 }]}>{item.productName}</Text>
      <Text style={styles.cell}>{item.productDescription}</Text>
      <Text style={styles.cell}>{item.categoryName}</Text>
      <Text style={styles.cell}>{item.productBrand}</Text>
      <Text style={styles.cell}>{item.serialNo}</Text>
      <Text style={styles.cell}>{item.modelNo}</Text>
      <Text style={styles.cell}>{item.status}</Text>
      <Text style={styles.cell}>{new Date(item.updatedAt).toLocaleString()}</Text>
      <View style={styles.actions}>
         
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <Toast  />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Stock Information</Text>
        
      </View>
      {data.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (

        <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
          <View>
            <View style={styles.header}>
              <Text style={[styles.headerCell, { width: 60 }]}>Sr. No.</Text>
              <Text style={[styles.headerCell, { width: 120 }]}>Product </Text>
              <Text style={[styles.headerCell, { width: 120 }]}>Description </Text>
              <Text style={[styles.headerCell, { width: 120 }]}>Category </Text>
              <Text style={[styles.headerCell, { width: 120 }]}>Brand </Text>
              <Text style={[styles.headerCell, { width: 120 }]}>Serial No. </Text>
              <Text style={[styles.headerCell, { width: 120 }]}>Modal No. </Text>
              <Text style={[styles.headerCell, { textAlign: "center", paddingRight: 20 }]}>Status</Text>
              <Text style={styles.headerCell}>Updated At</Text>
              <Text style={[styles.headerCell, { textAlign: 'right' }]}>Actions</Text>

            </View>
            <FlatList
              data={filterData}
              keyExtractor={item => item?._id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        </ScrollView>
      )}

       
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    // marginTop:25,
    borderRadius:30
},
  header: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,

    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  headerModal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,

    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'left',
    width: 110,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    alignItems: "center",
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'left',
    width: 120,
  },
  statusCell: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: Colors.PRIMARY,
    color: "white",
    // marginLeft:20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // paddingLeft:20,
    paddingTop: 7,
    paddingBottom: 7,
    marginRight: 10,
    borderRadius: 10,
    width: 120,
  },
  actions: {
    flexDirection: 'row',
    width: 100,
    alignItems: 'center',
    justifyContent: "flex-end"
  },
  viewButton: {
    color: 'blue',
    paddingRight: 10,
    textAlign: "right"
  },
  scrollContainer: {
    flexDirection: 'column',

  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    height: '70%',
  },
  scrollView: {
    flex: 1,
  },

  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  pickerContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    height: 40,
  },
  saveButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.PRIMARY,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
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
  errorText: {
    color: 'red',
    marginBottom: 8,
  },

});

export default StockList;
  
 