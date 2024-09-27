
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator,   TouchableOpacity } from 'react-native';
import http_request from "../http_request"
import ExportToExcel from '../components/DownloadExcel';
import DateTimePicker from '@react-native-community/datetimepicker';
import ReportServicesList from './ReportServices';

const DealerReport = ({ userData }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const response = await http_request.get('/getAllComplaint'); // Adjust base URL if needed
            setComplaints(response.data);
            const filterIdData = response.data.filter(item => item.dealerId === userData?._id);
            setFilteredComplaints(filterIdData); // Initialize filtered complaints with all complaints
        } catch (error) {
            console.error('Error fetching complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = complaints;

        // Filter by date range
        if (startDate && endDate) {
            filtered = filtered.filter(complaint => {
                const complaintDate = new Date(complaint.createdAt);
                return complaintDate >= new Date(startDate) && complaintDate <= new Date(endDate);
            });
            setFilteredData(filtered)
        }
       
        setFilteredComplaints(filtered);
    };

    const handleGenerateReport = () => {
        applyFilters();
    };

    const onChangeStartDate = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        // setShowStartDatePicker(Platform.OS === 'ios');
        setStartDate(currentDate);
    };

    const onChangeEndDate = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        // setShowEndDatePicker(Platform.OS === 'ios');
        setEndDate(currentDate);
    };
    const handleExportToExcel = () => {
        if (filteredComplaints.length > 0) {
            ExportToExcel(filteredComplaints, 'ComplaintsList');
        } else {
            Alert.alert('No Data', 'No complaints available to export');
        }
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Complaint Filter and Reports</Text>

            <View style={styles.datePickerContainer}>
                <View style={styles.datePickerWrapper}>
                    <Text>Start Date:</Text>
                    <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
                        <Text style={styles.dateButtonText}>{startDate ? startDate.toDateString() : 'Select start date'}</Text>
                    </TouchableOpacity>
                    {showStartDatePicker && (
                        <DateTimePicker
                            value={startDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={onChangeStartDate}
                        />
                    )}
                </View>

                <View style={styles.datePickerWrapper}>
                    <Text>End Date:</Text>
                    <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
                        <Text style={styles.dateButtonText}>{endDate ? endDate.toDateString() : 'Select end date'}</Text>
                    </TouchableOpacity>
                    {showEndDatePicker && (
                        <DateTimePicker
                            value={endDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={onChangeEndDate}
                            minimumDate={startDate}
                        />
                    )}
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title="Generate Report"
                    onPress={handleGenerateReport}
                    color="#4CAF50"
                />
                
            </View>

             
                    <ReportServicesList data={filteredData} />               
             
            
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
        marginTop:5,
        marginBottom:5,
        borderRadius:30
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    datePickerWrapper: {
        flex: 1,
        marginHorizontal: 8,
    },
    dateButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    dateButtonText: {
        fontSize: 16,
        color: '#000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    downloadContainer: {
        flex: 1,
    },
    complaintsContainer: {
        marginTop: 16,
    },
});

export default DealerReport;

