export const saveNotificationToken = (token, notificationToken) => {
  try {
    return fetch('http://192.168.2.4:3001/save-notification-token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: token,
      },
      body: JSON.stringify({notificationToken}),
    });
  } catch (e) {
    console.log('Error on save notification token API ', e);
  }
};
