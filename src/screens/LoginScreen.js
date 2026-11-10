import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { API_BASE_URL } from '../constants';
import { DARK } from '../theme';

// Đổi màu ở đây là cả màn hình đổi theo.
const COLORS = {
  bg: '#0C1220',
  surface: '#141C2E',
  surfaceFocus: '#182238',
  line: '#243049',
  text: '#EEF1F7',
  muted: '#8A94AB',
  placeholder: '#66718C',
  amber: '#F6B94A',
  amberGlow: 'rgba(246, 185, 74, 0.028)',
  actionBackground: DARK.logoutBackground,
  actionForeground: DARK.logoutText,
  danger: '#FF9A94',
  dangerBg: 'rgba(255, 107, 107, 0.10)',
  dangerLine: 'rgba(255, 107, 107, 0.35)',
};

// Các vòng tròn chồng nhau tạo vầng sáng như ánh đèn bàn học phía trên.
const GLOW_RINGS = [640, 540, 450, 370, 300, 240, 190];
const GLOW_CENTER_Y = 150;

const Field = ({ label, icon, isFocused, inputRef, right, ...inputProps }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrap, isFocused && styles.inputWrapFocused]}>
      <Ionicons
        name={icon}
        size={20}
        color={isFocused ? COLORS.amber : COLORS.muted}
      />
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholderTextColor={COLORS.placeholder}
        selectionColor={COLORS.amber}
        autoCapitalize="none"
        autoCorrect={false}
        {...inputProps}
      />
      {right}
    </View>
  </View>
);

const LoginScreen = ({ onLoginSuccess }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const passwordRef = useRef(null);
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 500,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [enter]);

  const handleLogin = async () => {
    if (isLoading) {
      return;
    }

    if (!studentId.trim() || !password.trim()) {
      setErrorMessage('Enter your Student ID and password.');
      return;
    }

    setErrorMessage('');
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

      // fetch ném TypeError khi không kết nối được (mạng, sai URL, CORS...)
      const isNetworkError = error instanceof TypeError;
      setErrorMessage(
        isNetworkError
          ? 'Không thể kết nối đến BE. Kiểm tra mạng, địa chỉ API hoặc CORS.'
          : error?.message || 'Đã có lỗi xảy ra.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Vầng sáng phía sau */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {GLOW_RINGS.map((size) => (
          <View
            key={size}
            style={[
              styles.glowRing,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                marginLeft: -size / 2,
                top: GLOW_CENTER_Y - size / 2,
              },
            ]}
          />
        ))}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: enter,
                transform: [
                  {
                    translateY: enter.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Logo + tiêu đề */}
            <View style={styles.header}>
              <View style={styles.logo}>
                <Ionicons name="school" size={34} color={COLORS.actionForeground} />
              </View>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Sign in to see your grades, timetable and exam schedule.
              </Text>
            </View>

            {/* Lỗi hiển thị ngay trên giao diện (Alert không chạy trên web) */}
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={20} color={COLORS.danger} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Form */}
            <Field
              label="Student ID"
              icon="person-outline"
              isFocused={focusedField === 'id'}
              value={studentId}
              onChangeText={setStudentId}
              onFocus={() => setFocusedField('id')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter your Student ID"
              editable={!isLoading}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
            />

            <Field
              label="Password"
              icon="lock-closed-outline"
              isFocused={focusedField === 'password'}
              inputRef={passwordRef}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              editable={!isLoading}
              returnKeyType="go"
              onSubmitEditing={handleLogin}
              right={
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.muted}
                  />
                </TouchableOpacity>
              }
            />

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={isLoading}
              accessibilityRole="button"
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color={COLORS.actionForeground} />
                  <Text style={styles.buttonText}>Signing in…</Text>
                </>
              ) : (
                <Text style={styles.buttonText}>Sign in</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
    overflow: 'hidden',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  flex: {
    flex: 1,
  },

  glowRing: {
    position: 'absolute',
    left: '50%',
    backgroundColor: COLORS.amberGlow,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: COLORS.actionBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: COLORS.actionBackground,
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 300,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: COLORS.dangerBg,
    borderWidth: 1,
    borderColor: COLORS.dangerLine,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  errorText: {
    flex: 1,
    color: COLORS.danger,
    fontSize: 14,
    lineHeight: 20,
  },

  field: {
    marginBottom: 18,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 54,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 14,
  },
  inputWrapFocused: {
    borderColor: COLORS.amber,
    backgroundColor: COLORS.surfaceFocus,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    color: COLORS.text,
    fontSize: 16,
    ...Platform.select({
      web: { outlineStyle: 'none', outlineWidth: 0 },
    }),
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 56,
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: COLORS.actionBackground,
    shadowColor: COLORS.actionBackground,
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  buttonText: {
    color: COLORS.actionForeground,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});

export default LoginScreen;