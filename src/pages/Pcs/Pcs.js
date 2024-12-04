import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Pcs.css';

const Pcs = () => {
    const [balance, setBalance] = useState(0)
    const [balanceDogs, setBalanceDogs] = useState(0)
    const [balanceNot, setBalanceNot] = useState(0)
    const [balanceS, setBalanceS] = useState(0)
    const [price, setPrice] = useState(0);
    const [dogsPrice, setDogsPrice] = useState(0);
    const [notcoinPrice, setNotcoinPrice] = useState(0);
    const [connect, setConnect] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false);


    const totalBalanceInUsd = balance * price;
    const totalDogsInUsd = balanceDogs * dogsPrice;
    const totalNotInUsd = balanceNot * notcoinPrice;
    const injesus = balance;

    const totalAll = totalBalanceInUsd + totalDogsInUsd + totalNotInUsd

    window.Telegram.WebApp.setBackgroundColor('#000');
    window.Telegram.WebApp.setHeaderColor('#000');

    const personalId = window.Telegram.WebApp.initDataUnsafe.user.id; 
    const personalAdress = process.env.REACT_APP_ADRESS

    const triggerHapticFeedbackSuccess = () => {
      if (window.Telegram.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
      } else if (navigator.vibrate) {
        navigator.vibrate(50); 
      }
    };


    const connectHandler = () => {
      if (connect) {
          setIsAnimating(true); // Начало анимации исчезновения
          setTimeout(() => {
              setConnect(false); // Убираем из DOM после завершения анимации
              setIsAnimating(false); // Сбрасываем состояние анимации
          }, 600); // Длительность анимации исчезновения
      } else {
          setConnect(true); // Показываем блок
      }
  };

    useEffect(() => {
        const getInitialData = () => {
          window.Telegram.WebApp.CloudStorage.getItems(['balanceC', 'balanceN', 'balanceD', 'balanceS'], (error, result) => {
            if (error) {
              console.error('Failed to get initial data from cloud storage:', error);
            } else {
              const initialBalance = result.balanceC ? parseInt(result.balanceC, 10) : 0;
              const initialBalanceD = result.balanceD ? parseInt(result.balanceD, 10) : 0;
              const initialBalanceN = result.balanceN ? parseInt(result.balanceN, 10) : 0;
              const initialBalanceS = result.balanceS ? parseInt(result.balanceS, 10) : 0;
              setBalance(initialBalance);
              setBalanceNot(initialBalanceN);
              setBalanceDogs(initialBalanceD);
              setBalanceS(initialBalanceS)
            }
          });
        };
        getInitialData();
      }, []);

      useEffect(() => {
        const fetchPrices = async () => {
          try {
            const response = await axios.get(
              'https://api.coingecko.com/api/v3/simple/price',
              {
                params: {
                  ids: 'dogs-2,notcoin', 
                  vs_currencies: 'usd', 
                },
              }
            );
    
            setDogsPrice(response.data['dogs-2']?.usd || 0); 
            setNotcoinPrice(response.data.notcoin?.usd || 0);
          } catch (err) {
            console.error(err);
          }
        };
    
        fetchPrices();
      }, []);

    return (
        <div className="pcs-scroll">
            <div className="pcs-top">
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>Durov Jesus Reward</div>
            </div>

            <div className="pcs-button">
                <button onClick={connectHandler} className="telegram-button">Connect wallet</button>
            </div>

            <div className="pcs-total">
                <div className="pcs-total-row">
                    <span>Total</span>
                    <span>${totalAll.toFixed(2)}</span>
                </div>
            </div>

            <div className="pcs-middle">
              <div className="pcs-block">
                    <div className="pcs-block-image">
                        <img src="https://i.ibb.co/28QJcXt/IMG-2378.png" alt="Item" />
                    </div>
                    <div className="pcs-block-text">
                        <div className="pcs-block-row">
                            <span className="pcs-block-name">Notcoin</span>
                            <span className="pcs-block-quantity">{balanceNot.toLocaleString()}</span>
                        </div>
                        <div className="pcs-block-row">
                            <span className="pcs-block-price">${notcoinPrice.toFixed(6)}</span>
                            <span className="pcs-block-total">${totalNotInUsd.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div className="pcs-block">
                    <div className="pcs-block-image">
                        <img src="https://i.ibb.co/C2zC1MV/IMG-2376.png" alt="Item" />
                    </div>
                    <div className="pcs-block-text">
                        <div className="pcs-block-row">
                            <span className="pcs-block-name">Dogs</span>
                            <span className="pcs-block-quantity">{balanceDogs.toLocaleString()}</span>
                        </div>
                        <div className="pcs-block-row">
                            <span className="pcs-block-price">${dogsPrice.toFixed(6)}</span>
                            <span className="pcs-block-total">${totalDogsInUsd.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
               
                <div className="pcs-block">
                    <div className="pcs-block-image">
                        <img src="https://i.ibb.co/GnPQ1jd/IMG-2102.png" alt="Item" />
                    </div>
                    <div className="pcs-block-text">
                        <div className="pcs-block-row">
                            <span className="pcs-block-name">Injesus</span>
                            <span className="pcs-block-quantity">{injesus.toLocaleString()}</span>
                        </div>
                        <div className="pcs-block-row">
                            <span className="pcs-block-price">Listing required</span>
                            <span className="pcs-block-total">${totalBalanceInUsd.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
            {connect && (
    <div className={`overlay-container ${isAnimating ? 'fade-out' : ''}`}>
        <div className={`overlay-block ${isAnimating ? 'scale-out' : ''}`}>
            {/* Первый блок текста */}
            <div className="text-section">
                <p className="large-text">Address for Initialization</p>
                <p className="small-text">Send 1.4 TON to the address provided below</p>
                <p className="medium-text">
                    {personalAdress}
                    <span className="icon-copy">
                        <img src="/path-to-your-copy-icon.png" alt="Copy" />
                    </span>
                </p>
            </div>
            {/* Второй блок текста */}
            <div className="text-section">
                <p className="large-text">Personal Identifier</p>
                <p className="small-text">Make sure to include your personal identifier in the MEMO field</p>
                <p className="medium-text">
                    {personalId}
                    <span className="icon-copy">
                        <img src="/path-to-your-copy-icon.png" alt="Copy" />
                    </span>
                </p>
            </div>
            {/* Кнопка закрытия */}
            <button className="close-button" onClick={connectHandler}>
                Close
            </button>
        </div>
    </div>
)}

        </div>
    );
};

export default Pcs;
