import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [time, setTime] = useState(new Date());
  const [number, setNumber] = useState(0);
  const [count, setCount] = useState(0);
  const [terminalText, setTerminalText] = useState('> Processors are ready to start mining');
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLines, setTerminalLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [miningEndTime, setMiningEndTime] = useState(null);
  const [miningStartTime, setMiningStartTime] = useState(null);

  const tg = window.Telegram.WebApp;

  const generateRandomNumber2 = (min = 30, max = 98) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateRandomNumber5 = (min = 30000, max = 98000) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };


  const messages = [
    `Authentication successful for user: ${tg.initDataUnsafe.user.username}`,
    `Fetching data from endpoint /api/v1.011/mining/status                 [200, Success]`,
    `Connection established with ${tg.initDataUnsafe.user.id}@telegram`,
    `Initiating request for blockchain node sync                           [Successfully completed]`,
    `Received data packet: hash=${tg.initDataUnsafe.hash}                  [Successfully completed]`,
    `Resource limit check: CPU ${generateRandomNumber2()}% | Memory ${generateRandomNumber2()}%`,
    `Verifying node signature 1100.0991.${generateRandomNumber2()}         [Successfully completed]`,
    `Network latency: ${generateRandomNumber2()}ms`,
    `Starting smart contract execution                                     [Successfully completed]`,
    `Transaction hash confirmed: ${tg.initDataUnsafe.hash}                 [Successfully completed]`,
    `Data encryption in progress...`,
    `Verifying IP address...connected to ${tg.initDataUnsafe.user.id}@secure-node`,
    `Load balancer initialized at ${tg.initDataUnsafe.user.id}`,
    `Protocol handshake with node ID ${tg.initDataUnsafe.query_id}`,
    `Blockchain sync: ${number}%                          [Successfully completed]`,
    `Executing data integrity check                                        [Successfully completed]`,
    `Decoding transaction                                                  [Successfully completed]`,
    `Fetching user permissions                                             [Successfully completed]`,
    `Downloading block headers                                             [Successfully completed]`,
    `Mining initiated on block ${generateRandomNumber5()} latency: ${generateRandomNumber2()}ms`,
    `Transaction pool full. Pending transactions: ${generateRandomNumber2()}`,
    `Updating smart contract state                                         [Successfully completed]`,
    `Authorization check for ${tg.initDataUnsafe.user.username}            [Successfully completed]`,
    `Network congestion detected. Rebalancing traffic                      [Successfully completed]`,
    `Executing node search algorithm                                       [Successfully completed]`,
    `Hash mismatch detected! Restarting                                    [Successfully completed]`,
    `Checking TLS certificate validity                                     [Successfully completed]`,
    `Switching to backup node                                              [Successfully completed]`,
    `Verifying block signatures                                            [Successfully completed]`,
    `Mining reward issued to ${tg.initDataUnsafe.user.id}`,
  ];
  

  useEffect(() => {
    const getMiningData = () => {
      tg.CloudStorage.getItems(['miningEndTime', 'miningStartTime'], (error, result) => {
        if (error) {
          console.error('Failed to get data from cloud storage:', error);
        } else {
          const endTime = result.miningEndTime ? new Date(result.miningEndTime) : null;
          const startTime = result.miningStartTime ? new Date(result.miningStartTime) : null;
          const now = new Date();

          if (endTime && startTime) {
            setMiningEndTime(endTime);
            setMiningStartTime(startTime);

            const elapsedTime = Math.floor((Math.floor((now - startTime) / 1000)) / 3);

            setNumber(elapsedTime);

            if (now < endTime) {
              setIsRunning(true);
              setCount(1)

              setTerminalLines(generateRandomLines(messages, elapsedTime)); // Генерация строк при загрузке
            }
          }

          setLoading(false); // Устанавливаем состояние загрузки как завершенное
        }
      });
    };

    getMiningData();
  }, [tg]);

  const generateRandomLines = (messages, number) => {
    const lines = Array.from({ length: 15 }, () => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      return `${hours}:${minutes}:${seconds} ${number}% ${randomMessage}`;
    });
    return lines;
  };

  useEffect (() => {
    if (isRunning) {
      setTerminalLines(generateRandomLines(messages, number))
    }
  }, [])

  useEffect(() => {
    if (isRunning) return; // Если процесс запущен, то ничего не делаем
  
    const intervalId = setInterval(() => {
      setTerminalText(prevText => 
        prevText.endsWith('|') ? prevText.slice(0, -1) : prevText + '|'
      );
    }, 500); // Каждые 500 мс
  
    return () => clearInterval(intervalId); // Очищаем интервал при завершении эффекта
  }, [isRunning]);
  


  useEffect(() => {
    if (!isRunning) return; // Остановиться, если процент достиг 100

    const randomMessage = messages[Math.floor(Math.random() * messages.length)]; // Случайное сообщение
    const newLine = `${hours}:${minutes}:${seconds} ${number}% ${randomMessage}`;
    let currentCharIndex = 0;
    const now = new Date();

    const typingInterval = setInterval(() => {
      if (currentCharIndex < newLine.length) {
        setTerminalText((prev) => prev + newLine[currentCharIndex]);
        currentCharIndex++;
      } else {
        if (miningEndTime > now) {
        clearInterval(typingInterval); // Останавливаем тайпинг, когда строка дописана
        setTerminalLines((prevLines) => [...prevLines, newLine]); // Добавляем строку в массив для отображения
        setTerminalText('> '); // Очищаем временную строку для следующей
        setCount((prev) => prev + 1)
        const elapsedTime = Math.floor((now - miningStartTime) / 1000);
        setNumber(Math.floor(elapsedTime / 3)); // Увеличиваем процент}
      } else {
        setTerminalText('> Mining was successfully completed');
        setIsRunning(false)
        clearInterval(typingInterval); 
        tg.CloudStorage.setItem('miningEndTime', null, (error) => {
          if (error) {
            console.error('Failed to update end time in cloud storage:', error);
          }
        });
    
        tg.CloudStorage.setItem('miningStartTime', null, (error) => {
          if (error) {
            console.error('Failed to update start time in cloud storage:', error);
          }
        });
      };

      }
    }
    , 8); // Скорость вывода символов

    return () => clearInterval(typingInterval); // Очищаем интервал
  }, [count]);



  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // Очистка интервала при размонтировании
  }, []);

  const startMining = () => {
    const now = new Date();
    const endTime = new Date(now.getTime() + 60 * 1000); // Устанавливаем время окончания через минуту
    setMiningStartTime(now);
    setTerminalText('')
    setMiningEndTime(endTime);
    setIsRunning(true);
    setNumber(0);
    setCount(1)

    tg.CloudStorage.setItem('miningEndTime', endTime.toISOString(), (error) => {
      if (error) {
        console.error('Failed to update end time in cloud storage:', error);
      }
    });

    tg.CloudStorage.setItem('miningStartTime', now.toISOString(), (error) => {
      if (error) {
        console.error('Failed to update start time in cloud storage:', error);
      }
    });
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(time);

  if (loading) {
    return <div>Loading data...</div>; // Отображаем загрузку, пока данные не подтянулись
  }
  return (
    <div className='home-scroll'>
      <div className='home-circles'>
        <div className='circle'>{hours}</div>
        <div className='circle'>{minutes}</div>
        <div className='circle'>{seconds}</div>
      </div>
      <div className='home-airdrop'>
          <span>Airdrop</span>
          <img src='https://upload.wikimedia.org/wikipedia/commons/0/0f/Bybit-logo_%28cropped%29.png' alt='description' />
      </div>
      <div className='home-coins'>
      
      <img src='https://static.vecteezy.com/system/resources/previews/016/327/071/original/b-alphabet-letter-png.png' alt='description' />
      <span>183,047</span>
      </div>

      <div className='home-terminal' >
        <div className='terminal' >
          {terminalLines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
          <div>{terminalText}</div>
        </div>
      </div>
      <div className='home-mining' >
        <div className='mining-button' disable={isRunning} onClick={startMining} style={{justifyContent: isRunning ? 'space-between' : 'center', }}>
        <div>Miningg</div>
        {isRunning && <div>dgfdgd</div>}
        </div>
      </div>
    </div>
  );
}

export default HomePage;