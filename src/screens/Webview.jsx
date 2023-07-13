import {
  View,
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React from 'react';
import {io} from 'socket.io-client';
import WebView from 'react-native-webview';
import {NotificationUtils} from '../utils/NotificationUtils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const isAndroid = Platform.OS === 'android';
const {height} = Dimensions.get('screen');

const Webview = ({route}) => {
  const insets = useSafeAreaInsets();
  const webviewRef = React.useRef(null);
  const [url, setUrl] = React.useState(null);
  const [token, setToken] = React.useState(null);

  const isLogged = !url?.includes('/login');

  const connectToSockets = token => {
    const endpoint = route?.params?.school?.schoolDomain; //'http://192.168.2.4:3001'
    const socket = io(endpoint, {query: {token: token}});
    console.log('Connecting to the socket...');

    socket.on('connect', () => {
      console.log('Socket connected!');
    });

    socket.on('mock', async data => {
      console.log('Foreground notification data', data);
      NotificationUtils.displayNotification(data);
    });
  };

  const onMessage = event => {
    const {data} = event.nativeEvent;

    if (data) {
      let start = data.indexOf('{');
      if (start === -1) return;

      let cookieJson = data.substring(start);
      let cookieData = JSON.parse(cookieJson);

      if (token === 'Bearer ' + cookieData.token) return;

      const storeUsername = async () => {
        try {
          let token = 'Bearer ' + cookieData.token;
          setToken(token);
          connectToSockets(token);
        } catch (e) {
          Alert.alert('Error! While saving username');
        }
      };

      storeUsername(cookieData);
    }
  };

  const onNavigationStateChange = ({url}) => setUrl(url);

  //Handle status bar based on URL state
  React.useEffect(() => {
    if (!isLogged) {
      StatusBar.setBarStyle('light-content');
      isAndroid && StatusBar.setTranslucent(true);
      isAndroid && StatusBar.setBackgroundColor('transparent');
    } else {
      NotificationUtils.getNotificationToken(token);
      StatusBar.setBarStyle('dark-content');
      isAndroid && StatusBar.setTranslucent(false);
      isAndroid && StatusBar.setBackgroundColor('white');
    }
  }, [url, token]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.innerContainer,
          isLogged && {
            paddingTop: insets.top,
            backgroundColor: 'white',
          },
        ]}>
        <WebView
          bounces={false}
          style={styles.webview}
          ref={webviewRef}
          onNavigationStateChange={onNavigationStateChange}
          source={{uri: route?.params?.school?.schoolDomain}} //'http://192.168.2.4:3001'
          injectedJavaScript={`
            window.ReactNativeWebView.postMessage(document.cookie);
          `}
          onMessage={onMessage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c0a46',
  },
  innerContainer: {
    height,
    width: '99.9%',
    alignSelf: 'center',
  },
  webview: {
    height,
  },
});

export default Webview;
