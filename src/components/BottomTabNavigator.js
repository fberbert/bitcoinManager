// ./components/BottomTabNavigator.tsx
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import OpenPositionScreen from '../screens/OpenPositionScreen';
// import AlertsScreen from '../screens/AlertsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../Styles';
import i18n from '../i18n';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {

  return (
    <Tab.Navigator
      initialRouteName="Calculator"
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName = '';

          if (route.name === 'Calculator') {
            iconName = 'calculator';
          } else if (route.name === 'OpenPosition') {
            iconName = 'exchange';
          } else if (route.name === 'Alerts') {
            iconName = 'bell';
          } else if (route.name === 'About') {
            iconName = 'vcard-o';
          } else if (route.name === 'Settings') {
            iconName = 'cog';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        headerStyle: {
          backgroundColor: styles.stackHeader.backgroundColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {backgroundColor: '#181C14'},
        headerTitleAlign: 'center',
        headerLeft: () => null,
        headerRight: () => null,
      })}>

      <Tab.Screen
        name="Calculator"
        component={HomeScreen}
        options={{
          tarBarLabel: i18n.t('calculator'),
          headerTitle: i18n.t('calculatorSection'),
        }}
      />
      <Tab.Screen
        name="OpenPosition"
        component={OpenPositionScreen}
        options={{
          tarBarLabel: i18n.t('openPositionSection'),
          headerTitle: i18n.t('openPositionSection'),
        }}
      />
      {/*
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tarBarLabel: i18n.t('alerts'),
          headerTitle: i18n.t('alertsSection'),
        }}
      />
      */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tarBarLabel: i18n.t('settings'),
          headerTitle: i18n.t('settingsSection'),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tarBarLabel: i18n.t('about'),
          headerTitle: i18n.t('aboutSection'),
          // tabBarButton: () => null, // This hides the tab in the bottom bar
          // tabBarVisible: false, // This is optional, just to be explicit
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
