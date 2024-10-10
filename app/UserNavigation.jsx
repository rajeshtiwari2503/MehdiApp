import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import ServiceScreen from '../screens/ServiceScreen';
import ProductScreen from '../screens/ProductScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import SupportScreen from '../screens/SupportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Colors } from '@/constants/Colors';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

const Tab = createBottomTabNavigator();

const UserNavigator = () => (
 
  <Tab.Navigator
  initialRouteName='Products'
    screenOptions={{
      tabBarStyle: {
        backgroundColor: '#FFF', // Tab bar background color
        // borderTopWidth: 0,
        paddingBottom: 5, // Adjust bottom padding
        paddingTop: 5,    // Adjust top padding
        paddingLeft: 10,    // Adjust top padding
        paddingRight: 10,    // Adjust top padding
        // marginTop: 10,    // Adjust top padding
      },
      headerShown: false, // Hide header for all tabs
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: 'bold',
      },
      tabBarActiveTintColor: Colors.PRIMARY, // Active tab color
      tabBarInactiveTintColor: '#888888', // Inactive tab color
    }}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={DashboardScreen}
      options={{
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? Colors.PRIMARY : 'gray',  fontSize: 12 }}>
            Home
          </Text>
        ),
        tabBarIcon: ({ color }) => (
          <Entypo name="home" size={20} color={color} />
        ),
      }}
    />
    {/* <Tab.Screen 
      name="Products" 
      component={ProductScreen}
      options={{
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? Colors.PRIMARY : 'gray',  fontSize: 12 }}>
            Product
          </Text>
        ),
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="category" size={20} color={color} />
        ),
      }}
    />
     <Tab.Screen 
      name="Services" 
      component={ServiceScreen}
      options={{
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? Colors.PRIMARY : 'gray',  fontSize: 12 }}>
            Service
          </Text>
        ),
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="miscellaneous-services" size={20} color={color} />
        ),
      }}
    />
     <Tab.Screen 
      name="Feedback" 
      component={FeedbackScreen}
      options={{
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? Colors.PRIMARY : 'gray',  fontSize: 12 }}>
            Feedback
          </Text>
        ),
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="feedback" size={20} color={color} />
        ),
      }}
    />
   
     <Tab.Screen 
      name="Support" 
      component={SupportScreen}
      options={{
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? Colors.PRIMARY : 'gray',  fontSize: 12 }}>
            Support
          </Text>
        ),
        tabBarIcon: ({ color }) => (
          <AntDesign name="questioncircle" size={20} color={color} />
        ),
      }}
    /> */}
      <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        tabBarLabel: ({ focused }) => (
          <Text style={{ color: focused ? Colors.PRIMARY : 'gray',  fontSize: 12 }}>
            Profile
          </Text>
        ),
        tabBarIcon: ({ color }) => (
          <Ionicons name="person" size={20} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
 
);
 
export default UserNavigator;
