import React, {createContext, useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import AlertsScreen from './screens/AlertsScreen';
import SettingsScreen from './screens/SettingsScreen';
import AboutScreen from './screens/AboutScreen';
import BottomTabNavigator from './components/BottomTabNavigator';

import useKucoinTicker from './hooks/useKucoinTicker';
import useUsdRate from './hooks/useUsdRate';

const Stack = createStackNavigator();

// Global Context
export const PriceContext = createContext();

export default function AppNavigator() {
  // Hook that returns the BTC price (e.g., "XBTUSDTM", "BTC-USDT", depending on exact symbol)
  const btcUsdPrice = useKucoinTicker('XBTUSDTM');
  const usdRate = useUsdRate();

  const [btcBrlPrice, setBtcBrlPrice] = useState(0);



  useEffect(() => {
    // Example: manual Bitcoin price update
    // setBtcUsdPrice(price); // Update in USD
    setBtcBrlPrice(btcUsdPrice * usdRate); // Update in BRL
  }, [btcUsdPrice, usdRate]);

  return (
    <PriceContext.Provider value={{btcUsdPrice, btcBrlPrice, usdRate}}>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          screenOptions={{headerShown: false}}
        />
        <Stack.Screen
          name="Calculator"
          options={{headerShown: false}}
          component={HomeScreen}
        />


        <Stack.Screen
          name="Alerts"
          component={AlertsScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </PriceContext.Provider>
  );
}
