import React, { useEffect, useState } from 'react';
import './LeaderPage.css';

const LeaderPage = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRank, setCurrentRank] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null); 
  const [balance, setBalance] = useState(0);
  const [isBalanceLoaded, setIsBalanceLoaded] = useState(false); // Флаг для отслеживания загрузки баланса
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
  const [isChecked, setIsChecked] = useState(true); // Флаг для контроля дополнительных проверок

  const picture = 'https://freesvg.org/img/abstract-user-flat-4.png'; // URL аватара по умолчанию

  // Устанавливаем цвета фона и шапки приложения Telegram
  window.Telegram.WebApp.setBackgroundColor('#000');
  window.Telegram.WebApp.setHeaderColor('#000');

  // Получаем ID пользователя из данных Telegram
  const userId = window.Telegram.WebApp.initDataUnsafe.user.id; 

  // Запрос начальных данных (баланс) из Cloud Storage Telegram
  useEffect(() => {
    const getInitialData = () => {
      window.Telegram.WebApp.CloudStorage.getItems(['balanceC'], (error, result) => {
        if (error) {
          console.error('Failed to get initial data from cloud storage:', error);
        } else {
          const initialBalance = result.balanceC ? parseInt(result.balanceC, 10) : 0;
          setBalance(initialBalance);
          setIsBalanceLoaded(true); 
        }
      });
    };
    getInitialData();
  }, []);

  const checkAndUpdateBalance = async () => {
    if (!isBalanceLoaded) return; // Ждем загрузки баланса

    try {
      // Получаем баланс пользователя с API
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/ch${process.env.AHHHF_IOE_PESDX}eck-user/${userId}/`);
      const data = await response.json();

      if (data.message === "User found") {
        const apiBalance = parseInt(data.balance, 10);

        // Если баланс в API отличается от локального, обновляем его на сервере
        if (apiBalance < balance) {
          try {
            const updateResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/update-bala${process.env.AHHHF_IOE_PESDX}nce/${userId}/`, {
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

  const getCurrentMonth = () => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const date = new Date();
    return monthNames[date.getMonth()];
};


  // Запрос списка пользователей из API
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isBalanceLoaded) return; // Ждем загрузки баланса перед запросом

      try {
        // Сначала проверяем и обновляем баланс
        await checkAndUpdateBalance();

        // Запрос списка пользователей
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/li${process.env.AHHHF_IOE_PESDX}st-user/`);
        const data = await response.json();
        setUsers(data);
        setIsChecked(false);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchUsers();
  }, [isBalanceLoaded, balance]); // Зависимость от загрузки баланса

  // Запрос информации о текущем пользователе и его ранге
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user-r${process.env.AHHHF_IOE_PESDX}ank/?user_id=${userId}`)
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
          {/* Секция шапки лидеров */}
          <div className='top-leader'>
            <div className="leader-header">
              <img
                src="https://getcompliance.com.au/wp-content/uploads/2022/11/star.png"
                alt="Leader Avatar"
              />
              <div className='header-up'>Leaderboard</div>
              <div className='header-low'>{`🏆 Top 100 🏆`}</div> {/* Здесь выводим текущий месяц */}
            </div>

            {/* Карточка текущего пользователя */}
            {currentUser && (
              <div className="leader-card">
                <img
                  src={currentUser.photo_url || picture} // Аватар текущего пользователя
                  alt={currentUser.name}
                  onError={(e) => e.target.src = picture} // Заменяем на картинку по умолчанию при ошибке
                />
                <div>
                  <strong>{currentUser.name}</strong> {/* Имя текущего пользователя */}
                  <p>{`#${currentRank.toLocaleString()}`}</p> {/* Ранг текущего пользователя */}
                </div>
                <div className="coins">
                  <p>{parseInt(balance).toLocaleString()}</p> {/* Баланс текущего пользователя */}
                  <img
                    src="https://i.ibb.co/GnPQ1jd/IMG-2102.png"
                    alt="coins"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Секция списка лидеров */}
          <div className='mid-leader'>
            {users.map((user, index) => (
              <div key={user.user_id} className="leader-card">
                <img
                  src={user.photo_url || picture} // Аватар пользователя
                  alt={user.name}
                  onError={(e) => e.target.src = picture} // Заменяем на картинку по умолчанию при ошибке
                />
                <div>
                  <strong>{user.name}</strong> {/* Имя пользователя */}
                  <p>{`#${index + 1}`}</p> {/* Порядковый номер пользователя */}
                </div>
                <div className="coins">
                  <p>{parseInt(user.balance).toLocaleString()}</p> {/* Баланс пользователя */}
                  <img
                    src="https://i.ibb.co/GnPQ1jd/IMG-2102.png"
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
