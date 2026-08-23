import React, { useState } from 'react';
import { Dimensions, SafeAreaView } from 'react-native';
import { TabView } from 'react-native-tab-view';

import styles from './src/styles';
import { LIGHT, DARK } from './src/theme';
import { EMPTY_STUDENT_DATA } from './src/constants';

import LoginScreen from './src/screens/LoginScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import ExamScreen from './src/screens/ExamScreen';
import GradeScreen from './src/screens/GradeScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// ==========================================
// CHỈ THÊM SPLASH SCREEN
// ==========================================
import SplashScreen from './src/components/SplashScreen';

export default function App() {
  // ==========================================
  // CHỈ THÊM STATE NÀY
  // ==========================================
  const [showSplash, setShowSplash] = useState(true);

  // ==========================================
  // TOÀN BỘ CODE CŨ CỦA BẠN - GIỮ NGUYÊN
  // ==========================================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userStudentId, setUserStudentId] = useState('');
  const [studentData, setStudentData] = useState(EMPTY_STUDENT_DATA);
  const [index, setIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);
  const [resetSignal, setResetSignal] = useState(0);

  const [routes] = useState([
    { key: 'schedule', title: 'Schedule' },
    { key: 'exam', title: 'Exams' },
    { key: 'grade', title: 'Grades' },
    { key: 'profile', title: 'Profile' },
  ]);

  const handleTabChange = (nextIndex) => {
    setResetSignal((previous) => previous + 1);
    setIndex(nextIndex);
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'schedule':
        return (
          <ScheduleScreen
            isActive={index === 0}
            resetSignal={resetSignal}
            darkMode={darkMode}
            studentData={studentData}
          />
        );

      case 'exam':
        return (
          <ExamScreen
            isActive={index === 1}
            resetSignal={resetSignal}
            darkMode={darkMode}
            studentData={studentData}
          />
        );

      case 'grade':
        return (
          <GradeScreen
            isActive={index === 2}
            resetSignal={resetSignal}
            darkMode={darkMode}
            studentData={studentData}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            userStudentId={userStudentId}
            isActive={index === 3}
            resetSignal={resetSignal}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            avatarUri={avatarUri}
            setAvatarUri={setAvatarUri}
            studentData={studentData}
            onLogout={() => {
              setIsLoggedIn(false);
              setUserStudentId('');
              setStudentData(EMPTY_STUDENT_DATA);
              setIndex(0);
              setResetSignal((previous) => previous + 1);
            }}
          />
        );

      default:
        return null;
    }
  };

  // ==========================================
  // SPLASH - PHẦN DUY NHẤT CHÈN VÀO
  // ==========================================
  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => {
          setShowSplash(false);
        }}
      />
    );
  }

  // ==========================================
  // LOGIN - GIỮ NGUYÊN 100%
  // ==========================================
  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLoginSuccess={(studentId, data) => {
          setUserStudentId(studentId);
          setStudentData(data);
          setIndex(0);
          setResetSignal((previous) => previous + 1);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  // ==========================================
  // MAIN APP - GIỮ NGUYÊN 100%
  // ==========================================
  return (
    <SafeAreaView
      style={[
        styles.appContainer,
        {
          backgroundColor: darkMode
            ? DARK.background
            : LIGHT.background,
        },
      ]}
    >
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={handleTabChange}
        initialLayout={{
          width: Dimensions.get('window').width,
        }}
        renderTabBar={() => null}
        swipeEnabled={true}
        lazy={false}
        animationEnabled={true}
      />
    </SafeAreaView>
  );
}