import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http_request from '../http_request';
import TransactionList from './BankTransactionsList';
 

const BankTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [bankDetails, setBankDetails] = useState([]);
    const [value, setValue] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [refresh, setRefresh] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getStoredValue = async () => {
            try {
                const storedValue = await AsyncStorage.getItem("user");
                if (storedValue) {
                    setValue(JSON.parse(storedValue));
                }
            } catch (err) {
                console.error('Failed to retrieve stored value', err);
            }
        };

        const fetchData = async () => {
            await getStoredValue();
            getTransactions();
            getWalletById();
            getWalletDetails();
        };

        fetchData();
    }, [refresh]);

    // const getWalletById = async () => {
    //     try {
    //         setLoading(true);
    //         const storedValue = await AsyncStorage.getItem("user");
    //         const userD = JSON.parse(storedValue);
    //         let response = await http_request.get(`/getWalletByCenterId/${userD?.user?._id}`);
    //         let { data } = response;
    //         setWallet(data);
    //     } catch (err) {
    //         console.error('Error fetching wallet by ID:', err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const getWalletById = async () => {
        try {
            setLoading(true);
            const storedValue = await AsyncStorage.getItem("user");
            const userD = JSON.parse(storedValue);
            let response = await http_request.get(`/getWalletByCenterId/${userD?.user?._id}`);
            
            if (response?.status === 404) {
                console.error('Wallet not found');
                // Provide user feedback or handle the case where the wallet is not found
            } else {
                let { data } = response;
                setWallet(data);
            }
        } catch (err) {
            console.error('Error fetching wallet by ID:', err);
            
        } finally {
            setLoading(false);
        }
    };
    
    const getWalletDetails = async () => {
        try {
            setLoading(true);
            const storedValue = await AsyncStorage.getItem("user");
            const value1 = JSON.parse(storedValue);
            const response = await http_request.get(`/bankDetailByUser/${value1?.user?._id}`);
            const { data } = response;
            setBankDetails(data);
        } catch (err) {
            console.error('Error fetching wallet details:', err);
        } finally {
            setLoading(false);
        }
    };

    const getTransactions = async () => {
        try {
            setLoading(true);
            const storedValue = await AsyncStorage.getItem("user");
            const value1 = JSON.parse(storedValue);
            const endPoint = `/getTransactionByCenterId/${value1?.user?._id}`;
            const response = await http_request.get(endPoint);
            let { data } = response;
            setTransactions(data);
        } catch (err) {
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const RefreshData = (data) => {
        setRefresh(data);
    };

    const transData = transactions.length > 0
        ? transactions.map((item, index) => ({ ...item, i: index + 1 }))
        : [];

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                
                    <TransactionList
                        RefreshData={RefreshData}
                        wallet={wallet}
                        bankDetails={bankDetails}
                        data={transData}
                        loading={loading}
                        value={value?.user}
                    />
                    
              
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
});

export default BankTransactions;
