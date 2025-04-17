import React, {useState} from 'react';
import {
  View,
  TouchableHighlight,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  ActivityIndicator,   // <-- Import ActivityIndicator
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import IconB from 'react-native-vector-icons/FontAwesome';
import i18n from '../i18n';
import customStyles from '../Styles';

export default function OpenPositionScreen({navigation}) {
  // States for each field in the request body
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState('Buy');
  const [leverage, setLeverage] = useState('5');
  const [valueInUSD, setValueInUSD] = useState('10');
  const [manual, setManual] = useState('true');
  const [entryPrice, setEntryPrice] = useState('');
  const [hasStopLoss, setHasStopLoss] = useState('false');
  const [hasTakeProfit, setHasTakeProfit] = useState('false');
  const [contracts, setContracts] = useState('');

  // Loading indicator state
  const [isLoading, setIsLoading] = useState(false);

  // State to display the response message from the API
  const [apiMessage, setApiMessage] = useState('');

  // Function to handle sending the POST request
  const handleSend = async () => {
    setIsLoading(true); // Start loading
    setApiMessage('');  // Clear any previous message
    try {
      const payload = {
        symbol,
        side,
        leverage: Number(leverage),
        valueInUSD: Number(valueInUSD),
        manual: manual === 'true',
        entryPrice: entryPrice ? Number(entryPrice) : null,
        hasStopLoss: hasStopLoss === 'true',
        hasTakeProfit: hasTakeProfit === 'true',
        contracts: contracts ? Number(contracts) : null,
      };

      const response = await fetch(
        'https://api.automatizando.dev/api/bybit/place-order',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      setApiMessage(data.message || 'No message returned');
    } catch (error) {
      console.warn('Error sending order:', error);
      setApiMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleClear = () => {
    setSymbol('');
    setSide('Buy');
    setLeverage('');
    setValueInUSD('');
    setManual('true');
    setEntryPrice('');
    setHasStopLoss('false');
    setHasTakeProfit('false');
    setContracts('');
    setApiMessage('');
    setIsLoading(false);
  };

  return (
    <View style={customStyles.container}>
      <ImageBackground
        source={require('../../assets/btc-wallpaper.jpg')}
        style={customStyles.imageBG}
      >
        <ScrollView>
          <View style={customStyles.formArea}>
            {/* Row 1: Symbol | Side */}
            <View style={customStyles.formRow}>
              {/* Symbol */}
              <View style={customStyles.col}>
                <Text style={customStyles.colLabel}>
                  {i18n.t('symbol') || 'Symbol'}
                </Text>
                <TextInput
                  placeholder={i18n.t('symbol') || 'Symbol'}
                  placeholderTextColor="#ccc"
                  style={customStyles.input}
                  value={symbol}
                  onChangeText={setSymbol}
                />
              </View>

              {/* Side - Replaced with Picker */}
              <View style={customStyles.col}>
                <Text style={customStyles.colLabel}>
                  {i18n.t('side') || 'Side'}
                </Text>
                <Picker
                  selectedValue={side}
                  style={customStyles.picker}
                  onValueChange={(itemValue) => setSide(itemValue)}
                >
                  <Picker.Item label="Buy" value="Buy" />
                  <Picker.Item label="Sell" value="Sell" />
                </Picker>
              </View>
            </View>

            {/* Row 2: Leverage | Value in USD */}
            <View style={customStyles.formRow}>
              <View style={customStyles.col}>
                <Text style={customStyles.colLabel}>
                  {i18n.t('leverage') || 'Leverage'}
                </Text>
                <TextInput
                  placeholder={i18n.t('leverage') || 'Leverage'}
                  placeholderTextColor="#ccc"
                  keyboardType="numeric"
                  style={customStyles.input}
                  value={leverage}
                  onChangeText={setLeverage}
                />
              </View>

              <View style={customStyles.col}>
                <Text style={customStyles.colLabel}>
                  {i18n.t('valueInUSD') || 'Value in USD'}
                </Text>
                <TextInput
                  placeholder={i18n.t('valueInUSD') || 'Value in USD'}
                  placeholderTextColor="#ccc"
                  keyboardType="numeric"
                  style={customStyles.input}
                  value={valueInUSD}
                  onChangeText={setValueInUSD}
                />
              </View>
            </View>

            {/* Row 3: Has Stop Loss | Has Take Profit */}
            <View style={customStyles.formRow}>
              {/* Has Stop Loss */}
              <View style={customStyles.col}>
                <Text style={customStyles.colLabel}>
                  {i18n.t('hasStopLoss') || 'Has Stop Loss?'}
                </Text>
                <Picker
                  selectedValue={hasStopLoss}
                  style={customStyles.picker}
                  onValueChange={(itemValue) => setHasStopLoss(itemValue)}
                >
                  <Picker.Item label="true" value="true" />
                  <Picker.Item label="false" value="false" />
                </Picker>
              </View>

              {/* Has Take Profit */}
              <View style={customStyles.col}>
                <Text style={customStyles.colLabel}>
                  {i18n.t('hasTakeProfit') || 'Has Take Profit?'}
                </Text>
                <Picker
                  selectedValue={hasTakeProfit}
                  style={customStyles.picker}
                  onValueChange={(itemValue) => setHasTakeProfit(itemValue)}
                >
                  <Picker.Item label="true" value="true" />
                  <Picker.Item label="false" value="false" />
                </Picker>
              </View>
            </View>

            {/* Row 4: Entry Price | Contracts */}
            <View style={customStyles.formRow}>
              {/* Entry Price */}
              <View style={customStyles.col}>
                <Text style={customStyles.colLabel}>
                  {i18n.t('entryPrice') || 'Entry Price'}
                </Text>
                <TextInput
                  placeholder={i18n.t('entryPrice') || 'Entry Price (or empty)'}
                  placeholderTextColor="#ccc"
                  keyboardType="numeric"
                  style={customStyles.input}
                  value={entryPrice}
                  onChangeText={setEntryPrice}
                />
              </View>

              {/* Contracts */}
              <View style={customStyles.col}>
                <Text style={customStyles.colLabel}>
                  {i18n.t('contracts') || 'Contracts'}
                </Text>
                <TextInput
                  placeholder={i18n.t('contracts') || 'Contracts (or empty)'}
                  placeholderTextColor="#ccc"
                  keyboardType="numeric"
                  style={customStyles.input}
                  value={contracts}
                  onChangeText={setContracts}
                />
              </View>
            </View>

            {/* BUTTONS */}
            <View style={customStyles.btnArea}>
              <TouchableHighlight
                style={customStyles.btnCalculate}
                underlayColor="#888"
                onPress={handleSend}
                disabled={isLoading}  // Disable while loading
              >
                <Text style={customStyles.white}>
                  <IconB name="send" />{'  '}
                  {isLoading
                    ? i18n.t('btnSending') || 'Sending...'
                    : i18n.t('btnSend') || 'Send'
                  }
                </Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={customStyles.btnCalculate}
                underlayColor="#888"
                onPress={handleClear}
                disabled={isLoading} // You can also disable the Clear button if desired
              >
                <Text style={customStyles.white}>
                  <IconB name="eraser" />{'  '}
                  {i18n.t('btnClear') || 'Clear'}
                </Text>
              </TouchableHighlight>
            </View>

            {/* LOADING INDICATOR */}
            {isLoading && (
              <View style={{alignItems: 'center', marginVertical: 20}}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={{color: '#fff', marginTop: 10}}>
                  {i18n.t('sendingIndicator') || 'Enviando...'}
                </Text>
              </View>
            )}

            {/* API RESPONSE MESSAGE */}
            {apiMessage ? (
              <View style={{marginTop: 20}}>
                <Text style={{color: '#fff', fontSize: 16}}>
                  {i18n.t('response') || 'Response'}: {apiMessage}
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
