import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {saveNotificationToken} from '../services/saveNotificationToken';

export class NotificationUtils {
  static getNotificationToken = async token => {
    messaging()
      .getToken()
      .then(notToken => {
        saveNotificationToken(token, notToken);
      });
  };

  static foregroundNotification = () => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  };

  static backgroundNotification = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      this.displayNotification(remoteMessage.data);
    });

    notifee.onBackgroundEvent(async ({type, detail}) => {
      const {notification, pressAction} = detail;
      console.log('Background notifation 2', notification, pressAction);
    });
  };

  static displayNotification = async data => {
    console.log('Data ', data);
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: data.title,
      body: data.text,
      android: {
        channelId,
        color: '#6220e7',
        smallIcon: 'ic_notification', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  };
}
