// StackNavigation.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { STACK_ROUTES } from './StackRoutes';
import { STACK_ROOTS } from './Root';
// You no longer need useAuth or the loading view here
// import {useAuth} from '../context/AuthContext';
// import {ActivityIndicator, View} from 'react-native';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      // 1. Always start on the SplashScreen
      initialRouteName={STACK_ROUTES.SPLASH_SCREEN}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name={STACK_ROUTES.SPLASH_SCREEN}
        component={STACK_ROOTS.SplashScreen}
      />
      <Stack.Screen
        name={STACK_ROUTES.LOGIN_SCREEN}
        component={STACK_ROOTS.LoginScreen}
      />
      <Stack.Screen
        name={STACK_ROUTES.HOME_SCREEN}
        component={STACK_ROOTS.HomeScreen}
      />
      <Stack.Screen
        name={STACK_ROUTES.REGISTER_SCREEN}
        component={STACK_ROOTS.RegisterScreen}
      />
     {/* Add other screens here as needed */}
    </Stack.Navigator>
  );
};

export default StackNavigation;
