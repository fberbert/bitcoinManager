// hooks/useKucoinTicker.js
import { useState, useEffect, useRef } from 'react';

/**
 * Hook para criar e gerenciar a conexão WebSocket com o ticker do KuCoin.
 * Tenta se reconectar automaticamente se a conexão cair.
 *
 * @param {string} symbol - símbolo do par no formato KuCoin (ex: 'BTC-USDT' ou 'XBTUSDTM').
 */
const useKucoinTicker = (symbol) => {
  const [price, setPrice] = useState(0);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    /**
     * Fecha e limpa a conexão atual, se houver.
     */
    const cleanupConnection = () => {
      if (wsRef.current) {
        // Envia mensagem de unsubscribe antes de fechar
        const unsubscribeMessage = {
          id: Date.now(),
          type: 'unsubscribe',
          topic: `/contractMarket/ticker:${symbol}`,
          privateChannel: false,
          response: true,
        };
        try {
          wsRef.current.send(JSON.stringify(unsubscribeMessage));
        } catch (err) {
          console.warn('Erro ao tentar desinscrever do ticker:', err);
        }
        wsRef.current.close();
        wsRef.current = null;
      }
      // Se houver algum timeout de reconexão pendente, limpa
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    /**
     * Função principal para buscar token e conectar ao WebSocket.
     */
    const fetchWsToken = async () => {
      try {
        // 1. Obter token WebSocket público
        const response = await fetch('https://api.kucoin.com/api/v1/bullet-public', {
          method: 'POST',
        });
        const data = await response.json();

        if (!data.data) {
          console.warn('Não foi possível obter o token do WebSocket.');
          return;
        }

        const { token, instanceServers } = data.data;
        if (!instanceServers || instanceServers.length === 0) {
          console.warn('Nenhum servidor WebSocket disponível.');
          return;
        }

        // 2. Normalmente utiliza-se o primeiro servidor retornado
        const { endpoint } = instanceServers[0];
        const wsUrl = `${endpoint}?token=${token}`;

        // 3. Cria conexão WebSocket nativa (React Native)
        const client = new WebSocket(wsUrl);
        wsRef.current = client;

        client.onopen = () => {
          console.log('WebSocket conectado.');

          // 4. Mensagem de inscrição no ticker
          const subscribeMessage = {
            id: Date.now(),
            type: 'subscribe',
            topic: `/contractMarket/ticker:${symbol}`,
            privateChannel: false,
            response: true,
          };
          client.send(JSON.stringify(subscribeMessage));
        };

        client.onmessage = (event) => {
          try {
            const parsedData = JSON.parse(event.data);

            // 5. Verifica se a mensagem é do ticker esperado
            if (parsedData.topic === `/contractMarket/ticker:${symbol}`) {
              const newPrice = parseFloat(parsedData.data.price);
              if (isMounted) {
                setPrice(newPrice);
              }
            }
          } catch (err) {
            console.error('Erro ao processar mensagem:', err);
          }
        };

        client.onerror = (err) => {
          console.log('Erro no WebSocket:', err);
        };

        client.onclose = () => {
          console.log('WebSocket desconectado.');

          // Tentamos reconectar se ainda estivermos "montados"
          if (isMounted) {
            console.log('Tentando reconexão em 1 segundo...');
            reconnectTimeoutRef.current = setTimeout(() => {
              // Certifica-se de que ainda estamos montados
              if (isMounted) {
                fetchWsToken();
              }
            }, 1000);
          }
        };
      } catch (error) {
        console.error('Erro ao obter token do WebSocket:', error);
      }
    };

    // Inicia a conexão
    fetchWsToken();

    /**
     * Cleanup ao desmontar
     */
    return () => {
      isMounted = false;
      cleanupConnection();
    };
  }, [symbol]);

  return price;
};

export default useKucoinTicker;

