import '../../global.css';
import React, { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import BaseLayout from '../components/BaseLayout'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STACK_ROUTES } from '../navigation/StackRoutes';
import { COLORS } from '../utils/color';

const SplashScreen = ({navigation}) => {

   useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("access_token");
      console.log('token check',token);

      // Optional: wait 2 sec for splash effect
      setTimeout(() => {
        if (token) {
          navigation.replace(STACK_ROUTES.HOME_SCREEN);
        } else {
          navigation.replace(STACK_ROUTES.LOGIN_SCREEN);
        }
      }, 2000);
    };

    checkLogin();
  }, []);


  return (
    <BaseLayout >
      <View className="flex-1 bg-blue-500 justify-center items-center">
      <Text className="text-black text-3xl font-bold mb-4">Task Project</Text>
      <ActivityIndicator size="large" color={COLORS.BLACK} />
    </View>

    </BaseLayout>
  )
}

export default SplashScreen

const styles = StyleSheet.create({})