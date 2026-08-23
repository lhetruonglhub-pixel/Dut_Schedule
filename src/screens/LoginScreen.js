import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';

import styles from '../styles';
import { API_BASE_URL } from '../constants';

const LoginScreen = ({ onLoginSuccess }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!studentId.trim() || !password.trim()) {
      Alert.alert('Missing information', 'Please enter your Student ID and Password.');
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('================================');
      console.log('LOGIN START');
      console.log('API:', `${API_BASE_URL}/api/lay-thong-tin`);
      console.log('USERNAME:', studentId.trim());

      const response = await fetch(`${API_BASE_URL}/api/lay-thong-tin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username: studentId.trim(),
          password: password,
        }),
      });

      console.log('HTTP STATUS:', response.status);

      const rawText = await response.text();
      console.log('RAW RESPONSE:', rawText);

      let result;
      try {
        result = JSON.parse(rawText);
      } catch {
        throw new Error(`BE không trả JSON hợp lệ. HTTP ${response.status}.`);
      }

      if (!response.ok) {
        throw new Error(result?.error || `BE trả về HTTP ${response.status}`);
      }

      const studentData = {
        tong_hop_ket_qua: Array.isArray(result?.tong_hop_ket_qua) ? result.tong_hop_ket_qua : [],
        chi_tiet_mon_hoc: Array.isArray(result?.chi_tiet_mon_hoc) ? result.chi_tiet_mon_hoc : [],
        lich_hoc: Array.isArray(result?.lich_hoc) ? result.lich_hoc : [],
        lich_thi: Array.isArray(result?.lich_thi) ? result.lich_thi : [],
      };

      console.log('Tong hop:', studentData.tong_hop_ket_qua.length);
      console.log('Chi tiet:', studentData.chi_tiet_mon_hoc.length);
      console.log('Lich hoc:', studentData.lich_hoc.length);
      console.log('Lich thi:', studentData.lich_thi.length);
      console.log('LOGIN SUCCESS');
      console.log('================================');

      onLoginSuccess(studentId.trim(), studentData);
    } catch (error) {
      console.log('LOGIN ERROR:', error);
      console.log('ERROR MESSAGE:', error?.message);

      Alert.alert('Login error', error?.message || 'Không thể kết nối đến BE.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.loginContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.loginContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ILLUSTRATION */}
        <View style={styles.loginIllustration}>
          <Text style={styles.loginStar1}>✦</Text>
          <Text style={styles.loginStar2}>✦</Text>
          <Text style={styles.loginStar3}>✦</Text>
          <Text style={styles.loginStar4}>✦</Text>

          <View style={styles.bookGlow} />

          <View style={styles.booksContainer}>
            <View style={styles.bookTop}>
              <View style={styles.bookTopCover} />
              <View style={styles.bookTopPages}>
                <View style={styles.pageLine} />
                <View style={styles.pageLine} />
                <View style={styles.pageLine} />
              </View>
              <View style={styles.bookTopBottom} />
            </View>

            <View style={styles.bookMiddle}>
              <View style={styles.bookMiddlePages}>
                <View style={styles.bookMiddleLine} />
                <View style={styles.bookMiddleLine} />
                <View style={styles.bookMiddleLine} />
              </View>
              <View style={styles.bookMiddleCover} />
            </View>

            <View style={styles.bookBottom}>
              <View style={styles.bookBottomCover} />
              <View style={styles.bookBottomPages}>
                <View style={styles.pageLine} />
                <View style={styles.pageLine} />
                <View style={styles.pageLine} />
              </View>
              <View style={styles.bookBottomEdge} />
            </View>
          </View>
        </View>

        {/* LOGIN CARD */}
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>Welcome Back</Text>
          <Text style={styles.loginDescription}>Sign in to continue.</Text>

          <Text style={styles.inputLabel}>Student ID</Text>
          <TextInput
            style={styles.input}
            value={studentId}
            onChangeText={setStudentId}
            placeholder="Student ID"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            <Text style={styles.loginBtnText}>
              {isLoading ? 'Signing In...' : 'Get Started'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;