// src/hooks/useUsdRate.js
import { useState, useEffect, useRef } from 'react';

/**
 * Hook that fetches the USDT/BRL exchange rate from Binance every minute.
 * Returns the latest rate as a floating-point number.
 */
export default function useUsdRate() {
  const [usdRate, setUsdRate] = useState(0);
  const intervalRef = useRef(null);

  const fetchUsdRate = async () => {
    try {
      // Public Binance endpoint for the current price of a trading pair
      // Ensure that "USDTBRL" is available on Binance (may vary if the spot market exists).
      const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=USDTBRL');
      const data = await response.json();

      if (data && data.price) {
        // Exemplo: "2.5" => 2.5
        setUsdRate(parseFloat(data.price));
      } else {
        console.warn('Não foi possível obter a cotação USDTBRL da Binance.');
      }
    } catch (error) {
      console.error('Erro ao buscar cotação USDT/BRL:', error);
    }
  };

  useEffect(() => {
    // Buscamos imediatamente quando o Hook montar
    fetchUsdRate();

    // Depois, a cada 1 minuto (60.000 ms)
    intervalRef.current = setInterval(fetchUsdRate, 60_000);

    // Cleanup: ao desmontar, limpa o intervalo
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return usdRate;
}
