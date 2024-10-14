import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Импортируем axios для выполнения запросов
import './FriendsPage.css';
import refPic from '../../photo_2024-10-02 15.54.22.jpeg';

const FriendsPage = () => {
  window.Telegram.WebApp.setBackgroundColor('#000');
  window.Telegram.WebApp.setHeaderColor('#000');
  const userId = window.Telegram.WebApp.initDataUnsafe.user.id; 
  const picture = 'https://freesvg.org/img/abstract-user-flat-4.png';  // Placeholder image

  const [totalReferrals, setTotalReferrals] = useState(0);  // Состояние для хранения общего числа рефералов
  const [totalBalance, setTotalBalance] = useState(0);  // Состояние для хранения суммы всех балансов рефералов
  const [photoUrls, setPhotoUrls] = useState([]);  
  
  
  
  // Функция для триггера тактильной отдачи
  const triggerHapticFeedbackSuccess = () => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
    } else if (navigator.vibrate) {
      navigator.vibrate(50); 
    }
  };

  function encodeUserId(userId) {
    const userIdString = userId.toString();  // Преобразуем userId в строку
    let encoded = '';
    
    for (let i = 0; i < userIdString.length; i++) {
      const digit = parseInt(userIdString[i]);
      encoded += String.fromCharCode(digit + 65);  // Добавляем 23 и преобразуем в символ
    }
    
    return encoded;
  }
  

  // Функция для открытия ссылки на телеграм с сообщением
  const shareMessage = () => {
    const promoCode = encodeUserId(userId);
    triggerHapticFeedbackSuccess();
    const text = encodeURIComponent(`${promoCode}`);
    const url = encodeURIComponent(`https://t.me/TapDuckRobot/play?startapp=${promoCode}`);
    const telegramShareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
    window.open(telegramShareUrl, '_blank');
  };

  // Используем useEffect для выполнения запроса при монтировании компонента
  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        // Запрос к вашему API по userId (замените на динамический userId если нужно)
        const response = await axios.get(`https://bye-b7c975e7a8fb.herokuapp.com/api/total-referrals/${userId}/3/`);
        
        // Данные получены успешно
        const data = response.data;
        setTotalReferrals(data.total_referral_count);  // Устанавливаем количество рефералов

        const photoUrlsArray = data.referrals.map(referral => referral.photo_url || picture);  // Если нет ссылки, ставим placeholder
        setPhotoUrls(photoUrlsArray);  
        
        // Рассчитываем общую сумму балансов всех рефералов
        const totalBalanceSum = data.referrals.reduce((sum, referral) => sum + parseInt(referral.balance), 0);
        setTotalBalance(totalBalanceSum);  // Устанавливаем общую сумму балансов

      } catch (error) {
        console.error("Error fetching referral data:", error);
      }
    };

    fetchReferrals();  // Вызываем функцию получения данных при загрузке компонента
  }, []);  // Пустой массив зависимостей, чтобы запрос выполнялся только один раз при монтировании

  const renderReferralImages = () => {
    if (totalReferrals === 0) return null;  // Если нет рефералов, ничего не выводим
  
    const maxImages = 6;  // Максимум картинок для отображения
    const imagesToShow = Math.min(totalReferrals, maxImages);
    const remainingReferrals = totalReferrals - maxImages;
    const baseSize = 45;  // Начальный размер первой картинки (в пикселях)
    const scaleFactor = 0.93;  // Каждая картинка будет уменьшаться на 7% (1 - 0.07)
  
    return (
      <div className="referral-images-container">
        {photoUrls.slice(0, imagesToShow).map((url, index) => {
          const offset = (index - Math.floor(imagesToShow / 2)) * 20; // Смещение от центра
          const size = baseSize * Math.pow(scaleFactor, index);  // Уменьшение на 7% для каждой следующей картинки
          return (
            <img
              key={index}
              src={url}
              alt={`Referral ${index + 1}`}
              className="referral-image"
              style={{
                zIndex: imagesToShow - index,  // Чтобы картинки накладывались правильно
                transform: `translateX(${offset}px)`,  // Смещение от центра
                width: `${size}px`,  // Динамическое изменение ширины
                height: `${size}px`,  // Динамическое изменение высоты
              }}
            />
          );
        })}
        {remainingReferrals > 0 && (
          <div className="remaining-referrals-text">
            +{remainingReferrals}
          </div>
        )}
      </div>
    );
  };
  

  return (
    <div className="friends-page">
      <div className="referrals-section">
        {renderReferralImages()}  {/* Выводим фотографии рефералов */}
      </div>

      <div className='ftoken'>
        FT {Math.floor(totalBalance * 0.025).toLocaleString()}  {/* Показываем сумму балансов всех рефералов */}
      </div>

      <h1 className="header-title">How it works</h1>
      <img 
        src={refPic} 
        alt="picOfRef" 
        className="node-tree-image"
      />
      <div className='description-container' style={{width: '100%'}}>
        <hr class="hr-text" />
      </div>

      <div style={{width: '90%',  display: 'flex', flexDirection: 'row', justifyContent: "space-between", fontSize:"24px", fontWeight:'bold', color:'white', textAlign: 'left'}}>
        <div>Surface</div>
        <div>Depth</div>
      </div>
      <div className="description-container" style={{display: 'flex', flexDirection: 'row'}}>
        <p className="description-text">When you invite a friend you'll earn 2.5% of the coins they collect.</p>
        <p className="description-text" style={{textAlign: 'right'}}>You'll also get 2.5% from the friends your friend invites.</p>
      </div>

      <div style={{width: '90%',  display: 'flex', justifyContent: "center", fontSize:"24px", fontWeight:'bold', color:'white', textAlign: 'left'}}>
        Abyss
      </div>
      <div className="description-container" style={{justifyContent: 'center', alignItems: 'center', width: '50%'}}>
        <p className="description-text" style={{textAlign: 'center', width: '100%'}}>Finally you'll receive 2.5% from the friends your friend's friends invite. Isn't that awesome?)</p>
      </div>
      <div className='description-container' style={{width: '100%'}}>
        <hr class="hr-text" />
      </div>

      <div style={{width: '95%',  display: 'flex', justifyContent: "center", fontSize:"36px", fontWeight:'bold', color:'white', textAlign: 'left', marginTop: '40px'}}>
        FToken
      </div>
      <div className="description-container" style={{justifyContent: 'center', alignItems: 'center', width: '80%'}}>
        <p className="description-text" style={{textAlign: 'center', width: '100%', fontSize: '10px'}}>FToken is a token that will be converted into (coin name) during the counting phase.</p>
      </div>
      <div className="invite-container">
        <button className="invite-button" onClick={shareMessage}>Invite</button>
      </div>
    </div>
  );
}

export default FriendsPage;
