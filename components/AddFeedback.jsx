import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { AirbnbRating } from 'react-native-ratings';
import Modal from 'react-native-modal';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { RadioButton } from 'react-native-paper';
import http_request from "../http_request"

const AddFeedback = ({ existingFeedback,  isVisible, onClose, complaints }) => {
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            ticketNumber: complaints?._id || '',
            serviceDate: complaints?.updatedAt ? new Date(complaints?.updatedAt).toLocaleDateString() : '',
            customerName: complaints?.fullName || '',
            emailAddress: complaints?.emailAddress || '',
            
            comments: '',
            issuesFaced: '',
            futureServiceInterest: '',
              overallSatisfaction: 0,
            serviceQuality: 0,
            timeliness: 0,
            professionalism: 0,
            recommendationLikelihood: 0
        }
    });

    const AddFeedback = async (data) => {
        try {
            setLoading(true);
             const reqData={...data,recommendationLikelihood:data?.recommendationlikelihood}

            const endpoint = existingFeedback?._id ? `/editFeedback/${existingFeedback._id}` : '/addFeedback';
            const response = existingFeedback?._id ? await http_request.patch(endpoint, data) : await http_request.post(endpoint, reqData);
            const { data: responseData } = response;
            Alert.alert(
                "Your Feedback ", // Title of the alert
                "Your Feedback added Successfully.", // Message of the alert
                [
                  {
                    text: "OK", // Button text
                    onPress: () => console.log("OK Pressed") // Button press handler
                  }
                ],
                { cancelable: false } // Whether the alert is cancelable
              );
           
            reset()
            setLoading(false);
            onClose(true);
        } catch (err) {
            setLoading(false);
            onClose(true);
            console.error(err);
        }
    };

    const onSubmit = (data) => {
        AddFeedback(data);
    };
