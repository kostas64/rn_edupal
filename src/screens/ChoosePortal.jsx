import {
  Text,
  Image,
  Platform,
  Keyboard,
  StatusBar,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {Pressable} from 'react-native';
import dict from '../assets/json/dict.json';
import notifee from '@notifee/react-native';
import RNBootSplash from 'react-native-bootsplash';
import SearchInput from '../components/SearchInput';
import SchoolsList from '../components/SchoolsList';
import {searchSchoolName} from '../services/searchSchoolNames';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('screen');

const ChoosePortal = () => {
  const insets = useSafeAreaInsets();
  const timeout = React.useRef(null);
  const [searchRes, setSearchRes] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [loadingApi, setLoadingApi] = React.useState(false);

  const onChangeHandler = value => {
    clearTimeout(timeout.current);
    value.length > 1 && setLoadingApi(true);
    setSearchValue(value);
    value.length === 0 && setSearchRes([]);
    timeout.current = setTimeout(() => {
      value.length > 1 && search(value);
    }, 300);
  };

  const clearData = () => {
    setSearchValue('');
    setSearchRes([]);
    setLoadingApi(false);
  };

  const search = value => {
    searchSchoolName(value)
      .then(async res => {
        const data = await res.json();
        setSearchRes(data);
        setLoadingApi(false);
        data.length > 0 && Keyboard.dismiss();
      })
      .catch(e => {
        setLoadingApi(false);
      });
  };

  const initApp = async () => {
    RNBootSplash.hide();
    await notifee.requestPermission();
    StatusBar.setBarStyle('light-content');
    isAndroid && StatusBar.setTranslucent(true);
    isAndroid && StatusBar.setBackgroundColor('transparent');
  };

  React.useEffect(() => {
    initApp();
  }, []);

  return (
    <>
      <ImageBackground
        source={require('../assets/images/login-bg.jpg')}
        style={styles.background}
      />
      <Image
        source={require('../assets/images/favicon.png')}
        style={styles.favicon}
      />
      <Pressable
        style={[
          styles.container,
          {
            paddingTop: insets.top + 24,
          },
        ]}>
        <Text style={styles.searchLabel}>{dict.searchSchool}</Text>
        <SearchInput
          value={searchValue}
          setValue={onChangeHandler}
          loadingApi={loadingApi}
          clearData={clearData}
        />
      </Pressable>
      {searchRes.length > 0 && <SchoolsList data={searchRes} />}
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width,
    height,
  },
  container: {
    paddingHorizontal: 16,
  },
  searchLabel: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 16,
    width: 280,
  },
  favicon: {
    width: 128,
    height: 128,
    position: 'absolute',
    opacity: 0.75,
    alignSelf: 'center',
    top: (height - 128) / 2,
  },
});

export default ChoosePortal;
