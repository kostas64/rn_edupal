import React from 'react';
import WebView from 'react-native-webview';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import {io} from 'socket.io-client';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

const isAndroid = Platform.OS === 'android';
const {height} = Dimensions.get('window');

const Webview = ({route}) => {
  const insets = useSafeAreaInsets();
  const webviewRef = React.useRef(null);
  const [url, setUrl] = React.useState(null);

  // const socket = useRef(null);

  const SocketContext = React.createContext(null);

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
          //Alert.alert('Error! While saving username');
        }
      };
      storeUsername(cookieData);
    }
  };

  const onNavigationStateChange = ({url}) => setUrl(url);

  //Handle status bar based on URL state
  React.useEffect(() => {
    if (url?.includes('/login')) {
      StatusBar.setBarStyle('light-content');
      isAndroid && StatusBar.setTranslucent(true);
      isAndroid && StatusBar.setBackgroundColor('transparent');
    } else {
      StatusBar.setBarStyle('dark-content');
      isAndroid && StatusBar.setTranslucent(false);
      isAndroid && StatusBar.setBackgroundColor('white');
    }
  }, [url]);

  return (
    <View
      style={[
        {flex: 1},
        !url?.includes('/login') && {
          paddingTop: insets.top,
          backgroundColor: 'white',
        },
      ]}>
      <WebView
        bounces={false}
        style={styles.webview}
        ref={webviewRef}
        onNavigationStateChange={onNavigationStateChange}
        source={{uri: `https://${route?.params?.school?.schoolDomain}/login`}}
        injectedJavaScript={`
            window.ReactNativeWebView.postMessage(document.cookie);
          `}
        onMessage={onMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'red',
  },
  webview: {
    height,
  },
});

export default Webview;
