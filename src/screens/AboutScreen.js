// src/screens/AboutScreen.js
import React from 'react';
import {
  View,
  Linking,
  Text,
  ImageBackground,
  ScrollView,
} from 'react-native';
import i18n from '../i18n';
import customStyles from '../Styles';

export default function AboutScreen() {
  return (
    <View style={customStyles.container}>
      <ImageBackground
        source={require('../../assets/btc-wallpaper.jpg')}
        style={customStyles.imageBG}>
        <ScrollView>
          <View style={customStyles.formArea}>
            <Text style={customStyles.about.title}>{i18n.t('about')}</Text>
            <Text style={customStyles.about.text}>
              {i18n.t('developedBy')}:{'\n\n'}
              Fábio Berbert de Paula{' '}
              {'<'}fberbert@gmail.com{'>\n\n'}
            </Text>
            <Text style={customStyles.about.text}>{i18n.t('aboutTecnology')}</Text>
            <Text
              style={[customStyles.about.text, {color: '#3a3'}]}
              onPress={() =>
                Linking.openURL('https://github.com/fberbert/bitcoinManager')
              }>
              https://github.com/fberbert/bitcoinManager
            </Text>
            <Text style={customStyles.about.text}>
              {'\n'}
              {i18n.t('aboutSource')}:{'\n\n'}- Kucoin
              {'\n'}- Mercado Bitcoin{'\n\n\n'}
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
