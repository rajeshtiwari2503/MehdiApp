import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { useForm, Controller } from 'react-hook-form';
import { Colors } from '@/constants/Colors'
import http_request from "../http_request";


const EditUserProfile = ({ isVisible, RefreshData,onClose, user, onSave }) => {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
  
  });

  // Update form values if user prop changes
  useEffect(() => {
    if (user) {
      setValue('name', user?.name || '');
      setValue('email', user?.email || '');
      setValue('address', user?.address || '');
      setValue('contact', user?.contact ||'' );
      setValue('password', user?.password || '');
    }
  }, [user ]);

  const onSubmit = async(data) => {
    // console.log(user?._id);
    try {

      setLoading(true);
      const endpoint =   `/editUser/${user?._id}`  ;
      const response =   await http_request.patch(endpoint, data)  ;
      const { data: responseData } = response;

      // onSave(data);
      RefreshData(responseData);
      setLoading(false);
      onClose();
     
      
  } catch (err) {
      setLoading(false);
      
      onClose( );
      console.log(err);
  }
};

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.header}>Edit Profile</Text>

          <Controller
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field: { onChange,  value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Name"
                
                onChangeText={onChange}
                value={value}
              />
            )}
            name="name"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

          <Controller
            control={control}
            rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } }}
            render={({ field: { onChange,   value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Email"
            
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
              />
            )}
            name="email"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          <Controller
            control={control}
            rules={{ required: 'Address is required' }}
            render={({ field: { onChange,   value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Address"
                
                onChangeText={onChange}
                value={value}
              />
            )}
            name="address"
          />
          
          {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
          <Controller
            control={control}
            rules={{ 
              required: 'Contact is required',
              pattern: { value: /^[0-9]{10}$/, message: 'Invalid phone number' } 
            }}
            render={({ field: { onChange,  value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Contact"
             
                onChangeText={onChange}
                value={value}
                keyboardType="phone-pad"
              />
            )}
            name="contact"
          />
          {errors.contact && <Text style={styles.errorText}>{errors.contact.message}</Text>}

          <Controller
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field: { onChange,   value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Password"
               
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
            name="password"
          />
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            disabled={loading} 
            onPress={handleSubmit(onSubmit)}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  saveButton: {
    backgroundColor:Colors.PRIMARY,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
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

export default EditUserProfile;
