import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Импортируем axios для выполнения запросов
import './FriendsPage.css';

const FriendsPage = () => {
  window.Telegram.WebApp.setBackgroundColor('#000');
  window.Telegram.WebApp.setHeaderColor('#000');
  const userId = window.Telegram.WebApp.initDataUnsafe.user.id; 

  const [isLoading, setIsLoading] = useState(true); // ISLOADING
  const [balanceS, setBalanceS] = useState(false)
  const [balanceCheck, setBalanceCheck] = useState(1)
  const [balanceDogs, setBalanceDogs] = useState(0)
  const [balanceNot, setBalanceNot] = useState(0)
  const [balance, setBalance] = useState(0)
  const [success, setSuccess] = useState(false)
  const [buttonState, setButtonState] = useState('idle');
  const [loadingLetter, setLoadingLetter] = useState('3');

  const randomNum = Math.floor(Math.random() * (412910 - 113201 + 1)) + 113201;
  const randomNum2 = Math.floor(Math.random() * (4129 - 1132 + 1)) + 1132;
  const randomNum3 = Math.floor(Math.random() * (760911 - 313132 + 1)) + 313132;

  const injesus = randomNum3 + balance
  const notjesus = randomNum2 + balanceNot
  const dogjesus = randomNum + balanceDogs

  const handleButtonClick = () => {
    setButtonState('loading'); // Устанавливаем состояние "loading"
    setTimeout(() => {
        setButtonState('success'); // Через 4 секунды меняем на "success"
        triggerHapticFeedbackSuccess()
        setBalanceCheck(dogjesus)
        setSuccess(true)
        window.Telegram.WebApp.CloudStorage.setItem('balanceC', Math.floor(injesus).toString(), (error) => {
          if (error) {
            console.error('Failed to update balance in cloud storage:', error);
          }
        });
        window.Telegram.WebApp.CloudStorage.setItem('balanceN', Math.floor(notjesus).toString(), (error) => {
          if (error) {
            console.error('Failed to update balance in cloud storage:', error);
          }
        });
        window.Telegram.WebApp.CloudStorage.setItem('balanceD', Math.floor(dogjesus).toString(), (error) => {
          if (error) {
            console.error('Failed to update balance in cloud storage:', error);
          }
        });
        window.Telegram.WebApp.CloudStorage.setItem('balanceCheck2', Math.floor(dogjesus).toString(), (error) => {
          if (error) {
            console.error('Failed to update balance in cloud storage:', error);
          }
        });
    }, 6000);
};


useEffect(() => {
  let interval;
  if (buttonState === 'loading') {
      const letters = '298455555552984101013975922222220181236798767465555550187220218746588888888111111110505426254728';
      let index = 0;

      interval = setInterval(() => {
          setLoadingLetter(letters[index]);
          index = (index + 1) % letters.length; // Перезапуск после последней буквы
      }, 50);
  }

  return () => clearInterval(interval); // Очищаем интервал при размонтировании или завершении загрузки
}, [buttonState]);

useEffect(() => {
  const getInitialData = () => {
    window.Telegram.WebApp.CloudStorage.getItems(['balanceC', 'balanceN', 'balanceD', 'balanceS', 'balanceCheck2'], (error, result) => {
      if (error) {
        console.error('Failed to get initial data from cloud storage:', error);
      } else {
        const initialBalance = result.balanceC ? parseInt(result.balanceC, 10) : 0;
        const initialBalanceD = result.balanceD ? parseInt(result.balanceD, 10) : 0;
        const initialBalanceN = result.balanceN ? parseInt(result.balanceN, 10) : 0;
        const initialBalanceS = result.balanceS ? parseInt(result.balanceS, 10) : 0;
        const initialBalanceCheck = result.balanceCheck2 ? parseInt(result.balanceCheck2, 10) : 0;
        setBalance(initialBalance);
        setBalanceNot(initialBalanceN);
        setBalanceDogs(initialBalanceD);
        setBalanceS(initialBalanceS)
        setBalanceCheck(initialBalanceCheck)
        setIsLoading(false);
      }
    });
  };
  getInitialData();
}, []);
  
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
    const text = encodeURIComponent('');
    const url = encodeURIComponent(`http://t.me/DurovJesusBot/pray?startapp=${promoCode}`);
    const telegramShareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
    window.open(telegramShareUrl, '_blank');
  };


  

  return (
    <>
    {isLoading ? (
      <div className='spinner-container'>
        <div className="spinner">
          <img src="https://i.ibb.co/GnPQ1jd/IMG-2102.png" alt="loading" className="spinner-image" />
        </div>
      </div>
    ) : (

    <div className="friends-page">
      

      <h1 className="header-title">How it works</h1>
      <img 
        src='https://jesus3.s3.eu-north-1.amazonaws.com/8916311451451116511.jpeg' 
        alt="picOfRef" 
        className="node-tree-image"
      />
      {!balanceCheck && (<>
        <button className="invite-button2" onClick={handleButtonClick} disabled={buttonState === 'loading'}>
        {buttonState === 'loading' ? (<>
          {loadingLetter}
            <div className="spinner2"></div>
             
            </>
        ) : (
            'Count'
        )}
    </button>
    </>)}
    {success && (<>
      <div className="description-container" style={{justifyContent: 'center', alignItems: 'center', width: '80%'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <img src='https://img.icons8.com/?size=100&id=63262&format=png&color=000000' alt="token image" className="token-image" style={{marginRight: '5px', width: '25px', height: '25px'}}/>
      <p style={{fontSize: '25px'}}>Success</p>
        </div>
        <p className="description-text" style={{textAlign: 'center', width: '100%', fontSize: '10px'}}>The Secret tokens have been successfully decomposed into Durov Jesus Reward, which you can view in the "Reward" tab.</p>
      </div>
    </>)}



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
        Secret token
      </div>
      <div className="description-container" style={{justifyContent: 'center', alignItems: 'center', width: '80%'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <img src='https://cdn-icons-png.flaticon.com/512/3626/3626764.png' alt="token image" className="token-image" style={{marginRight: '5px', width: '15px', height: '15px'}}/>
      <p>  * some manipulation =</p>
      <img src='https://i.ibb.co/GnPQ1jd/IMG-2102.png' style={{margin: '0'}} alt="token image" className="token-image" />
      <img src='https://i.ibb.co/28QJcXt/IMG-2378.png' style={{margin: '0'}} alt="token image" className="token-image" />
      <img src='https://i.ibb.co/C2zC1MV/IMG-2376.png' style={{margin: '0'}} alt="token image" className="token-image" />

        </div>
        <p className="description-text" style={{textAlign: 'center', width: '100%', fontSize: '10px'}}>Secret token is a token that will be converted into Durov Jesus Reward during the counting phase.</p>
      </div>
      <div className="invite-container">
        <button className="invite-button" onClick={shareMessage}>Invite</button>
      </div>
    </div>)}
    </>

  );
}

export default FriendsPage;
