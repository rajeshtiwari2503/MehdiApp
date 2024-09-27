import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http_request from '../http_request';
import BankDetailsList from './BankDetailsList';  // Import your BankDetailsList component

const BankDetails = () => {
    const [bankDetails, setBankDetails] = useState([]);
    const [value, setValue] = useState(null);
    const [refresh, setRefresh] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getStoredValue = async () => {
            try {
                const storedValue = await AsyncStorage.getItem('user');
                if (storedValue) {
                    setValue(JSON.parse(storedValue));
                }
            } catch (err) {
                console.error('Failed to retrieve stored value', err);
            }
        };
        
        getStoredValue();
        getWalletDetails();
    }, [refresh]);

    const getWalletDetails = async () => {
        try {
            const storedValue = await AsyncStorage.getItem('user');
            const value1 = JSON.parse(storedValue);
            setLoading(true);
            const response = await http_request.get(`/bankDetailByUser/${value1?.user?._id}`);
            setBankDetails(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching wallet details:', err);
            setLoading(false);
        }
    };

    const RefreshData = (data) => {
        setRefresh(data);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <BankDetailsList RefreshData={RefreshData} data={bankDetails} value={value} />
                )}
                {/* <Button title="Refresh" onPress={() => RefreshData(Date.now())} /> */}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
});

export default BankDetails;
