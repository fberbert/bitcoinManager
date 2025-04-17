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
  const {cotacaoBTCUSD, cotacaoBTCBRL, usdRate} = useContext(PriceContext);

  // Estados para inputs
  const [inputUSD, setInputUSD] = useState('');
  const [inputBRL, setInputBRL] = useState('');
  const [inputBTC, setInputBTC] = useState('');

  // Estado para armazenar a cor do container
  const [displayAreaBg, setDisplayAreaBg] = useState('#444');

  // Para sabermos se o input foi USD, BRL ou BTC (último editado)
  const [lastInputChanged, setLastInputChanged] = useState(null);

  // Guardar o valor do BTCUSD de 1 minuto atrás para comparação
  const price1MinAgo = useRef(0);

  // Guardar o timestamp da última atualização
  const lastUpdate = useRef(Date.now());

  // Efeito 1: Dispara a cada vez que a tela é montada, cria interval para comparar a cada 1 min
  useEffect(() => {
    const updateBg = () => {
      if (cotacaoBTCUSD > price1MinAgo.current) {
        // Compara a cotação atual com a de 1 minuto atrás
        setDisplayAreaBg('#355F2E'); // verde
      } else if (cotacaoBTCUSD < price1MinAgo.current) {
        setDisplayAreaBg('#8D0B41'); // vermelho
      } else {
        setDisplayAreaBg('#444'); // mesma cor (não houve mudança)
      }
      // Atualiza para a próxima comparação em 1 min
      if (cotacaoBTCUSD !== 0) price1MinAgo.current = cotacaoBTCUSD;
    };

    const now = Date.now();
    const diff = now - lastUpdate;
    // 5 minutos
    if (diff > 300000 || price1MinAgo.current === 0) {
      updateBg();
      lastUpdate.current = now;
    }
  }, [cotacaoBTCUSD]);

  // Efeito 2: Toda vez que o user muda alguma coisa em USD, BRL ou BTC, capturamos em lastInputChanged
  // (Isso para sabermos de qual campo fazer o cálculo no clique de "Calcular")
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

  // 3) Formatação de moeda
  function formatarMoeda(valor, moeda) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: moeda,
    }).format(valor);
  }

  // 4) Ao perder o foco, formata automaticamente caso seja USD ou BRL
  const handleBlurUSD = () => {
    // Se estiver vazio, não faz nada
    if (!inputUSD.trim()) return;
    // Extrair número antes de formatar
    const parsed = parseNumeric(inputUSD);
    calcular();
    setInputUSD(formatarMoeda(parsed, 'USD').replace('US$', 'US$ '));
  };

  const handleBlurBRL = () => {
    if (!inputBRL.trim()) return;
    const parsed = parseNumeric(inputBRL);
    calcular();
    setInputBRL(formatarMoeda(parsed, 'BRL').replace('R$', 'R$ '));
  };

  // BTC normalmente não formatamos com símbolo monetário, mas poderíamos exibir com 8 casas decimais, se quisermos
  const handleBlurBTC = () => {
    if (!inputBTC.trim()) return;
    const parsed = parseNumeric(inputBTC);
    calcular();
    setInputBTC(parsed.toFixed(8));
  };

  // 5) Função para extrair valor numérico de um campo que pode estar formatado
  //    ex: "US$ 23.45" -> 23.45
  function parseNumeric(valor) {
    // Remove qualquer caractere que não seja número, ponto ou vírgula
    const clean = valor.replace(/[^\d.,-]/g, '').replace(',', '.');
    return parseFloat(clean) || 0;
  }

  // 6) Lógica de Cálculo - baseada em qual foi o último campo alterado
  function calcular() {
    const nUSD = parseNumeric(inputUSD);
    const nBRL = parseNumeric(inputBRL);
    const nBTC = parseNumeric(inputBTC);

    let usd = 0;
    let brl = 0;
    let btc = 0;

    switch (lastInputChanged) {
      case 'USD':
        // cálculo a partir de USD
        btc = nUSD / cotacaoBTCUSD;
        brl = btc * cotacaoBTCBRL;
        usd = nUSD;
        break;
      case 'BRL':
        // cálculo a partir de BRL
        btc = nBRL / cotacaoBTCBRL;
        usd = btc * cotacaoBTCUSD;
        brl = nBRL;
        break;
      case 'BTC':
        // cálculo a partir de BTC
        usd = nBTC * cotacaoBTCUSD;
        brl = nBTC * cotacaoBTCBRL;
        btc = nBTC;
        break;
      default:
        // Caso não tenha lastInputChanged, ou todos vazios...
        return;
    }

    // Atualizamos estado com formatação
    setInputUSD(formatarMoeda(usd, 'USD').replace('US$', 'US$ '));
    setInputBRL(formatarMoeda(brl, 'BRL').replace('R$', 'R$ '));
    // BTC pode ser exibido com 8 casas decimais
    setInputBTC(btc.toFixed(8));

    // Sincroniza state
    syncState();
  }

  function limpar() {
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
                  {formatarMoeda(cotacaoBTCUSD, 'USD').replace('US$', 'US$ ')}{' '}
                </Text>
                {/* BTC em BRL */}
                <Text style={customStyles.displayText}>
                  {formatarMoeda(cotacaoBTCBRL, 'BRL').replace('R$', 'R$ ')}{' '}
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
                onPress={calcular}>
                <Text style={customStyles.white}>
                  <IconB name="calculator" />
                  {'  '}
                  {i18n.t('btnCalculate')}
                </Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={customStyles.btnCalculate}
                underlayColor="#888"
                onPress={limpar}>
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
