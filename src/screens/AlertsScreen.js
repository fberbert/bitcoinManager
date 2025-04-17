// src/screens/AlertsScreen.js
import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import IconB from 'react-native-vector-icons/FontAwesome';
import customStyles from '../Styles';

export default function AlertsScreen() {
  const [targetPrice, setTargetPrice] = useState('');

  function handleCreateAlert() {
    console.log(`Criando alerta para preço >= ${targetPrice}`);
    // Aqui poderia salvar no AsyncStorage, ou enviar para um backend, etc.
  }

  return (
    <View style={customStyles.container}>
      <ImageBackground
        source={require('../../assets/btc-wallpaper.jpg')}
        style={customStyles.imageBG}>
        <ScrollView>
          <View style={customStyles.formArea}>
            <Text style={customStyles.title}>Criar Alerta de Preço</Text>

            <TextInput
              style={customStyles.input}
              placeholder="Par de moedas"
              placeholderTextColor="#ccc"
            />

            <TextInput
              style={customStyles.input}
              keyboardType="numeric"
              placeholder="Valor do alvo"
              placeholderTextColor="#ccc"
              value={targetPrice}
              onChangeText={setTargetPrice}
            />

            <TouchableOpacity
              style={customStyles.btnAlert}
              onPress={handleCreateAlert}>
              <Text style={customStyles.white}>
                <IconB name="bell" />
                {'  '}
                Criar Alerta
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
