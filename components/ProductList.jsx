import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http_request from '../http_request';
import Toast from 'react-native-toast-message';
import AddProduct from './AddProduct';
import { Colors } from '@/constants/Colors';
import Modal from 'react-native-modal';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const ProductList = (props) => {

  const categories = props?.categories;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isWarranty, setIsWarranty] = useState(false);
  const [warranty, setWarranty] = useState("");
  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [cateId, setCateId] = useState("");
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');

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

  const filterData = props?.data?.filter((item) => item?.userId === userData?.user?._id);
  const data = userData?.user?.role === "ADMIN" || userData?.user?.role === "BRAND" ? props?.data : filterData;

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const sortedData = stableSort(data, getComparator(sortDirection, sortBy))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleWarrantyClose = () => {
    setIsWarranty(false);
  };

  const handleAdd = (row) => {
    setEditData(row);
    setEditModalOpen(true);
  };

  const handleDelete = (id) => {
    setCateId(id);
    setConfirmBoxView(true);
  };

  const deleteData = async () => {
    try {
      let response = await http_request.deleteData(`/deleteProduct/${cateId}`);
      let { data } = response;
      setConfirmBoxView(false);
      props?.RefreshData(data);
      Toast.show({ text1: data.message });
    } catch (err) {
      console.log(err);
    }
  };

  const handleWarranty = (data) => {
    setWarranty(data);
    setIsWarranty(true);
  };



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
        <TouchableOpacity onPress={() => handleWarranty(item.warrantyStatus)} style={{ marginRight: 10 }}>
          <MaterialIcons name="preview" size={24} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAdd(item)} style={{ marginRight: 10 }}>
          <FontAwesome5 name="edit" size={20} color="#FFA500" />
        </TouchableOpacity>
        {/* {userData?.user?.role === "ADMIN" && ( */}
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <MaterialIcons name="delete" size={24} color="#FF0000" />
        </TouchableOpacity>
        {/* )}  */}
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <Toast  />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Product Information</Text>
        <TouchableOpacity onPress={() => handleAdd(null)} style={{ backgroundColor: '#0284c7', padding: 10, borderRadius: 5 }}>
          <Text style={{ color: 'white' }}>Add Product</Text>
        </TouchableOpacity>
      </View>
      {data.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (

        <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
          {filterData?.length > 0 ?
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
           :
           <View>
             <Text style={styles.noFeedback}>You have 0 feedback</Text>
           </View>
         }
        </ScrollView>
      )}

      <Modal isVisible={editModalOpen} onBackdropPress={handleEditModalClose}>

        <View style={styles.modalContent}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.headerModal}> Add Ptoduct </Text>
            <View >
              <AddProduct categories={categories} userData={userData} brands={props?.brands} existingProduct={editData} RefreshData={props?.RefreshData} onClose={handleEditModalClose} />

            </View>

          </ScrollView>
        </View>
      </Modal>

      {confirmBoxView && (
        Alert.alert(
          "Confirm Delete",
          "Are you sure you want to delete this product?",
          [
            { text: "Cancel", onPress: () => setConfirmBoxView(false), style: "cancel" },
            { text: "OK", onPress: deleteData }
          ]
        )
      )}

      <Modal isVisible={isWarranty} onBackdropPress={handleWarrantyClose}>

        <View style={styles.modalContent}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.headerModal}>Ptoduct Warranty</Text>
            <View style={{ marginTop: "50%" }}>
              <Text style={{ color: warranty ? 'green' : "red", fontWeight: "bold", fontSize: 18, textAlign: "center" }}>{warranty ? "Your product is under Warranty" : "Your product is not under Warranty"}</Text>
            </View>
            <View style={{ marginTop: "50%" }}>
              <TouchableOpacity style={styles.closeButton} onPress={handleWarrantyClose}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  noFeedback: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: "90%",
    color: "red",
    marginBottom: 10,
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

export default ProductList;

function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
