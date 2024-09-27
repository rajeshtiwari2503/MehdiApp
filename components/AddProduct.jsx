import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import http_request from '../http_request';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddProduct ({ existingProduct, RefreshData, onClose, userData, categories, brands })   {
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const [selectedYear, setSelectedYear] = useState("Life Time");
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
   
    const handleConfirm = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(false);
      setDate(currentDate);
    };

    const calculateWarrantyStatus = (purchaseDate, selectedYear) => {
        if (!purchaseDate) return false;
        const currentDate = new Date();
        const purchaseDateObj = new Date(purchaseDate);

        if (selectedYear === "Life Time") {
            return true;
        }

        const warrantyPeriod = parseInt(selectedYear, 10) * 365;
        const warrantyEndDate = new Date(purchaseDateObj.getTime() + warrantyPeriod * 24 * 60 * 60 * 1000);
        return currentDate <= warrantyEndDate;
    };

    const AddProductData = async (data) => {
        try {
            setLoading(true);

            const selectedCategory = categories.find(category => category._id === data.categoryId);

            const reqData = {
                ...data,
                categoryName: selectedCategory?.categoryName,
                categoryId: selectedCategory?._id,
                userId: userData?.user?._id,
                userName: userData?.user?.name,
                warrantyYears: selectedYear,
                warrantyStatus: calculateWarrantyStatus(data.purchaseDate, selectedYear)
            };

            const endpoint = existingProduct?._id ? `/editProduct/${existingProduct._id}` : '/addProduct';
            const response = existingProduct?._id ? await http_request.patch(endpoint, reqData) : await http_request.post(endpoint, reqData);
            const { data: responseData } = response.data;
            RefreshData(responseData);
            setLoading(false);
            onClose(true);
            Toast.show({ type: 'success', text1: responseData.message });
        } catch (err) {
            setLoading(false);
            Toast.show({ type: 'error', text1: err.message });
            onClose(true);
        }
    };

    const onSubmit = (data) => {
        AddProductData(data);
    };

    useEffect(() => {
        if (existingProduct) {
            setValue('productName', existingProduct.productName);
            setValue('productDescription', existingProduct.productDescription);
            setValue('categoryId', existingProduct.categoryId);
            setValue('serialNo', existingProduct.serialNo);
            setValue('modelNo', existingProduct.modelNo);
            setValue('purchaseDate', existingProduct.purchaseDate);
            setValue('warrantyYears', existingProduct.warrantyYears);
            setValue('productBrand', existingProduct.productBrand);
            setValue('brandId', existingProduct.brandId);
            setSelectedYear(existingProduct.warrantyYears);
        }
    }, [existingProduct, setValue]);

    const handleChangeBrand = (id) => {
        const selectedBrand = brands.find(brand => brand._id === id);
        if (selectedBrand) {
            setValue('productBrand', selectedBrand.brandName);
            setValue('brandId', selectedBrand._id);
        }
    };

    const warrantyYears = ["Life Time", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

    const handleYearChange = (value) => {
        setSelectedYear(value === "Life Time" ? value : parseInt(value, 10));
    };

    return (
        <View style={styles.container}>

            <Controller
                control={control}
                name="productName"
                rules={{ required: 'Product Name is required', minLength: { value: 3, message: 'Product Name must be at least 3 characters long' } }}
                render={({ field: { onChange, value } }) => (
                    <>
                        <Text style={styles.label}>Product Name</Text>
                        <TextInput
                            style={[styles.input, errors.productName && styles.errorInput]}
                            // onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        {errors.productName && <Text style={styles.errorText}>{errors.productName.message}</Text>}
                    </>
                )}
            />

            <Controller
                control={control}
                name="productDescription"
                rules={{ required: 'Product Description is required', minLength: { value: 3, message: 'Product Description must be at least 3 characters long' } }}
                render={({ field: { onChange, value } }) => (
                    <>
                        <Text style={styles.label}>Product Description</Text>
                        <TextInput
                            style={[styles.input, errors.productDescription && styles.errorInput]}
                            // onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        {errors.productDescription && <Text style={styles.errorText}>{errors.productDescription.message}</Text>}
                    </>
                )}
            />

            <Controller
                control={control}
                name="categoryId"
                rules={{ required: 'Category is required' }}
                render={({ field: { onChange, value } }) => (
                    <>
                        <Text style={styles.label}>Category</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={value}
                                style={styles.picker}
                                onValueChange={(itemValue) => onChange(itemValue)}
                            >
                                <Picker.Item label="Select a Category" value="" />
                                {categories?.map((category) => (
                                    <Picker.Item key={category._id} label={category.categoryName} value={category._id} />
                                ))}
                            </Picker>
                        </View>
                        {errors.categoryId && <Text style={styles.errorText}>{errors.categoryId.message}</Text>}
                    </>

                )}
            />

            <Controller
                control={control}
                name="productBrand"
                rules={{ required: 'Product Brand is required', minLength: { value: 3, message: 'Product Brand must be at least 3 characters long' } }}
                render={({ field: { onChange, value } }) => (
                    <>
                        <Text style={styles.label}>Brand</Text>
                        <TextInput
                            style={[styles.input, errors.productBrand && styles.errorInput]}
                            // onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                        {errors.productBrand && <Text style={styles.errorText}>{errors.productBrand.message}</Text>}
                    </>
                )}
            />

            <Text style={styles.label}>OR</Text>

            <Controller
                control={control}
                name="brandId"
                render={({ field: { onChange, value } }) => (
                    <>
                        <Text style={styles.label}>Brand</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={value}
                                style={styles.picker}
                                onValueChange={(itemValue) => {
                                    onChange(itemValue);
                                    handleChangeBrand(itemValue);
                                }}
                            >
                                <Picker.Item label="Select a Brand" value="" />
                                {brands?.map((brand) => (
                                    <Picker.Item key={brand._id} label={brand.brandName} value={brand._id} />
                                ))}
                            </Picker>
                        </View>
                    </>
                )}
            />

            <Controller
                control={control}
                name="serialNo"
                render={({ field: { onChange, value } }) => (
                    <>
                        <Text style={styles.label}>Serial No</Text>
                        <TextInput
                            style={styles.input}
                            // onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    </>
                )}
            />

            <Controller
                control={control}
                name="modelNo"
                render={({ field: { onChange, value } }) => (
                    <>
                        <Text style={styles.label}>Model No</Text>
                        <TextInput
                            style={styles.input}
                            // onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    </>
                )}
            />


            <Controller
                control={control}
                name="selectedYear"
                render={({ field: { onChange, value } }) => (
                    <>
                        <Text style={styles.label}>Select Year</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={value}
                                style={styles.picker}
                                onValueChange={(itemValue) => {
                                    onChange(itemValue);
                                    handleYearChange(itemValue);
                                }}
                            >
                                {warrantyYears.map((year) => (
                                    <Picker.Item key={year} label={year} value={year} />
                                ))}
                            </Picker>
                        </View>
                    </>
                )}
            />
            <View style={{ marginBottom: 20 }}>
            <Controller
        control={control}
        name="purchaseDate"
        defaultValue={date.toISOString().split('T')[0]}
        render={({ field: { onChange, value } }) => (
          <>
            <Text style={styles.label}>Purchase Date</Text>
            <TouchableOpacity onPress={() => setShow(true)} style={styles.dateInput}>
              <Text>{value || "Select Date"}</Text>
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShow(false);
                  const formattedDate = selectedDate.toISOString().split('T')[0];
                  onChange(formattedDate);
                }}
              />
            )}
          </>
        )}
      />
            </View>

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
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 20,
        marginBottom: 20
    },

    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    pickerContainer: {
        // borderColor: '#ddd',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 16,
        height: 40,
        justifyContent: 'center',
    },
    picker: {
        height: 40,
    },
    errorText: {
        color: 'red',
        marginBottom: 15,
    },
    errorInput: {
        borderColor: 'red',
    },
    dateInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    saveButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 12,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 10,
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

 
