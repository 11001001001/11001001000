import React from 'react';
import './LeaderPage.css';

const LeaderPage = () => {

  window.Telegram.WebApp.setBackgroundColor('#000');
  window.Telegram.WebApp.setHeaderColor('#000');
  const users = [
    ['1500', 'Anton', 'https://wl-brightside.cf.tsp.li/resize/728x/jpg/473/6f7/3813505c50920e4a12617de710.jpg'],
    ['1034', 'Oleg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg5mGb4ICGVkFXuL1rAYed3jGcL2qOG1v3nA&s'],
    ['870', 'Maria', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBxYc7DWRwScrfTpFCKOO2Nb78sCEkRy6yLg&s'],
    ['2045', 'Ivan', 'https://assets.vogue.com/photos/65418f5726fcdeb5a090adf8/master/w_2560%2Cc_limit/1530545900'],
    ['1760', 'Ryan', 'https://static.stacker.com/s3fs-public/2022-08/Ryan%20Gosling.png'],
    ['960', 'Emily', 'https://0c77b670.rocketcdn.me/wp-content/uploads/Top-15-Most-Beautiful-Female-Celebrities-Actresses-of-2023-According-to-Polls-Image-9-1024x549.jpg'],
    ['1330', 'John', 'https://img.mensxp.com/media/content/2020/Sep/Male-Celebrities-Who-Have-Dabbled-With-Some-Really-Outlandish-1200x900_5f62142e3dc6c.jpeg'],
    ['1420', 'Sophia', 'https://img.buzzfeed.com/buzzfeed-static/static/2021-12/12/21/asset/a97ca4f28dd6/sub-buzz-9060-1639343476-23.jpg?downsize=700%3A%2A&output-quality=auto&output-format=auto'],
    ['1100', 'Elena', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3hbdL-g1o7KVZppR3TZROu22XAsA562WH-A&s'],
    ['1230', 'Max', 'https://wp.inews.co.uk/wp-content/uploads/2022/03/SEI_95866611.jpg?resize=640,360&strip=all&quality=90']
  ];

  // Сортировка пользователей по количеству монет (по убыванию)
  const sortedUsers = [...users].sort((a, b) => b[0] - a[0]);

  return (
    <div className="leader-scroll">
      <div className='fixed-header'>
      {/* Верхняя картинка, заголовок и подзаголовок */}
      <div className="leader-header">
        <img
          src="https://getcompliance.com.au/wp-content/uploads/2022/11/star.png"
          alt="Leader Avatar"
        />
        <div className='header-up'>Leaderboard</div>
        <div className='header-low'>Top 500 Players🏆</div>
      </div>

      {/* Блок с карточкой текущего лидера (первый по индексу) */}
      <div className="leader-card">
        <img
          src={users[0][2]} // Аватар первого пользователя (по индексу)
          alt={users[0][1]}
        />
        <div>
          <strong>{users[0][1]}</strong> {/* Имя лидера */}
          <p>{`#${sortedUsers.findIndex(user => user[1] === users[0][1]) + 1}`}</p> {/* Номер по сортировке */}
        </div>
        <div className="coins">
          <p>{users[0][0]}</p>
          <img
            src="https://i.ibb.co/GnPQ1jd/IMG-2102.png" // Ссылка на изображение монеты
            alt="coins"
            style={{ width: '30px' }} // Размер картинки монеты
          />
        </div>
      </div>

      {/* Разделительная линия */}
      <hr className="hr-divider" />
      </div>
      {/* Блок с карточками остальных пользователей */}
      <div className="user-list">
        {sortedUsers.map((user, index) => (
          <div key={index} className="leader-card">
            <img
              src={user[2]} // Аватар пользователя
              alt={user[1]}
            />
            <div>
              <strong>{user[1]}</strong> {/* Имя пользователя */}
              <p>{`#${index + 1}`}</p> {/* Номер по сортировке */}
            </div>
            <div className="coins">
              <p>{user[0]}</p> {/* Количество монет */}
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
  );
}

export default LeaderPage;
