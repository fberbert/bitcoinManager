import React, {createContext, useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import OpenPositionScreen from './screens/OpenPositionScreen';
import AlertsScreen from './screens/AlertsScreen';
import SettingsScreen from './screens/SettingsScreen';
import AboutScreen from './screens/AboutScreen';
import BottomTabNavigator from './components/BottomTabNavigator';

import useKucoinTicker from './hooks/useKucoinTicker';
import useUsdRate from './hooks/useUsdRate';

const Stack = createStackNavigator();

// Context Global
export const PriceContext = createContext();

export default function AppNavigator() {
  // Hook que retorna o valor do BTC (ex.: "XBTUSDTM", "BTC-USDT", depende do símbolo exato)
  const cotacaoBTCUSD = useKucoinTicker('XBTUSDTM');
  const usdRate = useUsdRate();

  const [cotacaoBTCBRL, setCotacaoBTCBRL] = useState(0);



  useEffect(() => {
    // const price = 99500.0; // Exemplo de cotação manual do Bitcoin
    // setCotacaoBTCUSD(price); // Atualiza em USD
    setCotacaoBTCBRL(cotacaoBTCUSD * usdRate); // Atualiza em BRL
  }, [cotacaoBTCUSD, usdRate]);

  return (
    <PriceContext.Provider value={{cotacaoBTCUSD, cotacaoBTCBRL, usdRate}}>
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
          name="OpenPosition"
          component={OpenPositionScreen}
          options={{headerShown: false}}
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
