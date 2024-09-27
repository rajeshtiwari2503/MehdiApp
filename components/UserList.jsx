import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import http_request from '../http_request';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message'; // Assuming you're using this for toast notifications

const UserList = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      let response = await http_request.get("/getAllUser");
      let { data } = response;
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

 const data=users?.map((item,index)=>({...item,i:index+1}))
  const renderItem = ({ item, index }) => (
    <View key={index} style={styles.row}>
      <Text style={{ width: 50 }}>{item.i}</Text>
      <Text style={[{   width: 120 }]}>{item.name}</Text>
      <Text style={[styles.cell,{   width: 250 }]}>{item.email}</Text>
      <Text style={[styles.cell,{   width: 120 }]}>{item.contact}</Text>
      <Text style={styles.cell}>{new Date(item.createdAt).toLocaleString()}</Text>
       
    </View>
  );

  return (
    <View style={styles.container}>
      <Toast />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Users List</Text>
       
      </View>
      {users.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
          <View>
            <View style={styles.header}>
              <Text style={[styles.headerCell, { width: 50 }]}>Sr. No.</Text>
              <Text style={[styles.headerCell, { width: 120 }]}>User Name</Text>
              <Text style={[styles.headerCell, { width: 250 }]}>Email</Text>
              <Text style={[styles.headerCell, { width: 120 }]}>Contact</Text>
              <Text style={[styles.headerCell, { width: 150 }]}>Created At</Text>
             
            </View>
            <FlatList
              data={data}
              keyExtractor={item => item._id}
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
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    fontSize: 16,
    marginBottom: 5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  scrollView: {
    maxHeight: '80%',
  },
  headerModal: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#0284c7',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
  },
});

export default UserList;
