import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  
  StyleSheet,
  
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import http_request from '../http_request';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';

const BankDetailsList = ({ RefreshData, data, value }) => {
    
  const [existingDetails, setExistingDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();
  
  const AddBankDetails = async (data) => {
    try {
      const reqData = { ...data, userId: value?.user?._id, userName: value?.user?.name };
      
      setLoading(true);
      console.log(reqData);
      const endpoint = existingDetails?._id ? `/editBankDetails/${existingDetails._id}` : '/addBankDetails';
      const response = existingDetails?._id ? await http_request.patch(endpoint, data) : await http_request.post(endpoint, reqData);
      const { data: responseData } = response;
    //   console.log(responseData);
      Toast.show({ type: 'success', text1: responseData.message });
      setLoading(false);
      RefreshData(responseData);
      setIsModalOpen(false);
    } catch (err) {
      setLoading(false);
      setIsModalOpen(false);
      console.error(err);
    }
  };

  const onSubmit = async (data) => {
    AddBankDetails(data);
  };

  const handleEditModalOpen = (row) => {
    setExistingDetails(row);
    setValue("bankName", row?.bankName);
    setValue("accountHolderName", row?.accountHolderName);
    setValue("accountNumber", row?.accountNumber);
    setValue("IFSC", row?.IFSC);
    setValue("commission", row?.commission);
    setIsModalOpen(true);
  };

  return (
    <View style={styles.container}>
     
      <View style={styles.header}>
        <Text style={styles.title}>Wallet & Bank Details</Text>
        {data ? (
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Bank Name:</Text>
          <Text style={styles.value}>{data.bankName}</Text>
          
          <Text style={styles.label}>Account Holder Name:</Text>
          <Text style={styles.value}>{data.accountHolderName}</Text>
          
          <Text style={styles.label}>Account Number:</Text>
          <Text style={styles.value}>{data.accountNumber}</Text>
          
          <Text style={styles.label}>IFSC:</Text>
          <Text style={styles.value}>{data.IFSC}</Text>
          
          <Button
            title="Edit"
            onPress={()=>handleEditModalOpen(data)}
            color="#0284c7"
          />
        </View>
      ) : (
        <Button
            title="Add Bank Details"
            onPress={() => setIsModalOpen(true)}
            color="#0284c7"
          />
      )}
      </View>
    
      
      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Bank Details</Text>
            
            <Controller
              control={control}
              name="bankName"
              rules={{ required: 'Bank Name is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Bank Name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.bankName && <Text style={styles.errorText}>{errors.bankName.message}</Text>}
            
            <Controller
              control={control}
              name="accountHolderName"
              rules={{ required: 'Account Holder Name is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Account Holder Name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.accountHolderName && <Text style={styles.errorText}>{errors.accountHolderName.message}</Text>}
            
            <Controller
              control={control}
              name="accountNumber"
              rules={{ required: 'Account Number is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Account Number"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber.message}</Text>}
            
            <Controller
              control={control}
              name="IFSC"
              rules={{ required: 'IFSC is required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="IFSC"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.IFSC && <Text style={styles.errorText}>{errors.IFSC.message}</Text>}
            
            {/* Add Commission input if needed */}
            
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setIsModalOpen(false)}
                color="#fe3f49"
                disabled={loading}
              />
              <Button
                title={existingDetails ? "Edit Bank Details" : "Add Bank Details"}
                onPress={handleSubmit(onSubmit)}
                color="#2e7d32"
                disabled={loading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  detailsContainer: {
    padding: 16,
    marginTop:"50%",
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  header: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionText: {
    color: '#0284c7',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default BankDetailsList;
