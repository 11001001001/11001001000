import React, { useState, useEffect } from 'react';
import '../../pages/Candle/Candle.css'

const BlockWithButtons = ({ value, reward, C, id, clickedButtons, setClickedButtons, text, earn, setBalance, oldBalance}) => {

  const [comp1, setComp1] = useState(false)
  const [comp2, setComp2] = useState(false)

  const triggerHapticFeedback = () => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
    } else if (navigator.vibrate) {
      navigator.vibrate(50); // Для Android устройств
    }
  };
  const triggerHapticFeedbackSucces = () => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    } else if (navigator.vibrate) {
      navigator.vibrate(50); // Для Android устройств
    }
  };

  // Функция для чтения из cloudStorage
  const loadClickedButtonsFromStorage = () => {
    window.Telegram.WebApp.CloudStorage.getItems(['clickedButtons'], (error, values) => {
      if (error) {
        console.error('Failed to get items from cloud storage:', error);
      } else {
        const storedData = values.clickedButtons ? JSON.parse(values.clickedButtons) : [];
        if (storedData) {
          return JSON.parse(storedData);
        }
      }
    });
    return [];
  };



  // Функция для сохранения в cloudStorage
  const saveClickedButtonsToStorage = (updatedClickedButtons) => {
    window.Telegram.WebApp.CloudStorage.setItem('clickedButtons', JSON.stringify(updatedClickedButtons), (error) => {
      if (error) {
        console.error('Failed to update reset time in cloud storage:', error);
      }
    });
  };
  const saveBalanceToStorage = (earn) => {
    const newBalance = oldBalance + earn
    window.Telegram.WebApp.CloudStorage.setItem('balanceC', Math.floor(newBalance).toString(), (error) => {
      if (error) {
        console.error('Failed to update reset time in cloud storage:', error);
      }
    });
  };

  // Загрузка данных из cloudStorage при монтировании
  useEffect(() => {
    const loadedClickedButtons = loadClickedButtonsFromStorage();
    setClickedButtons(loadedClickedButtons);
  }, []);

 


  // Обработчик нажатия кнопки
  const handleButtonClick = (id, earn) => {
    if (!comp1 && id == 28) {
      window.open('https://t.me/durov_jesus', '_blank');
      setComp1(true);
    } else if (!comp2 && id == 30){
      window.open('https://x.com/durov_jesus', '_blank');
      setComp2(true);
      
    }
    else {
      if(id <= 14) {
        if (!clickedButtons.includes(id) && oldBalance >= (earn * 10)) {
          const updatedClickedButtons = [...clickedButtons, id];
          setClickedButtons(updatedClickedButtons);
          saveClickedButtonsToStorage(updatedClickedButtons);
          saveBalanceToStorage(earn)
          setBalance((prev) => prev + earn)
          triggerHapticFeedbackSucces()
        } else if (!clickedButtons.includes(id)){
          triggerHapticFeedback()
        } 
      } else if (14 < id <= 27 ) {
        if (!clickedButtons.includes(id) && C) {
          const updatedClickedButtons = [...clickedButtons, id];
          setClickedButtons(updatedClickedButtons);
          saveClickedButtonsToStorage(updatedClickedButtons);
          saveBalanceToStorage(earn)
          setBalance((prev) => prev + earn)
          triggerHapticFeedbackSucces()
        } else if (!clickedButtons.includes(id)){
          triggerHapticFeedback()
        } 
      } else if (id > 27 ) {
        if (!clickedButtons.includes(id) && C) {
          const updatedClickedButtons = [...clickedButtons, id];
          setClickedButtons(updatedClickedButtons);
          saveClickedButtonsToStorage(updatedClickedButtons);
          saveBalanceToStorage(earn)
          setBalance((prev) => prev + earn)
          triggerHapticFeedbackSucces()
        } else if (!clickedButtons.includes(id)){
          triggerHapticFeedback()
  
        } 
      }
    }
    
    
  };

  return (
    <div className='middle-block' >
      <div className='middle-label'>{value} {text}</div>
      <div onClick={() => handleButtonClick(id, earn)} disabled={clickedButtons.includes(id)} className={`middle-content ${clickedButtons.includes(id) ? 'stored' : ''} ${!clickedButtons.includes(id) && C ? 'completed' : ''}`}>
        <img src='https://i.ibb.co/GnPQ1jd/IMG-2102.png' alt='Block Image' />
        <p>{reward}</p>
      </div>
    </div>
  );
};

export default BlockWithButtons;
