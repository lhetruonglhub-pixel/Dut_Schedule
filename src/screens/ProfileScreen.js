import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import styles from '../styles';
import { LIGHT, DARK } from '../theme';
import { useResetScroll } from '../hooks/useResetScroll';

const ProfileScreen = ({
  userStudentId,
  onLogout,
  isActive,
  resetSignal,
  darkMode,
  setDarkMode,
  avatarUri,
  setAvatarUri,
  studentData,
}) => {
  const scrollRef = useResetScroll(isActive, resetSignal);
  const theme = darkMode ? DARK : LIGHT;

  const [notifications, setNotifications] = useState(true);

  const pickAvatar = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission required',
          'Please allow access to your photos to choose an avatar.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to select the image.');
    }
  };

  const courseCount = Array.isArray(studentData?.chi_tiet_mon_hoc)
    ? studentData.chi_tiet_mon_hoc.length
    : 0;

  const summaries = Array.isArray(studentData?.tong_hop_ket_qua)
    ? studentData.tong_hop_ket_qua
    : [];

  const latestSummary = summaries.length > 0 ? summaries[summaries.length - 1] : null;

  const profileGPA = latestSummary?.diem_tbc_tich_luy_thang_4 || '--';

  const attendance = '--';

  return (
    <View style={[styles.sceneContainer, { backgroundColor: theme.background }]}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.sceneContent}
      >
        <View style={styles.screenHeader}>
          <Text style={[styles.screenTitle, { color: theme.primary }]}>Profile</Text>
        </View>

        <View
          style={[styles.profileCard, { backgroundColor: darkMode ? '#30283A' : '#DCCFEA' }]}
        >
          <TouchableOpacity
            style={[styles.avatar, { backgroundColor: theme.card }]}
            onPress={pickAvatar}
            activeOpacity={0.85}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <MaterialCommunityIcons name="account" size={48} color={theme.primary} />
            )}

            <View style={[styles.avatarEdit, { backgroundColor: theme.primary }]}>
              <MaterialCommunityIcons
                name="camera"
                size={14}
                color={darkMode ? '#20242B' : '#FFFFFF'}
              />
            </View>
          </TouchableOpacity>

          <Text style={[styles.profileName, { color: theme.primary }]}>Alex Student</Text>

          <Text style={[styles.profileId, { color: theme.secondary }]}>
            Student ID: {userStudentId}
          </Text>

          <View style={[styles.profileBadge, { backgroundColor: theme.card }]}>
            <Text style={[styles.profileBadgeText, { color: theme.primary }]}>
              COMPUTER SCIENCE
            </Text>
          </View>

          <Text style={[styles.changeAvatarText, { color: theme.secondary }]}>
            Tap photo to change avatar
          </Text>
        </View>

        <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>{courseCount}</Text>
            <Text style={[styles.statLabel, { color: theme.secondary }]}>Courses</Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>{attendance}</Text>
            <Text style={[styles.statLabel, { color: theme.secondary }]}>Attendance</Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>{profileGPA}</Text>
            <Text style={[styles.statLabel, { color: theme.secondary }]}>GPA</Text>
          </View>
        </View>

        <Text style={[styles.settingsTitle, { color: theme.primary }]}>Settings</Text>

        <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIcon,
                  { backgroundColor: darkMode ? '#2D2735' : '#ECE5F2' },
                ]}
              >
                <MaterialCommunityIcons
                  name={notifications ? 'bell-outline' : 'bell-off-outline'}
                  size={21}
                  color={theme.primary}
                />
              </View>

              <View style={styles.settingTextBox}>
                <Text style={[styles.settingName, { color: theme.primary }]}>
                  Notifications
                </Text>
                <Text style={[styles.settingDescription, { color: theme.secondary }]}>
                  Exam and class reminders
                </Text>
              </View>
            </View>

            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: darkMode ? '#383C43' : '#D4D5D7',
                true: '#8D76A8',
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={darkMode ? '#383C43' : '#D4D5D7'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIcon,
                  { backgroundColor: darkMode ? '#2D2735' : '#ECE5F2' },
                ]}
              >
                <MaterialCommunityIcons
                  name={darkMode ? 'weather-night' : 'weather-sunny'}
                  size={21}
                  color={theme.primary}
                />
              </View>

              <View style={styles.settingTextBox}>
                <Text style={[styles.settingName, { color: theme.primary }]}>Dark Mode</Text>
                <Text style={[styles.settingDescription, { color: theme.secondary }]}>
                  Use dark appearance
                </Text>
              </View>
            </View>

            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{
                false: darkMode ? '#383C43' : '#D4D5D7',
                true: '#8D76A8',
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={darkMode ? '#383C43' : '#D4D5D7'}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: theme.card }]}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: darkMode ? '#263A36' : '#D7E8E4' },
            ]}
          >
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={21}
              color={theme.primary}
            />
          </View>

          <Text style={[styles.actionText, { color: theme.primary }]}>
            Account Information
          </Text>

          <MaterialCommunityIcons name="chevron-right" size={21} color={theme.secondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: theme.card }]}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: darkMode ? '#293242' : '#CCD7EF' },
            ]}
          >
            <MaterialCommunityIcons
              name="help-circle-outline"
              size={21}
              color={theme.primary}
            />
          </View>

          <Text style={[styles.actionText, { color: theme.primary }]}>Help & Support</Text>

          <MaterialCommunityIcons name="chevron-right" size={21} color={theme.secondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: theme.logoutBackground }]}
          onPress={onLogout}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="logout" size={19} color={theme.logoutText} />
          <Text style={[styles.logoutText, { color: theme.logoutText }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;