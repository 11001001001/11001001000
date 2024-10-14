import React, { useEffect, useState } from 'react';
import './LeaderPage.css';

const LeaderPage = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRank, setCurrentRank] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null); 
  const [balance, setBalance] = useState(0);
  const [isBalanceLoaded, setIsBalanceLoaded] = useState(false); // Новый флаг для отслеживания загрузки баланса
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
  const [isChecked, setIsChecked] = useState(true); // Состояние загрузки

  const picture = 'https://freesvg.org/img/abstract-user-flat-4.png';

  window.Telegram.WebApp.setBackgroundColor('#000');
  window.Telegram.WebApp.setHeaderColor('#000');
  const userId = window.Telegram.WebApp.initDataUnsafe.user.id; 

  useEffect(() => {
    const getInitialData = () => {
      window.Telegram.WebApp.CloudStorage.getItems(['balanceC'], (error, result) => {
        if (error) {
          console.error('Failed to get initial data from cloud storage:', error);
        } else {
          const initialBalance = result.balanceC ? parseInt(result.balanceC, 10) : 0;
          setBalance(initialBalance);
          setIsBalanceLoaded(true); // Устанавливаем флаг, когда баланс загружен
        }
      });
    };
    getInitialData();
  }, []);

  // Функция для проверки и обновления баланса
  const checkAndUpdateBalance = async () => {
    if (!isBalanceLoaded) return; // Выполняем проверку только если баланс загружен

    try {
      // Шаг 1: Получаем баланс пользователя с API
      const response = await fetch(`https://bye-b7c975e7a8fb.herokuapp.com/api/check-user/${userId}/`);
      const data = await response.json();

      if (data.message === "User found") {
        const apiBalance = parseInt(data.balance, 10);

        // Шаг 2: Если баланс в API отличается от локального, обновляем его на сервере
        if (apiBalance !== balance) {
          try {
            const updateResponse = await fetch(`https://bye-b7c975e7a8fb.herokuapp.com/api/update-balance/${userId}/`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ balance })
            });

            if (updateResponse.ok) {
              console.log('Balance updated successfully');
            } else {
              console.error('Error updating balance:', await updateResponse.json());
            }
          } catch (error) {
            console.error('Request failed:', error);
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при проверке баланса:', error);
    }
  };

  // Запрос к API для получения всех пользователей
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isBalanceLoaded) return; // Ждем загрузки баланса перед выполнением запросов

      try {
        // Сначала проверяем и обновляем баланс
        await checkAndUpdateBalance();

        // Запрос на получение списка пользователей
        const response = await fetch('https://bye-b7c975e7a8fb.herokuapp.com/api/list-user/');
        const data = await response.json();
        setUsers(data);
        setIsChecked(false)
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchUsers();
  }, [isBalanceLoaded, balance]); // Выполняем запрос только после загрузки баланса

  // Запрос к API для получения информации о текущем пользователе
  useEffect(() => {
    fetch(`https://bye-b7c975e7a8fb.herokuapp.com/api/user-rank/?user_id=${userId}`)
      .then(response => response.json())
      .then(data => {
        setCurrentUser(data.user);
        setCurrentRank(data.rank);
        setTotalUsers(data.total_users); // Сохраняем общее количество пользователей
        setIsLoading(false);
      })
      .catch(error => console.error('Ошибка при получении данных о текущем пользователе:', error));
  }, [userId]);

  return (
    <>
    {isLoading && isChecked ? (
      <div className='spinner-container'>
        <div className="spinner">
          <img src="https://i.ibb.co/GnPQ1jd/IMG-2102.png" alt="loading" className="spinner-image" />
        </div>
      </div>
    ) : (
    <div className="leader-scroll">
      {/* <div style={{position: 'absolute', top: '20px', right: '20px', fontSize: '10px', color: '#999', zIndex: '4'}}>
        {`${(211323 + totalUsers).toLocaleString()} users`}
      </div>  */}
      <div className='top-leader'>
        <div className="leader-header">
          <img
            src="https://getcompliance.com.au/wp-content/uploads/2022/11/star.png"
            alt="Leader Avatar"
          />
          <div className='header-up'>Leaderboard</div>
          <div className='header-low'>🏆Top 100🏆</div>
        </div>

        {currentUser && (
          <div className="leader-card">
            <img
              src={currentUser.photo_url || picture} // Аватар текущего пользователя или placeholder
              alt={currentUser.name}
            />
            <div>
              <strong>{currentUser.name}</strong> {/* Имя текущего пользователя */}
              <p>{`#${currentRank.toLocaleString()}`}</p> {/* Место текущего пользователя */}
            </div>
            <div className="coins">
              <p>{parseInt(balance).toLocaleString()}</p> {/* Баланс с форматированием */}
              <img
                src="https://i.ibb.co/GnPQ1jd/IMG-2102.png" // Ссылка на изображение монеты
                alt="coins"
              />
            </div>
          </div>
        )}
      </div>

      <div className='mid-leader'>
        {users.map((user, index) => (
          <div key={user.user_id} className="leader-card">
            <img
              src={user.photo_url || picture} // Аватар пользователя или placeholder
              alt={user.name}
            />
            <div>
              <strong>{user.name}</strong> {/* Имя пользователя */}
              <p>{`#${index + 1}`}</p> {/* Номер по сортировке */}
            </div>
            <div className="coins">
              <p>{parseInt(user.balance).toLocaleString()}</p> {/* Баланс с форматированием */}
              <img
                src="https://i.ibb.co/GnPQ1jd/IMG-2102.png" // Ссылка на изображение монеты
                alt="coins"
                style={{ width: '30px' }} // Размер картинки монеты
              />
            </div>
          </div>
        ))}
      </div>
    </div>
    )}
    </>
  );
};

export default LeaderPage;
