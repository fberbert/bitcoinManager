// ./screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Simular carregamento e depois cair direto no MainTabs
    setTimeout(() => {
      navigation.replace('Main');
    }, 2000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/btc-wallpaper.jpg')}
        resizeMode="stretch"
        style={styles.imageBG}
      >
        <View style={styles.overlay}>
          <Text style={styles.text}>Loading...</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  imageBG: { flex: 1, justifyContent: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontSize: 22 },
});

