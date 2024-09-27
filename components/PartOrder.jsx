import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import http_request from "../http_request";

export default function PartOrder({ isVisible, onClose, RefreshData, spareparts, service }) {

  const { control, handleSubmit, setValue, formState: { errors } } = useForm();

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

          <ScrollView>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Ticket ID</Text>
              <Controller
                control={control}
                name="ticketID"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.ticketID && <Text style={styles.errorText}>{errors.ticketID.message}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Sparepart Name</Text>
              <Controller
                control={control}
                name="sparepartName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Picker
                    selectedValue={value}
                    style={styles.picker}
                    onValueChange={onChange}
                  >
                    <Picker.Item label="Select Sparepart" value="" />
                    {spareparts?.map(sparepart => (
                      <Picker.Item key={sparepart?.id} label={sparepart?.partName} value={sparepart?._id} />
                    ))}
                  </Picker>
                )}
              />
              {errors?.sparepartName && <Text style={styles.errorText}>{errors?.sparepartName?.message}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Part Number/Model Number</Text>
              <Controller
                control={control}
                name="partNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.partNumber && <Text style={styles.errorText}>{errors.partNumber.message}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Quantity</Text>
              <Controller
                control={control}
                name="quantity"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={text => onChange(Number(text))}
                    value={value?.toString()}
                  />
                )}
              />
              {errors.quantity && <Text style={styles.errorText}>{errors.quantity.message}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Priority Level</Text>
              <Controller
                control={control}
                name="priorityLevel"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Picker
                    selectedValue={value}
                    style={styles.picker}
                    onValueChange={onChange}
                  >
                    <Picker.Item label="Standard" value="Standard" />
                    <Picker.Item label="Urgent" value="Urgent" />
                  </Picker>
                )}
              />
              {errors.priorityLevel && <Text style={styles.errorText}>{errors.priorityLevel.message}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Supplier Name</Text>
              <Controller
                control={control}
                name="supplierInformation.name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.supplierInformation?.name && <Text style={styles.errorText}>{errors.supplierInformation.name.message}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Supplier Contact</Text>
              <Controller
                control={control}
                name="supplierInformation.contact"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.supplierInformation?.contact && <Text style={styles.errorText}>{errors.supplierInformation.contact.message}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Supplier Address</Text>
              <Controller
                control={control}
                name="supplierInformation.address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.supplierInformation?.address && <Text style={styles.errorText}>{errors.supplierInformation.address.message}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Order Date</Text>
              <Controller
                control={control}
                name="orderDate"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="YYYY-MM-DD"
                  />
                )}
              />
              {errors.orderDate && <Text style={styles.errorText}>{errors.orderDate.message}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Expected Delivery Date</Text>
              <Controller
                control={control}
                name="expectedDeliveryDate"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="YYYY-MM-DD"
                  />
                )}
              />
              {errors.expectedDeliveryDate && <Text style={styles.errorText}>{errors.expectedDeliveryDate.message}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Shipping Method</Text>
              <Controller
                control={control}
                name="shippingMethod"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Picker
                    selectedValue={value}
                    style={styles.picker}
                    onValueChange={onChange}
                  >
                    <Picker.Item label="Standard" value="Standard" />
                    <Picker.Item label="Express" value="Express" />
                  </Picker>
                )}
              />
              {errors.shippingMethod && <Text style={styles.errorText}>{errors.shippingMethod.message}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Comments/Notes</Text>
              <Controller
                control={control}
                name="comments"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline
                    numberOfLines={4}
                  />
                )}
              />
              {errors.comments && <Text style={styles.errorText}>{errors.comments.message}</Text>}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal >
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
    height: '90%',
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
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
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


