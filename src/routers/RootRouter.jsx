import React from 'react';
import Webview from '../screens/Webview';
import ChoosePortal from '../screens/ChoosePortal';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator();

const RootRouter = () => {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <RootStack.Screen name="ChoosePortal" component={ChoosePortal} />
      <RootStack.Screen name="Webview" component={Webview} />
    </RootStack.Navigator>
  );
};

export default RootRouter;