// console.log(complaints);

    useEffect(() => {
        // Set form values when complaints change
        setValue('ticketNumber', complaints?._id || '');
        setValue('customerName', complaints?.fullName || '');
        setValue('serviceDate', complaints?.updatedAt ? new Date(complaints?.updatedAt).toLocaleDateString() : '');
        setValue('emailAddress', complaints?.emailAddress || '');
        setValue('issuesFaced', complaints?.issuesFaced || '');
        setValue('brandId', complaints?.brandId);
        setValue('brandName', complaints?.productBrand);
        setValue('userId', complaints?.userId);
        setValue('technicianId', complaints?.technicianId);
        setValue('technician', complaints?.assignTechnician);
        setValue('serviceCenterId', complaints?.assignServiceCenterId);
        setValue('serviceCenter', complaints?.assignServiceCenter);
    }, [complaints]);

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', flex: 1 }}>
                        Create a new complaint
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <MaterialIcons name="cancel" size={40} color="red" />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.containerScroll}>
                    <View style={styles.form}>
                        <Controller
                            control={control}
                            name="ticketNumber"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder="Ticket Number"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    editable={false}
                                    style={styles.inputDisabled}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="serviceDate"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder="Service Date"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    editable={false}
                                    style={styles.inputDisabled}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="customerName"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder="Customer Name"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    editable={false}
                                    style={styles.inputDisabled}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="emailAddress"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder="Email Address"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    editable={false}
                                    style={styles.inputDisabled}
                                />
                            )}
                        />
                        {['Overall Satisfaction', 'Service Quality'].map(field => {
                            const fieldName = field.toLowerCase().replace(/\s/g, '');
                            return (
                                <View key={fieldName} style={styles.ratingContainer}>
                                    <Text>{field}:</Text>
                                    <Controller
                                        control={control}
                                        name={fieldName}
                                        rules={{ required: 'This field is required' }}
                                        render={({ field: { onChange, value } }) => (
                                            <AirbnbRating
                                                count={5}
                                                defaultRating={value || 0}
                                                size={20}
                                                showRating
                                                onFinishRating={onChange}
                                            />
                                        )}
                                    />
                                    {errors[fieldName] && (
                                        <Text style={styles.errorText}>{errors[fieldName]?.message}</Text>
                                    )}
                                </View>
                            );
                        })}
                        {['Timeliness', 'Professionalism'].map(field => {
                const fieldName = field.toLowerCase().replace(/\s/g, '');
                // console.log(`Rendering field: ${fieldName}`);  
                return (
                    <View key={fieldName} style={styles.ratingContainer}>
                        <Text>{field}:</Text>
                        <Controller
                            control={control}
                            name={fieldName}
                            rules={{ required: 'This field is required' }}
                            render={({ field: { onChange, value } }) => (
                                <AirbnbRating
                                    count={5}
                                    defaultRating={value || 0}
                                    size={20}
                                    showRating
                                    onFinishRating={onChange}
                                />
                            )}
                        />
                        {errors[fieldName] && (
                            <Text style={styles.errorText}>{errors[fieldName]?.message}</Text>
                        )}
                    </View>
                );
            })}
                          {['Recommendation Likelihood'].map(field => {
                            const fieldName = field.toLowerCase().replace(/\s/g, '');
                            return (
                                <View key={fieldName} style={styles.ratingContainer}>
                                    <Text>{field}:</Text>
                                    <Controller
                                        control={control}
                                        name={fieldName}
                                        rules={{ required: 'This field is required' }}
                                        render={({ field: { onChange, value } }) => (
                                            <AirbnbRating
                                                count={5}
                                                defaultRating={value || 0}
                                                size={20}
                                                showRating
                                                onFinishRating={onChange}
                                            />
                                        )}
                                    />
                                    {errors[fieldName] && (
                                        <Text style={styles.errorText}>{errors[fieldName]?.message}</Text>
                                    )}
                                </View>
                            );
                        })}
                        <Controller
                            control={control}
                            name="comments"
                            rules={{ required: true }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder="Comments/Suggestions"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    multiline
                                    style={styles.textArea}
                                />
                            )}
                        />
                        {errors.comments && <Text style={styles.errorText}>This field is required</Text>}
                        <Controller
                            control={control}
                            name="issuesFaced"
                            rules={{ required: true }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    placeholder="Issues Faced"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    multiline
                                    style={styles.textArea}
                                />
                            )}
                        />
                        {errors.issuesFaced && <Text style={styles.errorText}>Issues Faced field is required</Text>}
                        <View style={styles.radioGroup}>
                            <Text>Future Service Interest:</Text>
                            <Controller
                                control={control}
                                name="futureServiceInterest"
                                rules={{ required: 'This field is required' }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={styles.radioButtonContainer}>
                                        <TouchableOpacity
                                            style={styles.radioButton}
                                            onPress={() => {
                                                onChange('Yes');
                                                setValue('futureServiceInterest', 'Yes');
                                            }}
                                        >
                                            <RadioButton
                                                value="Yes"
                                                status={value === 'Yes' ? 'checked' : 'unchecked'}
                                                onPress={() => {
                                                    onChange('Yes');
                                                    setValue('futureServiceInterest', 'Yes');
                                                }}
                                            />
                                            <Text>Yes</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.radioButton}

                                            onPress={() => {
                                                onChange('No');
                                                setValue('futureServiceInterest', 'No');
                                            }}
                                        >
                                            <RadioButton
                                                value="No"
                                                status={value === 'No' ? 'checked' : 'unchecked'}
                                                onPress={() => {
                                                    onChange('No');
                                                    setValue('futureServiceInterest', 'No');
                                                }}
                                            />
                                            <Text>No</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                            {errors.futureServiceInterest && <Text style={styles.errorText}>{errors.futureServiceInterest.message}</Text>}
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.cancelButton]}
                                disabled={loading}
                                onPress={() => onClose(true)}
                            >
                                <Text style={styles.saveButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                                disabled={loading}
                                onPress={handleSubmit(onSubmit)}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#ffffff" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Add Feedback</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    form: {
        margin: 16,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    inputDisabled: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        height: 100,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 8,
    },
    ratingContainer: {
        marginBottom: 12,
    },
    radioGroup: {
        marginBottom: 12,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: Colors.PRIMARY,
        padding: 10,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    saveButtonDisabled: {
        backgroundColor: '#ccc',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 4,
    },
});

export default AddFeedback;
