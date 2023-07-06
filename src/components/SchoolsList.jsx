import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React from 'react';
import {FlashList} from '@shopify/flash-list';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const SchoolsList = ({data}) => {
  const navigation = useNavigation();

  const onSchoolPress = school => {
    navigation.navigate('Webview', {
      school,
    });
  };

  const renderItem = ({item}) => {
    return (
      <Pressable
        style={styles.itemContainer}
        onPress={() => onSchoolPress(item)}>
        <Image
          resizeMode="contain"
          source={{uri: `https://propylaia.edupal.gr${item?.schoolLogo}`}}
          style={styles.image}
        />
        <View>
          <Text style={styles.schoolName}>{item.schoolName}</Text>
          <Text style={styles.schoolCity}>{item.schoolCity}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.listContainer, {height: data.length * 56 + 18}]}>
      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={48}
        keyboardShouldPersistTaps={'handled'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    top: 8,
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 4,
  },
  image: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 4,
    marginRight: 8,
  },
  schoolName: {
    fontSize: 14,
    fontWeight: '500',
    width: width - 122,
  },
  schoolCity: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    width: width - 122,
  },
});

export default SchoolsList;
