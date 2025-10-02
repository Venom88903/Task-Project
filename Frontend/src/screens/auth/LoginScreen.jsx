import '../../../global.css';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import BaseLayout from '../../components/BaseLayout';
import { STACK_ROUTES } from '../../navigation/StackRoutes';
import { loginUser } from '../../service/api';
import { COLORS } from '../../utils/color';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = value => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setPassword(numericValue);

    if (numericValue.length < 6) {
      setPasswordError('Password must be 6 digits');
    } else if (numericValue.length > 6) {
      setPasswordError('Password cannot exceed 6 digits');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (passwordError) {
      Alert.alert('Error', passwordError);
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser(email, password);

      // ✅ Handle structured API response
      if (response.success) {
        Alert.alert('Success', response.message || 'Login successful');

        // Save token in AsyncStorage
        await AsyncStorage.setItem("access_token", response.data.access_token);

        navigation.replace(STACK_ROUTES.HOME_SCREEN);
      } else {
        Alert.alert(
          `Error ${response.error_code || ''}`,
          response.message || 'Login failed'
        );
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseLayout>
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold text-center text-blue-600 mb-10">
          Welcome Back 👋
        </Text>

        <View className="mb-4">
          <Text className="text-gray-700 mb-2">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="mb-2">
          <Text className="text-gray-700 mb-2">Password</Text>
          <TextInput
            className={`border rounded-xl px-4 py-3 ${
              passwordError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter 6-digit password"
            value={password}
            onChangeText={validatePassword}
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
          />
          {passwordError ? (
            <Text className="text-red-500 mt-1 text-sm">{passwordError}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="bg-blue-600 rounded-xl py-3 items-center mt-4"
        >
          {loading ? (
            <ActivityIndicator size={'small'} color={COLORS.BLACK} />
          ) : (
            <Text className="text-white text-lg font-semibold">Login</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Don’t have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(STACK_ROUTES.REGISTER_SCREEN)}
          >
            <Text className="text-blue-600 font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BaseLayout>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
