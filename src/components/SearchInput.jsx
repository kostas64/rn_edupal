import {
  View,
  Image,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React from 'react';

const SearchInput = ({value, setValue, loadingApi, clearData}) => {
  return (
    <View>
      <TextInput
        value={value}
        onChangeText={setValue}
        style={styles.textInput}
      />
      {loadingApi && (
        <ActivityIndicator
          size={'small'}
          color={'rgba(153,90,255,255)'}
          style={styles.indicator}
        />
      )}
      {!!value && (
        <Pressable onPress={clearData} style={styles.deleteIconContainer}>
          <Image
            source={require('../assets/images/close.png')}
            style={styles.deleteIcon}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.65)',
    paddingLeft: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  indicator: {
    position: 'absolute',
    right: 42,
    top: 16,
  },
  deleteIconContainer: {
    position: 'absolute',
    right: 12,
    top: 16,
  },
  deleteIcon: {
    height: 20,
    width: 20,
  },
});

export default SearchInput;
