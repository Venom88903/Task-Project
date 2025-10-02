import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BaseLayout from '../../components/BaseLayout';
import { STACK_ROUTES } from '../../navigation/StackRoutes';
import { COLORS } from '../../utils/color';
import { registerUser } from '../../service/api';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Password Validation
  const validatePassword = (value) => {
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

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (passwordError) {
      Alert.alert('Error', passwordError);
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser(email, password);

      // Handle structured API response
      if (response.success) {
        Alert.alert('Success', response.message || 'Account created successfully!');
        setEmail('');
        setPassword('');
        navigation.navigate(STACK_ROUTES.LOGIN_SCREEN);
      } else {
        Alert.alert(
          `Error ${response.error_code || ''}`,
          response.message || 'Registration failed'
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
        <Text className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </Text>

        <View className="mb-4">
          <Text className="text-gray-700 mb-2">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-xl p-3 text-gray-800"
            placeholder="Enter email"
            placeholderTextColor="#999"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 mb-2">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-xl p-3 text-gray-800"
            placeholder="Enter password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={validatePassword}
            keyboardType="numeric"
          />
          {passwordError ? (
            <Text className="text-red-500 mt-1">{passwordError}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          className="bg-blue-500 py-3 rounded-xl"
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.BLACK} />
          ) : (
            <Text className="text-center text-white font-semibold text-lg">
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4"
          onPress={() => navigation.navigate(STACK_ROUTES.LOGIN_SCREEN)}
        >
          <Text className="text-center text-gray-500">
            Already have an account?{' '}
            <Text className="text-blue-700 font-semibold">Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </BaseLayout>
  );
}
