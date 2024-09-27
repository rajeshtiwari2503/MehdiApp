// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     Button,
//     FlatList,
//     Modal,
//     TextInput,
//     StyleSheet,
//     ActivityIndicator,
//     Alert,
// } from 'react-native';
// import { useForm, Controller } from 'react-hook-form';

// import http_request from '../http_request';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const TransactionList = ({ data, RefreshData, wallet, bankDetails, loading, value }) => {


//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [amount, setAmount] = useState('');

//     const { control, handleSubmit, formState: { errors } } = useForm();

//     const handleWallet = async () => {
//         try {
//             const resData = {
//                 serviceCenterId: value?._id,
//                 serviceCenterName: value?.name,
//                 contact: +(value?.contact),
//                 email: value?.email,
//                 accountHolderName: bankDetails?.accountHolderName,
//                 bankDetailId: bankDetails?._id,
//                 ifsc: bankDetails?.IFSC,
//                 accountNumber: bankDetails?.accountNumber,
//             };
//             // console.log(resData);
//             const response = await http_request.post("/addWallet", resData);
//             const { data } = response;

//             RefreshData(data);
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     const handleDuePayment = async (data) => {
//         try {
//             let centerData = await AsyncStorage.getItem('user');
//             let centerInfo = JSON.parse(centerData);

//             const serviceCenterPayInfo = {
//                 account_number: adminBankDtl?.account_number,
//                 amount: data?.amount * 100,
//                 currency: "INR",
//                 mode: "NEFT",
//                 purpose: "payout",
//                 fund_account: {
//                     account_type: "bank_account",
//                     bank_account: {
//                         name: bankDetails?.accountHolderName,
//                         ifsc: bankDetails?.IFSC,
//                         account_number: bankDetails?.accountNumber,
//                     },
//                     contact: {
//                         name: centerInfo?.user?.serviceCenterName,
//                         email: centerInfo?.user?.email,
//                         contact: centerInfo?.user?.contact,
//                         type: "employee",
//                         reference_id: "12345",
//                         notes: {
//                             notes_key_1: "Tea, Earl Grey, Hot",
//                             notes_key_2: "Tea, Earl Grey… decaf.",
//                         },
//                     },
//                 },
//                 queue_if_low_balance: true,
//                 reference_id: "Acme Transaction ID 12345",
//                 narration: "Acme Corp Fund Transfer",
//                 notes: {
//                     notes_key_1: "Beam me up Scotty",
//                     notes_key_2: "Engage",
//                 },
//             };

//             let response = await http_request.post(`/serviceCenterDuePayment`, serviceCenterPayInfo);
//             let { data } = response;
//             setIsModalOpen(false);
//             RefreshData(data);

//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const onSubmit = (data) => {
//         if (bankDetails) {
//             handleDuePayment(data);
//         } else {
//             Alert.alert("Error", "Please add bank details");
//         }
//     };

//     return (
//         <View style={styles.container}>
//             {loading ? (
//                 <ActivityIndicator size="large" color="#0000ff" />
//             ) : (
//                 <View>
//                     {value?.user?.role === "ADMIN" ? null : (
//                         <View style={styles.walletContainer}>
//                             {wallet ? (
//                             <>
//                                 <View style={styles.walletInfo}>
//                                     <Text style={styles.walletTitle}>Wallet</Text>
//                                     <View style={styles.walletBalance}>
//                                         <Text style={styles.walletLabel}>Wallet Balance</Text>
//                                         <Text style={styles.walletAmount}>{wallet?.dueAmount}</Text>
//                                     </View>
//                                     <View style={styles.walletBalance}>
//                                         <Text style={styles.walletLabel}>Total Commissions</Text>
//                                         <Text style={styles.walletAmount}>{wallet?.totalCommission}</Text>
//                                     </View>
//                                     <Button title="Withdrawal" onPress={() => { setIsModalOpen(true); setAmount(wallet?.dueAmount); }} />


//                                 </View>
//                                 <View>
//                                     <Text style={styles.title}>Bank Transactions List</Text>

//                                     <FlatList
//                                         data={data}
//                                         keyExtractor={(item) => item.id.toString()}
//                                         renderItem={({ item, index }) => (
//                                             <View style={styles.transactionRow}>
//                                                 <Text>{index + 1}</Text>
//                                                 <Text>{item.userName}</Text>
//                                                 <Text>{item.paidAmount} INR</Text>
//                                                 <Text>{new Date(item.createdAt).toLocaleString()}</Text>
//                                             </View>
//                                         )}
//                                     />
//                                 </View>
//                             </>
//                             ) : (
//                                 <Button title="Activate Wallet" onPress={handleWallet} />
//                             )}  
//                         </View>
//                     )}



//                     <Modal
//                         visible={isModalOpen}
//                         transparent
//                         animationType="slide"
//                         onRequestClose={() => setIsModalOpen(false)}
//                     >
//                         <View style={styles.modalContainer}>
//                             <View style={styles.modalContent}>
//                                 <Text style={styles.modalTitle}>Add Amount</Text>
//                                 <Controller
//                                     control={control}
//                                     name="amount"
//                                     rules={{ required: 'Amount is required' }}
//                                     render={({ field: { onChange, onBlur, value } }) => (
//                                         <TextInput
//                                             style={styles.input}
//                                             keyboardType="numeric"
//                                             placeholder="Amount"
//                                             onBlur={onBlur}
//                                             onChangeText={onChange}
//                                             value={value}
//                                         />
//                                     )}
//                                 />
//                                 {errors.amount && <Text style={styles.errorText}>{errors.amount.message}</Text>}
//                                 <View style={styles.modalButtons}>
//                                     <Button title="Cancel" onPress={() => setIsModalOpen(false)} />
//                                     <Button title="Withdrawal Amount" onPress={handleSubmit(onSubmit)} />
//                                 </View>
//                             </View>
//                         </View>
//                     </Modal>
//                 </View>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//     },
//     walletContainer: {
//         marginBottom: 16,
//     },
//     walletInfo: {
//         backgroundColor: '#e0f7fa',
//         borderRadius: 8,
//         padding: 16,
//         marginBottom: 16,
//     },
//     walletTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     walletBalance: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginVertical: 8,
//     },
//     walletLabel: {
//         fontSize: 14,
//         fontWeight: 'bold',
//     },
//     walletAmount: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#00796b',
//     },
//     title: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         marginBottom: 16,
//     },
//     transactionRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         padding: 8,
//         borderBottomWidth: 1,
//         borderBottomColor: '#ccc',
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.5)',
//     },
//     modalContent: {
//         backgroundColor: '#fff',
//         padding: 16,
//         borderRadius: 8,
//         width: '80%',
//     },
//     modalTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 16,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 4,
//         padding: 8,
//         marginBottom: 16,
//     },
//     errorText: {
//         color: 'red',
//         marginBottom: 16,
//     },
//     modalButtons: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
// });

