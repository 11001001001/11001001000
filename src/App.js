import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import HomePage from './pages/Candle/Candle';
import FriendsPage from './pages/FriendsPage/FriendsPage';
import LeaderPage from './pages/LeaderPage/LeaderPage';

function App() {
  const [balance, setBalance] = useState(0);
  const [registered, setRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки


  function decodePromoCode(promoCode) {
    let decoded = '';
    
    for (let i = 0; i < promoCode?.length; i++) {
      const charCode = promoCode.charCodeAt(i);
      decoded += (charCode - 65).toString();  // Вычитаем 23 и преобразуем в цифру
    }
    
    return decoded;
  }

  // Fetch data from cloudStorage (balance, registration status)
  useEffect(() => {
    const getInitialData = () => {
      window.Telegram.WebApp.CloudStorage.getItems(['balanceC', 'registered2'], (error, result) => {
        if (error) {
          console.error('Failed to get initial data from cloud storage:', error);
        } else {
          const initialBalance = result.balanceC ? parseInt(result.balanceC, 10) : 0;
          const registeredCheck = result.registered2 ? result.registered2 === 'true' : false;
          setBalance(initialBalance);
          setRegistered(registeredCheck);
        }
      });
    };
    getInitialData();
  }, []);

  // Register user if not registered
  useEffect(() => {
    const checkAndRegisterUser = async () => {
      if (registered) {
        // User is already registered, update the balance
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (user) {
          const { id: user_id } = user;
          try {
            const response = await fetch(`https://bye-b7c975e7a8fb.herokuapp.com/api/update-balance/${user_id}/`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ balance })
            });

            if (response.ok) {
              console.log('Balance updated successfully');
              setIsLoading(false)
            } else {
              console.error('Error updating balance:', await response.json());
            }
          } catch (error) {
            console.error('Request failed:', error);
          }
        }
      } else {
        // Register the user
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        const promoCode = window.Telegram.WebApp.initDataUnsafe.start_param;
        console.log('Promo code received:', promoCode);

        if (user) {
          const { username, first_name, last_name, id: user_id } = user;
          const name = first_name || last_name;


          const newUser = {
            username: username || '',
            name: name || '',
            user_id: String(user_id),
            balance: "0",
            photo_url: '',
            promo_code: decodePromoCode(promoCode) || ''
          };

          console.log("Data being sent to the server:", newUser);

          try {
            const response = await fetch('https://bye-b7c975e7a8fb.herokuapp.com/api/create-user/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newUser),
            });

            if (response.ok) {
              // Save to cloudStorage instead of localStorage
              window.Telegram.WebApp.CloudStorage.setItem('registered2', 'true', (error) => {
                if (error) {
                  console.error('Failed to update balance in cloud storage:', error);
                }
              });
              setIsLoading(false)

              console.log('User registered and stored in cloudStorage');
            } else {
              console.error('Error during registration:', await response.json());
            }
          } catch (error) {
            console.error('Request failed:', error);
          }
        }
      }
    };

    checkAndRegisterUser();
  }, [registered, balance]);

  const triggerHapticFeedback = () => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
    } else if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  window.Telegram.WebApp.expand();

  return (
    <>
    {isLoading ?
    ( <div className='spinner-container' style={{height:'100vh'}}>
      <div className="spinner">
        <img src="https://i.ibb.co/GnPQ1jd/IMG-2102.png" alt="loading" className="spinner-image" />
      </div>
    </div>)
    :
    (<Router basename="/11001001000">
      <div className="app">
        <Routes >
          <Route path="/" element={<HomePage />} exact />
          <Route path="/friends" element={<FriendsPage />} exact />
          <Route path="/leaders" element={<LeaderPage />} exact />
        </Routes>
        <div className="fixed-buttons">
          <Link to="/" className="nav-link" onClick={triggerHapticFeedback}>
            <img src="https://img.icons8.com/?size=100&id=LiGfY7DuMBd4&format=png&color=FFFFFF" alt="Home" className="nav-icon" />
            <span>Mining</span>
          </Link>
          <Link to="/leaders" className="nav-link" onClick={triggerHapticFeedback}>
            <img src="https://img.icons8.com/?size=100&id=2I9Hz4gixhSZ&format=png&color=FFFFFF" alt="Page 1" className="nav-icon" />
            <span>Leaderboard</span>
          </Link>
          <Link to="/friends" className="nav-link" onClick={triggerHapticFeedback}>
            <img src="https://img.icons8.com/?size=100&id=dyY8SQ06ZX9R&format=png&color=FFFFFF" alt="Page 2" className="nav-icon" />
            <span>Friends</span>
          </Link>
        </div>
      </div>
    </Router>)}
    </>
  );
}

export default App;
