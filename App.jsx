import {WebView} from 'react-native-webview';
import React, {createContext, useRef, useEffect} from 'react';
import {StyleSheet, Dimensions, StatusBar, View} from 'react-native';
import {io} from 'socket.io-client';
import RNBootSplash from 'react-native-bootsplash';

// import * as Notifications from 'expo-notifications';
// import socket from "./utils/socket";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

const {height} = Dimensions.get('window');

export default function App() {
  const webviewRef = useRef(null);

  // const socket = useRef(null);

  const SocketContext = createContext(null);

  const onMessage = event => {
    const {data} = event.nativeEvent;
    if (data) {
      let start = data.indexOf('{');
      if (start === -1) return;

      let cookieJson = data.substring(start);
      let cookieData = JSON.parse(cookieJson);
      const storeUsername = async () => {
        try {
          let token = 'Bearer ' + cookieData.token;
          connectToSockets(token);
        } catch (e) {
          Alert.alert('Error! While saving username');
        }
      };
      storeUsername(cookieData);
    }
  };

  const connectToSockets = token => {
    const endpoint = 'http://172.20.10.3:3001';
    const socket = io(endpoint, {query: {token: token}});

    socket.on('connect', () => {
      console.log('Connected!');
    });

    setTimeout(() => {
      socket.on('mock', async data => {
        console.log('got notification');
        await Notifications.scheduleNotificationAsync({
          content: {
            title: data.title,
            body: data.text,
          },
          trigger: null,
        });
      });
    }, '2000');
  };

  // const lastNotificationResponse = Notifications.useLastNotificationResponse();

  // React.useEffect(() => {
  //   if (
  //     lastNotificationResponse &&
  //     lastNotificationResponse.notification.request.content.data[
  //       'someDataToCheck'
  //     ] &&
  //     lastNotificationResponse.actionIdentifier ===
  //       Notifications.DEFAULT_ACTION_IDENTIFIER
  //   ) {
  //     // navigate to your desired screen
  //   }
  // }, [lastNotificationResponse]);

  useEffect(() => {
    RNBootSplash.hide();

    // Notifications.requestPermissionsAsync();
    // const subscription = Notifications.addNotificationResponseReceivedListener(
    //   response => {
    //     console.log('User interacted with notification!', response);
    //     // You can do something when the user interacts with the notification here.
    //     // For example, navigate to a different screen in your app.
    //   },
    // );
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#6225e6'}}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <WebView
        bounces={false}
        style={styles.webview}
        ref={webviewRef}
        source={{uri: 'https://demo.edupal.gr'}}
        injectedJavaScript={`
            window.ReactNativeWebView.postMessage(document.cookie);
          `}
        onMessage={onMessage}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  view: {
    // flexDirection: 'row',
    // height: height,
    flex: 1,
    backgroundColor: 'red',
    // flex: 1,
  },
  webview: {
    height: height,
    // flex: 1,
  },
});