// export default TransactionList;
import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    FlatList,
    Modal,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Alert,
   
    ScrollView
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import http_request from '../http_request';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionList = ({ data, RefreshData, wallet, bankDetails, loading, value }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState('');

    const { control, handleSubmit, formState: { errors } } = useForm();

    const handleWallet = async () => {
        try {
            const resData = {
                serviceCenterId: value?._id,
                serviceCenterName: value?.name,
                contact: +(value?.contact),
                email: value?.email,
                accountHolderName: bankDetails?.accountHolderName,
                bankDetailId: bankDetails?._id,
                ifsc: bankDetails?.IFSC,
                accountNumber: bankDetails?.accountNumber,
            };

            const response = await http_request.post("/addWallet", resData);
            const { data } = response;

            RefreshData(data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDuePayment = async (data) => {
        try {
            let centerData = await AsyncStorage.getItem('user');
            let centerInfo = JSON.parse(centerData);

            const serviceCenterPayInfo = {
                account_number: adminBankDtl?.account_number,
                amount: data?.amount * 100,
                currency: "INR",
                mode: "NEFT",
                purpose: "payout",
                fund_account: {
                    account_type: "bank_account",
                    bank_account: {
                        name: bankDetails?.accountHolderName,
                        ifsc: bankDetails?.IFSC,
                        account_number: bankDetails?.accountNumber,
                        bankName: bankDetails?.bankName
                    },
                    contact: {
                        name: centerInfo?.user?.name,
                        email: centerInfo?.user?.email,
                        contact: centerInfo?.user?.contact,
                        type: "employee",
                        reference_id: centerInfo?.user?._id,
                        notes: {
                            notes_key_1: "Tea, Earl Grey, Hot",
                            notes_key_2: "Tea, Earl Grey… decaf.",
                        },
                    },
                },
                queue_if_low_balance: true,
                reference_id: "Acme Transaction ID 12345",
                narration: "Acme Corp Fund Transfer",
                notes: {
                    notes_key_1: "Beam me up Scotty",
                    notes_key_2: "Engage",
                },
            };

            let response = await http_request.post(`/serviceCenterDuePayment`, serviceCenterPayInfo);
            let { data } = response;
            setIsModalOpen(false);
            RefreshData(data);

        } catch (err) {
            console.error(err);
        }
    };

    const onSubmit = (data) => {
        if (bankDetails) {
            handleDuePayment(data);
        } else {
            Alert.alert("Error", "Please add bank details");
        }
    };
    console.log(data);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={styles.content}>
                    {value?.user?.role === "ADMIN" ? null : (
                        <View style={styles.walletContainer}>
                            {wallet ? (
                                <>
                                    <View style={styles.walletInfo}>
                                        <Text style={styles.walletTitle}>Wallet</Text>
                                        <View style={styles.walletBalance}>
                                            <Text style={styles.walletLabel}>Wallet Balance</Text>
                                            <Text style={styles.walletAmount}>{wallet?.dueAmount}</Text>
                                        </View>
                                        <View style={styles.walletBalance}>
                                            <Text style={styles.walletLabel}>Total Commissions</Text>
                                            <Text style={styles.walletAmount}>{wallet?.totalCommission}</Text>
                                        </View>
                                        <Button title="Withdrawal" onPress={() => { setIsModalOpen(true); setAmount(wallet?.dueAmount); }} />
                                    </View>
                                    <Text style={styles.title}>Bank Transactions List</Text>
                                    <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
                                        <View>
                                            <View style={styles.header}>
                                                <Text style={[styles.headerCell, { width: 60 }]}>Sr. No.</Text>
                                                <Text style={[styles.headerCell, { width: 120 }]}>  Withdrawal Amount </Text>
                                                <Text style={[styles.headerCell, { width: 120 }]}>Status </Text>
                                                <Text style={[styles.headerCell, { width: 120 }]}>Date </Text>
                                                {/* <Text style={[styles.headerCell, { textAlign: "center", paddingRight: 20 }]}>Status</Text> */}
                                                 

                                            </View>
                                            <FlatList
                                        data={data}
                                        keyExtractor={(item) => item._id}
                                        renderItem={({ item, index }) => (
                                            <View  style={styles.row}>
                                                <Text>{index + 1}</Text>
                                                <Text>{item.userName}</Text>
                                                <Text>{item.paidAmount}  INR. </Text>
                                                <Text>{item.status}  </Text>
                                                <Text>{new Date(item.createdAt).toLocaleString()}</Text>
                                            </View>
                                        )}
                                    />
                                        </View>
                                    </ScrollView>
                                   
                                </>
                            ) : (
                                <Button title="Activate Wallet" onPress={handleWallet} />
                            )}
                        </View>
                    )}

                    <Modal
                        visible={isModalOpen}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setIsModalOpen(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Add Amount</Text>
                                <Controller
                                    control={control}
                                    name="amount"
                                    rules={{ required: 'Amount is required' }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            placeholder="Amount"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    )}
                                />
                                {errors.amount && <Text style={styles.errorText}>{errors.amount.message}</Text>}
                                <View style={styles.modalButtons}>
                                    <Button title="Cancel" onPress={() => setIsModalOpen(false)} />
                                    <Button title="Withdrawal Amount" onPress={handleSubmit(onSubmit)} />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    content: {
        flex: 1,
    },
    walletContainer: {
        marginBottom: 16,
    },
    walletInfo: {
        backgroundColor: '#e0f7fa',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    walletTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    walletBalance: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    walletLabel: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    walletAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00796b',
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
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    transactionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginBottom: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default TransactionList;
