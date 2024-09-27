import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import http_request from "../http_request";

export default function UpdateServiceStatus({ isVisible, onClose, RefreshData, service }) {
    
  const { control, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (service) {
        setValue("status", service?.status);
    }
  }, [service]);

  const onSubmit = async (data) => {
    try {
      let response = await http_request.patch(`/editComplaint/${service?._id}`, data);
      let { data: responseData } = response;
      RefreshData(responseData);
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal visible={isVisible} onBackdropPress={onClose} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Update Status</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={Colors.GRAY} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Status</Text>
                  <Picker
                    selectedValue={value}
                    style={styles.picker}
                    onValueChange={onChange}
                  >
                    <Picker.Item label="In Progress" value="IN PROGRESS" />
                    <Picker.Item label="Awaiting Parts" value="PART PENDING" />
                    <Picker.Item label="Assign" value="ASSIGN" />
                    <Picker.Item label="Completed" value="COMPLETED" />
                    <Picker.Item label="Canceled" value="CANCELED" />
                  </Picker>
                </View>
              )}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
  },
  submitButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
