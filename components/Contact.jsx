import React from 'react';
import { View, Text,   StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';

const Contact = () => {
    return (
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.section}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Contact us</Text>
                    </View>
                    {/* Uncomment this section if you want to include the form */}
                    {/* <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput style={styles.input} placeholder="Name" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput style={styles.input} placeholder="Enter your email address" keyboardType="email-address" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Message</Text>
                            <TextInput style={styles.textarea} placeholder="Message" multiline />
                        </View>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Send</Text>
                        </TouchableOpacity>
                    </View> */}
                    <View style={styles.infoContainer}>
                        <View style={styles.infoCard}>
                            <View style={styles.iconContainer}>
                                {/* Replace with an appropriate icon */}
                                <Text>📞</Text>
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitle}>Technical support</Text>
                                <Text style={styles.infoText}> smehndi986@gmail.com</Text>
                                <Text style={styles.infoText}> +91 9565892772</Text>
                            </View>
                        </View>
                        <View style={styles.infoCard}>
                            <View style={styles.iconContainer}>
                                {/* Replace with an appropriate icon */}
                                <Text>💼</Text>
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitle}>Sales questions</Text>
                                <Text style={styles.infoText}> smehndi986@gmail.com</Text>
                                <Text style={styles.infoText}>+91 9219252400</Text>
                            </View>
                        </View>
                        <View style={styles.infoCard}>
                            <View style={styles.iconContainer}>
                                {/* Replace with an appropriate icon */}
                                <Text>📰</Text>
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitle}>Press</Text>
                                <Text style={styles.infoText}> smehndi986@gmail.com</Text>
                                <Text style={styles.infoText}>+91 9219252400</Text>
                            </View>
                        </View>
                        <View style={styles.infoCard}>
                            <View style={styles.iconContainer}>
                                {/* Replace with an appropriate icon */}
                                <Text>🐞</Text>
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitle}>Bug report</Text>
                                <Text style={styles.infoText}> smehndi986@gmail.com</Text>
                                <Text style={styles.infoText}>+91 9219252400</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
    
    );
};

const styles = StyleSheet.create({
    container: {
        // padding: 16,
        // paddingTop:"50%",
        paddingBottom: 32,
    },
    section: {
        marginBottom: 32,
       
     
    },
    header: {
        backgroundColor: Colors.PRIMARY,
        alignItems: 'center',
        marginBottom: 16,
       
        borderRadius:10
    },
    title: {
        fontSize: 24,
       padding:5,
        fontWeight: 'bold',
    },
    form: {
        
      paddingTop: 62,
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 12,
    },
    label: {
        marginBottom: 4,
        fontSize: 16,
        color: '#00796b',
    },
    input: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
    },
    textarea: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#26a69a',
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoContainer: {
        paddingTop:"50%",
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    infoCard: {
        width: '48%',
        marginBottom: 16,
        // flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#e0f2f1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoTextContainer: {
        marginLeft: 16,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoText: {
        color: '#757575',
    },
});

export default Contact;
