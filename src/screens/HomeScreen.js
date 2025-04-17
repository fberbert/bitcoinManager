// src/screens/HomeScreen.js
import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  TouchableHighlight,
  ImageBackground,
  TextInput,
  ScrollView,
  Text,
} from 'react-native';
import IconB from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import customStyles from '../Styles';
import {PriceContext} from '../AppNavigator';

export default function HomeScreen({navigation}) {
  const {btcUsdPrice, btcBrlPrice, usdRate} = useContext(PriceContext);

  // State variables for inputs
  const [inputUSD, setInputUSD] = useState('');
  const [inputBRL, setInputBRL] = useState('');
  const [inputBTC, setInputBTC] = useState('');

  // State to store the background color of the display area
  const [displayAreaBg, setDisplayAreaBg] = useState('#444');

  // To track which input was last edited: USD, BRL, or BTC
  const [lastInputChanged, setLastInputChanged] = useState(null);

  // Store the BTC-USD price from one minute ago for comparison
  const price1MinAgo = useRef(0);

  // Store the timestamp of the last update
  const lastUpdate = useRef(Date.now());

  // Effect 1: runs when component mounts and updates background color based on price changes every minute
  useEffect(() => {
    const updateBg = () => {
      if (btcUsdPrice > price1MinAgo.current) {
        // Compare current price with the price from one minute ago
        setDisplayAreaBg('#355F2E'); // verde
      } else if (btcUsdPrice < price1MinAgo.current) {
        setDisplayAreaBg('#8D0B41'); // vermelho
      } else {
        setDisplayAreaBg('#444'); // mesma cor (não houve mudança)
      }
        // Update price1MinAgo for the next comparison
      if (btcUsdPrice !== 0) price1MinAgo.current = btcUsdPrice;
    };

    const now = Date.now();
    const diff = now - lastUpdate;
    // 5 minutes
    if (diff > 300000 || price1MinAgo.current === 0) {
      updateBg();
      lastUpdate.current = now;
    }
  }, [btcUsdPrice]);

  // Effect 2: track which input field (USD, BRL, or BTC) was last changed
  // (Used in calculate() to determine conversion logic)
  const handleChangeUSD = text => {
    setInputUSD(text);
    setLastInputChanged('USD');
  };

  const handleChangeBRL = text => {
    setInputBRL(text);
    setLastInputChanged('BRL');
  };

  const handleChangeBTC = text => {
    setInputBTC(text);
    setLastInputChanged('BTC');
  };

  // 3) Format a number as a currency string
  function formatCurrency(value, currency) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(value);
  }

  // 4) On blur, automatically format USD or BRL inputs
  const handleBlurUSD = () => {
    // Do nothing if input is empty
    if (!inputUSD.trim()) return;
    // Extrair número antes de formatar
    const parsed = parseNumeric(inputUSD);
    calculate();
    setInputUSD(formatCurrency(parsed, 'USD').replace('US$', 'US$ '));
  };

  const handleBlurBRL = () => {
    // Do nothing if input is empty
    if (!inputBRL.trim()) return;
    const parsed = parseNumeric(inputBRL);
    calculate();
    setInputBRL(formatCurrency(parsed, 'BRL').replace('R$', 'R$ '));
  };

  // For BTC we typically avoid currency symbol; display with 8 decimal places
  const handleBlurBTC = () => {
    // Do nothing if input is empty
    if (!inputBTC.trim()) return;
    const parsed = parseNumeric(inputBTC);
    calculate();
    setInputBTC(parsed.toFixed(8));
  };

  // 5) Extract a numeric value from a formatted string (e.g., "US$ 23.45" -> 23.45)
  function parseNumeric(rawValue) {
    // Remove any character that is not digit, dot, comma, or minus
    const clean = rawValue.replace(/[^\d.,-]/g, '').replace(',', '.');
    return parseFloat(clean) || 0;
  }

  // 6) Lógica de Cálculo - baseada em qual foi o último campo alterado
  // Calculate conversion based on last changed input
  function calculate() {
    const nUSD = parseNumeric(inputUSD);
    const nBRL = parseNumeric(inputBRL);
    const nBTC = parseNumeric(inputBTC);

    let usd = 0;
    let brl = 0;
    let btc = 0;

    switch (lastInputChanged) {
      case 'USD':
        // calculate based on USD input
        btc = nUSD / btcUsdPrice;
        brl = btc * btcBrlPrice;
        usd = nUSD;
        break;
      case 'BRL':
        // calculate based on BRL input
        btc = nBRL / btcBrlPrice;
        usd = btc * btcUsdPrice;
        brl = nBRL;
        break;
      case 'BTC':
        // calculate based on BTC input
        usd = nBTC * btcUsdPrice;
        brl = nBTC * btcBrlPrice;
        btc = nBTC;
        break;
      default:
        // Caso não tenha lastInputChanged, ou todos vazios...
        return;
    }

    // Atualizamos estado com formatação
    setInputUSD(formatCurrency(usd, 'USD').replace('US$', 'US$ '));
    setInputBRL(formatCurrency(brl, 'BRL').replace('R$', 'R$ '));
    // BTC pode ser exibido com 8 casas decimais
    setInputBTC(btc.toFixed(8));

    // Synchronize state to storage
    syncState();
  }

  // Clear all input fields
  function clearInputs() {
    setInputUSD('');
    setInputBRL('');
    setInputBTC('');
    setLastInputChanged(null);
  }

  async function syncState() {
    try {
      const state = {
        cotacaoBTCUSD,
        cotacaoBTCBRL,
        inputUSD,
        inputBRL,
        inputBTC,
        usdRate,
      };
      await AsyncStorage.setItem('bcState', JSON.stringify(state));
    } catch (err) {
      console.warn('Erro ao salvar state:', err);
    }
  }

  return (
    <View style={customStyles.container}>
      <ImageBackground
        source={require('../../assets/btc-wallpaper.jpg')}
        style={customStyles.imageBG}>
        <ScrollView>
          {/* Display principal */}
          <View
            style={[
              customStyles.displayArea,
              {backgroundColor: displayAreaBg},
            ]}>
            <View style={customStyles.row}>
              <Text style={[customStyles.bigText, customStyles.white]}>
                <IconB name="bitcoin" size={50} solid /> ={' '}
              </Text>

              <View style={{marginLeft: 10}}>
                {/* BTC em USD */}
  <Text style={customStyles.displayText}>
                  {formatCurrency(btcUsdPrice, 'USD').replace('US$', 'US$ ')}{' '}
                </Text>
                {/* BTC em BRL */}
                <Text style={customStyles.displayText}>
                  {formatCurrency(btcBrlPrice, 'BRL').replace('R$', 'R$ ')}{' '}
                </Text>
              </View>
            </View>
          </View>

          {/* Formulário */}
          <View style={customStyles.formArea}>
            {/* USD */}
            <Text style={{color: '#fff', marginBottom: 5}}>
              {i18n.t('dollar')}
            </Text>
            <TextInput
              placeholder={i18n.t('dollar')}
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              style={customStyles.input}
              value={inputUSD}
              onChangeText={handleChangeUSD}
              onBlur={handleBlurUSD}
            />

            {/* BRL */}
            <Text style={{color: '#fff', marginBottom: 5, marginTop: 10}}>
              {i18n.t('real')}
            </Text>
            <TextInput
              placeholder={i18n.t('real')}
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              style={customStyles.input}
              value={inputBRL}
              onChangeText={handleChangeBRL}
              onBlur={handleBlurBRL}
            />

            {/* BTC */}
            <Text style={{color: '#fff', marginBottom: 5, marginTop: 10}}>
              {i18n.t('bitcoin')}
            </Text>
            <TextInput
              placeholder={i18n.t('bitcoin')}
              placeholderTextColor="#ccc"
              keyboardType="numeric"
              style={customStyles.input}
              value={inputBTC}
              onChangeText={handleChangeBTC}
              onBlur={handleBlurBTC}
            />

            <View style={customStyles.btnArea}>
              <TouchableHighlight
                style={customStyles.btnCalculate}
                underlayColor="#888"
                onPress={calculate}>
                <Text style={customStyles.white}>
                  <IconB name="calculator" />
                  {'  '}
                  {i18n.t('btnCalculate')}
                </Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={customStyles.btnCalculate}
                underlayColor="#888"
                onPress={clearInputs}>
                <Text style={customStyles.white}>
                  <IconB name="eraser" />
                  {'  '}
                  {i18n.t('btnClear')}
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
