import React, { useState, useEffect } from 'react';
import './Candle.css';
import Task from '../../components/task/Task.js'
import axios from 'axios';  // Импортируем axios для выполнения запросов


const Candle = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [states, setStates] = useState([true, true, false, false]);
  const [isHolding, setIsHolding] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [balance, setBalance] = useState(0)
  const [balanceNot, setBalanceNot] = useState(0)
  const [balanceDogs, setBalanceDogs] = useState(0)
  const [clickedButtons, setClickedButtons] = useState([]);
  const [userCount, setUserCount] = useState(0)
  const [userChecked, setUserChecked] = useState(false)
  const [isInitialAnimation, setIsInitialAnimation] = useState(false);


  window.Telegram.WebApp.setBackgroundColor('#0066ff');
  window.Telegram.WebApp.setHeaderColor('#0066ff');
  const premium = window.Telegram.WebApp.initDataUnsafe.user.is_premium;
  const userId = window.Telegram.WebApp.initDataUnsafe.user.id; 

  const triggerHapticFeedback = () => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
    } else if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const triggerHapticFeedbackSucces = () => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    } else if (navigator.vibrate) {
      navigator.vibrate(50); // Для Android устройств
    }
  };

  useEffect(() => {
    if (balance === 1) {
      setIsInitialAnimation(true)
    const timer = setTimeout(() => {
      setIsInitialAnimation(false); // Через 1 секунду убираем анимацию
    }, 1000);

    return () => clearTimeout(timer); // Очищаем таймер при размонтировании компонента
    }
  }, [balance]);

  useEffect(() => {
    const platform = window.Telegram.WebApp.platform;
    if (platform !== "ios" && platform !== "android") {
      window.location.replace('https://hdr2029.github.io/monofacture/');    
    }
    const fetchReferrals = async () => {
      try {
        // Запрос к вашему API по userId (замените на динамический userId если нужно)
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/di${process.env.REACT_APP_AHHHF_IOE_PESDX}rect-referrals/${userId}/`);
        
        // Данные получены успешно
        const data = response.data;
        setUserCount(data.direct_referral_count);  // Устанавливаем количество рефералов
        setUserChecked(true)

      } catch (error) {
        console.error("Error fetching referral data:", error);
      }
    };

    fetchReferrals();  // Вызываем функцию получения данных при загрузке компонента
  }, []);

  useEffect(() => {
    const getInitialData = () => {
      window.Telegram.WebApp.CloudStorage.getItems(['balanceC', 'clickedButtons', 'balanceN', 'balanceD', 'start'], (error, result) => {
        if (error) {
          console.error('Failed to get initial data from cloud storage:', error);
        } else {
          const initialBalance = result.balanceC ? parseInt(result.balanceC, 10) : 0;
          const initialBalanceD = result.balanceD ? parseInt(result.balanceD, 10) : 0;
          const initialBalanceN = result.balanceN ? parseInt(result.balanceN, 10) : 0;
          const storedData = result.clickedButtons ? JSON.parse(result.clickedButtons) : [];
          setClickedButtons(storedData)
          setBalance(initialBalance);
          setBalanceNot(initialBalanceN);
          setBalanceDogs(initialBalanceD);
        }
      });
    };
    getInitialData();
  }, []);

  const handleHold = (event) => {
    // Разрешаем только при касании одного пальца
    if (event.touches && event.touches.length > 1) return;
    
    setIsHolding(true);
    const id = setInterval(() => {
      const randomNum = Math.floor(Math.random() * 20);
      const randomNum2 = Math.floor(Math.random() * 80);
      if (randomNum === 5) {
        setBalance((prevBalance) => {
          const newBalance = prevBalance + 1;
          window.Telegram.WebApp.CloudStorage.setItem('balanceC', Math.floor(newBalance).toString(), (error) => {
            if (error) {
              console.error('Failed to update balance in cloud storage:', error);
            }
          });
          return newBalance;
        });
        spawnLargeFloatingImage();
        triggerHapticFeedbackSucces()
      } else if (randomNum2 === 11 && userCount >= 5) {
        setBalanceNot((prevBalance) => {
          const newBalance = prevBalance + 1;
          window.Telegram.WebApp.CloudStorage.setItem('balanceN', Math.floor(newBalance).toString(), (error) => {
            if (error) {
              console.error('Failed to update balance in cloud storage:', error);
            }
          });
          return newBalance;
        });
        spawnLargeFloatingImageNot();
        triggerHapticFeedbackSucces()
      } else if (randomNum2 < 2 && userCount >= 5) {
        setBalanceDogs((prevBalance) => {
          const newBalance = prevBalance + 1;
          window.Telegram.WebApp.CloudStorage.setItem('balanceD', Math.floor(newBalance).toString(), (error) => {
            if (error) {
              console.error('Failed to update balance in cloud storage:', error);
            }
          });
          return newBalance;
        });
        spawnLargeFloatingImageDogs();
        triggerHapticFeedbackSucces()
      }
      triggerHapticFeedback()
      spawnFloatingImage();
    }, 200);
    setIntervalId(id);
  };
  
  const handleRelease = () => {
    setIsHolding(false);
    clearInterval(intervalId);
  };

  useEffect(() => {
    // Отключаем контекстное меню при долгом нажатии
    const handleContextMenu = (event) => {
      if (event.target.tagName === 'IMG') {
        event.preventDefault();
      }
    };

    // Отключаем длинное нажатие на сенсорных устройствах
    const handleTouchStart = (event) => {
      if (event.target.tagName === 'IMG') {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("touchstart", handleTouchStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  useEffect(() => {
    // Очистка интервала и сброс состояний при размонтировании компонента
    return () => {
      clearInterval(intervalId); // Останавливаем интервал
    };
  }, [intervalId]);

  const removeHandler = () => {
    window.Telegram.WebApp.CloudStorage.removeItems(['balanceC','clickedButtons'], (error) => {
      if (error) {
        console.error('Failed to update balance in cloud storage:', error);
      }
    });
  }

  const spawnLargeFloatingImage = () => {
    const container = document.querySelector('.floating-images');
    const img = document.createElement('img');
    img.src = 'https://i.ibb.co/GnPQ1jd/IMG-2102.png';
    img.classList.add('large-floating-image');

    // Генерируем случайную позицию для появления картинки
    const randomX = Math.random() * 100 - 90; // Случайное смещение по оси X
    const randomY = Math.random() * 100 - 10; // Случайное смещение по оси Y
    img.style.left = `calc(50% + ${randomX}px)`; // Позиция по X
    img.style.top = `calc(50% + ${randomY}px)`; // Позиция по Y

    // Генерируем случайное направление для полета
    const randomDirectionX = (Math.random() - 0.5) * 300; // Случайное смещение по оси X
    const randomDirectionY = -(Math.random() * 300 + 100); // Вверх по оси Y


    // Устанавливаем время анимации
    img.style.transform = `translate(${randomDirectionX}px, ${randomDirectionY}px)`;

    container.appendChild(img);

    // Удаляем изображение через delay
    setTimeout(() => {
        img.remove();
      }, 1000);
  };

  const spawnLargeFloatingImageNot = () => {
    const container = document.querySelector('.floating-images');
    const img = document.createElement('img');
    img.src = 'https://i.ibb.co/28QJcXt/IMG-2378.png';
    img.classList.add('large-floating-image');

    // Генерируем случайную позицию для появления картинки
    const randomX = Math.random() * 100 - 90; // Случайное смещение по оси X
    const randomY = Math.random() * 100 - 10; // Случайное смещение по оси Y
    img.style.left = `calc(50% + ${randomX}px)`; // Позиция по X
    img.style.top = `calc(50% + ${randomY}px)`; // Позиция по Y

    // Генерируем случайное направление для полета
    const randomDirectionX = (Math.random() - 0.5) * 300; // Случайное смещение по оси X
    const randomDirectionY = -(Math.random() * 300 + 100); // Вверх по оси Y


    // Устанавливаем время анимации
    img.style.transform = `translate(${randomDirectionX}px, ${randomDirectionY}px)`;

    container.appendChild(img);

    // Удаляем изображение через delay
    setTimeout(() => {
        img.remove();
      }, 1000);
  };

  const spawnLargeFloatingImageDogs = () => {
    const container = document.querySelector('.floating-images');
    const img = document.createElement('img');
    img.src = 'https://i.ibb.co/C2zC1MV/IMG-2376.png';
    img.classList.add('large-floating-image');

    // Генерируем случайную позицию для появления картинки
    const randomX = Math.random() * 100 - 90; // Случайное смещение по оси X
    const randomY = Math.random() * 100 - 10; // Случайное смещение по оси Y
    img.style.left = `calc(50% + ${randomX}px)`; // Позиция по X
    img.style.top = `calc(50% + ${randomY}px)`; // Позиция по Y

    // Генерируем случайное направление для полета
    const randomDirectionX = (Math.random() - 0.5) * 300; // Случайное смещение по оси X
    const randomDirectionY = -(Math.random() * 300 + 100); // Вверх по оси Y


    // Устанавливаем время анимации
    img.style.transform = `translate(${randomDirectionX}px, ${randomDirectionY}px)`;

    container.appendChild(img);

    // Удаляем изображение через delay
    setTimeout(() => {
        img.remove();
      }, 1000);
  };

  const spawnFloatingImage = () => {
    const container = document.querySelector('.floating-images');
    const img = document.createElement('img');
    img.src = 'https://jesus3.s3.eu-north-1.amazonaws.com/146614614666141.png';
    img.classList.add('small-floating-image');
  
    // Генерируем случайную позицию для появления картинки
    const randomX = Math.random() * 100 - 50; // Случайное смещение по оси X
    const randomY = Math.random() * 100 - 50; // Случайное смещение по оси Y
    img.style.left = `calc(50% + ${randomX}px)`; // Позиция по X
    img.style.top = `calc(50% + ${randomY}px)`; // Позиция по Y
  
    // Генерируем случайное направление для полета
    const randomDirectionX = (Math.random() - 0.5) * 300; // Случайное смещение по оси X
    const randomDirectionY = -(Math.random() * 300 + 100); // Вверх по оси Y
  
    // Анимация полета
    img.style.transform = `translate(${randomDirectionX}px, ${randomDirectionY}px)`;
  
    container.appendChild(img);
  
    // Удаляем изображение через 1 секунду
    setTimeout(() => {
      img.remove();
    }, 1000);
  };
  


  const handleClick = () => {
    triggerHapticFeedback()
    setIsExpanded(!isExpanded); // Переключаем состояние
  };

  return (
    <div className='candle-scroll'>
      {/* <pre>{JSON.stringify(premium, null, 2)}</pre> */}
      <div className='candle-top' onClick={!isExpanded ? null : handleClick}>
        <span className={`candle-title`}>MEMORIAL</span>
        <img className='candle-image' src='https://i.ibb.co/4st1d2k/IMG-2239.webp' alt='Candle Image' />
      </div>



      
      <div className='candle-middle'>
  <div className='middle-columns'>
    
    {/* Первая колонка */}
    <div className='middle-column'>
    <div className='middle-label' style={{color: 'white', fontSize: '20px'}}>Collect</div>

    <Task oldBalance={balance} setBalance={setBalance} earn={10} text={'coins'} value={100} reward={10} C={balance > 99} id={1} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={50} text={'coins'} value={500} reward={50} C={balance > 499} id={2} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={100} text={'coins'} value={'1k'} reward={100} C={balance > 999} id={3} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={250} text={'coins'} value={'2.5k'} reward={250} C={balance > 2499} id={4} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={500} text={'coins'} value={'5k'} reward={500} C={balance > 4999} id={5} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={1000} text={'coins'} value={'10k'} reward={'1k'} C={balance > 9999} id={6} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={2500} text={'coins'} value={'25k'} reward={'2.5k'} C={balance > 24999} id={7} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={5000} text={'coins'} value={'50k'} reward={'5k'} C={balance > 49999} id={8} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={10000} text={'coins'} value={'100k'} reward={'10k'} C={balance > 99999} id={9} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={25000} text={'coins'} value={'250k'} reward={'25k'} C={balance > 249999} id={10} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={50000} text={'coins'} value={'500k'} reward={'50k'} C={balance > 499999} id={11} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={100000} text={'coins'} value={'1m'} reward={'100k'} C={balance > 999999} id={12} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={500000} text={'coins'} value={'5m'} reward={'500k'} C={balance > 4999999} id={13} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={1000000} text={'coins'} value={'10m'} reward={'1m'} C={balance > 9999999} id={14} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>

    </div>

    {/* Вторая колонка */}
    <div className='middle-column'>
    <div className='middle-label' style={{color: 'white', fontSize: '20px'}}>Invite</div>

    <Task oldBalance={balance} setBalance={setBalance} earn={500} text={'friend'} value={1} reward={500} C={userCount > 0} id={15} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={1000} text={'friends'} value={2} reward={'1k'} C={userCount > 1} id={16} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={5000} text={'friends'} value={3} reward={'5k'} C={userCount > 2} id={17} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={10000} text={'friends'} value={5} reward={'10k'} C={userCount > 4} id={18} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={25000} text={'friends'} value={7} reward={'25k'} C={userCount > 6} id={19} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={50000} text={'friends'} value={10} reward={'50k'} C={userCount > 9} id={20} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={100000} text={'friends'} value={15} reward={'100k'} C={userCount > 14} id={21} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={250000} text={'friends'} value={20} reward={'250k'} C={userCount > 19} id={22} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={750000} text={'friends'} value={50} reward={'750k'} C={userCount > 49} id={23} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={2000000} text={'friends'} value={100} reward={'2m'} C={userCount > 99} id={24} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={8000000} text={'friends'} value={250} reward={'8m'} C={userCount > 249} id={25} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={20000000} text={'friends'} value={500} reward={'20m'} C={userCount > 499} id={26} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={50000000} text={'friends'} value={'1k'} reward={'50m'} C={userCount > 999} id={31} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={100000000} text={'friends'} value={'2k'} reward={'100m'} C={userCount > 1999} id={32} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={150000000} text={'friends'} value={'3k'} reward={'150m'} C={userCount > 2999} id={33} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={200000000} text={'friends'} value={'4k'} reward={'200m'} C={userCount > 3999} id={34} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={300000000} text={'friends'} value={'5k'} reward={'300m'} C={userCount > 4999} id={35} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={500000000} text={'friends'} value={'7k'} reward={'500m'} C={userCount > 6999} id={36} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={1000000000} text={'friends'} value={'10k'} reward={'1b'} C={userCount > 9999} id={37} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={2000000000} text={'friends'} value={'20k'} reward={'2b'} C={userCount > 19999} id={38} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={3000000000} text={'friends'} value={'30k'} reward={'3b'} C={userCount > 29999} id={39} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={5000000000} text={'friends'} value={'50k'} reward={'5b'} C={userCount > 49999} id={40} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={10000000000} text={'friends'} value={'100k'} reward={'10b'} C={userCount > 99999} id={41} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={20000000000} text={'friends'} value={'200k'} reward={'20b'} C={userCount > 199999} id={42} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    </div>

    {/* Третья колонка */}
    <div className='middle-column'>
    <div className='middle-label' style={{color: 'white', fontSize: '20px'}}>Complete</div>

    <Task oldBalance={balance} setBalance={setBalance} earn={500} text={'Subscribe'} value={'Community'} reward={500} C={!clickedButtons.includes(28)} id={28} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={1000} text={'Premium'} value={'Reward'} reward={'1k'} C={!clickedButtons.includes(29) && premium} id={29} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
    <Task oldBalance={balance} setBalance={setBalance} earn={500} text={'Subscribe'} value={'X'} reward={500} C={!clickedButtons.includes(30)} id={30} clickedButtons={clickedButtons} setClickedButtons={setClickedButtons}/>
      
    </div>
    {/* <button onClick={removeHandler}>Remove</button> */}
  </div>
</div>




      <div className={`candle-bottom ${isExpanded ? 'expanded' : 'collapsed'} ${isInitialAnimation ? 'initial' : ''}`} onClick={isExpanded ? null : handleClick}>
      <div className="candle-bottom-balance">
      <div>
        <img
          className="candle-image-balance"
          style={{ width: '15px', height: '15px', verticalAlign: 'middle' }}
          src="https://i.ibb.co/C2zC1MV/IMG-2376.png"
          alt="Candle Image"
        />
        <span
          id="balanceDogsText"
          className="candle-text-balance"
          style={{ fontSize: '15px', lineHeight: '15px', verticalAlign: 'middle' }}
        >
          {balanceDogs.toLocaleString()}
        </span>
      </div>
      <div>
        <img
          className="candle-image-balance"
          id="centralBalanceText"
          style={{ width: '30px', height: '30px', verticalAlign: 'middle' }}
          src="https://i.ibb.co/GnPQ1jd/IMG-2102.png"
          alt="Candle Image"
        />
        <span
          id="centralBalanceText"
          className="candle-text-balance"
          style={{ fontSize: '30px', lineHeight: '30px', verticalAlign: 'middle', fontWeight: 'bold'}}
        >
          {balance.toLocaleString()}
        </span>
      </div>
      <div>
        <img
          className="candle-image-balance"
          style={{ width: '15px', height: '15px', verticalAlign: 'middle' }}
          src="https://i.ibb.co/28QJcXt/IMG-2378.png"
          alt="Candle Image"
        />
        <span
          id="balanceNotText"
          className="candle-text-balance"
          style={{ fontSize: '15px', lineHeight: '15px', verticalAlign: 'middle' }}
        >
          {balanceNot.toLocaleString()}
        </span>
      </div>
    </div>

        <div className='top-progress-container'>
        <div className='top-text'>
          <span className={`step-label ${states[0] ? 'active' : ''}`}>STARTAPP</span>
          <span className={`step-label ${states[1] ? 'active' : ''}`}>MINING</span>
          <span className={`step-label ${states[2] ? 'active' : ''}`}>COUNTING</span>
          <span className={`step-label ${states[3] ? 'active' : ''}`}>LISTING</span>

            </div>
        </div>
        <div className='progress-container'>
            
      <div className='progress-line'>
        <div className='step'>
          <div className={`dot ${states[0] ? 'active' : ''}`}></div>
        </div>
        <div className={`line ${states[1] ? 'active' : ''}`}></div>
        <div className='step'>
          <div className={`dot ${states[1] ? 'active' : ''}`}></div>
        </div>
        <div className={`line ${states[2] ? 'active' : ''}`}></div>
        <div className='step'>
          <div className={`dot ${states[2] ? 'active' : ''}`}></div>
        </div>
        <div className={`line ${states[3] ? 'active' : ''}`}></div>
        <div className='step'>
          <div className={`dot ${states[3] ? 'active' : ''}`}></div>
        </div>
      </div>
    </div>
    <div className={`hands ${isHolding ? 'active' : ''}`}>
    <img
        className={`hands-image ${isHolding ? 'active' : ''}`}
        src='https://i.pinimg.com/originals/c4/e3/ce/c4e3ceda388a4ad225a9247e548c127f.png'
        alt='Hands Image'
        onMouseDown={handleHold}
        onMouseUp={handleRelease}
        onTouchStart={handleHold}
        onTouchEnd={handleRelease}
        
      />

      <div className='floating-images'></div>
    </div>

    {userCount < 5 && userChecked && (
      <div className="undertext">
        Invite 5 friends to open NOT and Dogs Token Pad
      </div>
    )}



      </div>
    </div>
  );
}

export default Candle;
