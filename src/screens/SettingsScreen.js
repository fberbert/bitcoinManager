import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableHighlight,
  ActivityIndicator,
  Switch,
} from 'react-native';
import IconB from 'react-native-vector-icons/FontAwesome';
import i18n from '../i18n';
import customStyles from '../Styles';

export default function SettingsScreen({navigation}) {
  // If true => TradingView is currently "disabled"
  const [isDisabled, setIsDisabled] = useState(false);

  // Indicates if we’re currently saving
  const [isSaving, setIsSaving] = useState(false);

  // Displays API messages
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // We’re using POST based on your code
        const response = await fetch(
          'https://api.automatizando.dev/api/bybit/get-disable-trading-view',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();

        // data.switch can be 'enabled' or 'disabled'
        if (data.switch === 'disabled') {
          setIsDisabled(true);
        } else {
          setIsDisabled(false);
        }
      } catch (error) {
        console.warn('Error fetching TradingView status:', error);
      }
    };

    fetchStatus();
  }, []);

  const toggleSwitch = () => {
    // Flip the boolean
    setIsDisabled(prev => !prev);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setApiMessage('');

    try {
      // If isDisabled is true => we’re sending 'disabled'
      // If isDisabled is false => we’re sending 'enabled'
      const isEnable = isDisabled ? 'disabled' : 'enabled';

      const response = await fetch(
        'https://api.automatizando.dev/api/bybit/switch-trading-view',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isEnable }), // The key must match your Node code
        }
      );

      // Must parse the JSON body
      const data = await response.json();

      // data might be { switch: 'enabled'/'disabled' }
      // or you can store a data.message if you prefer
      if (data.switch) {
        setApiMessage(`TradingView is now ${data.switch}`);
      } else {
        setApiMessage('No message returned');
      }
    } catch (error) {
      console.warn('Error saving TradingView status:', error);
      setApiMessage(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={customStyles.container}>
      <ImageBackground
        source={require('../../assets/btc-wallpaper.jpg')}
        style={customStyles.imageBG}
      >
        <ScrollView>
          <View style={customStyles.formArea}>
            {/* TradingView Row: Label | Switch */}
            <View style={customStyles.formRow}>
              <View style={customStyles.col}>
                <Text style={customStyles.colLabel}>
                  {i18n.t('tradingViewLabel') || 'TradingView'}
                </Text>
              </View>

              <View style={customStyles.col}>
                <Switch
                  trackColor={{ false: '#767577', true: '#355F2E' }}
                  thumbColor="#fff"
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={!isDisabled}
                />
              </View>
            </View>

            {/* SAVE BUTTON */}
            <View style={customStyles.btnArea}>
              <TouchableHighlight
                style={customStyles.btnCalculate}
                underlayColor="#888"
                onPress={handleSave}
                disabled={isSaving}
              >
                <Text style={customStyles.white}>
                  <IconB name="save" />{'  '}
                  {isSaving
                    ? i18n.t('btnSaving') || 'Saving...'
                    : i18n.t('btnSave') || 'Save'}
                </Text>
              </TouchableHighlight>
            </View>

            {/* LOADING INDICATOR */}
            {isSaving && (
              <View style={{alignItems: 'center', marginVertical: 20}}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={{color: '#fff', marginTop: 10}}>
                  {i18n.t('btnSaving') || 'Saving...'}
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
