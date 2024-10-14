import React from 'react'

const Examples = () => {

    if (telegramUserId) {
        fetch(`http://127.0.0.1:8000/api/user-photo/${telegramUserId}`)  // Обратите внимание на корректный URL
          .then(response => response.json())
          .then(data => {
            if (data.photo_url) {
              setPhotoUrl(data.photo_url);
            }
          })
          .catch(error => {
            console.error('Error fetching user photo:', error);
          });
      }
      
  return (
    <div>
        

    </div>
  )
}

export default Examples