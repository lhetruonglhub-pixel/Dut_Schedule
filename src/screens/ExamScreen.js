import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles';
import { LIGHT, DARK } from '../theme';
import { useResetScroll } from '../hooks/useResetScroll';
import {
  parseExamDate,
  getExamTime,
  getExamDateNumber,
  getExamMonth,
  getDaysUntil,
} from '../utils/exam';

const ExamScreen = ({ isActive, resetSignal, darkMode, studentData }) => {
  const scrollRef = useResetScroll(isActive, resetSignal);
  const theme = darkMode ? DARK : LIGHT;

  const exams = useMemo(() => {
    const source = Array.isArray(studentData?.lich_thi) ? studentData.lich_thi : [];

    return source
      .map((item, index) => {
        const raw = item?.lich_thi_cuoi_ky || '';
        const date = parseExamDate(raw);

        return {
          id: `${item?.ma_hoc_phan || 'exam'}-${index}`,
          subject: item?.ten_hoc_phan || item?.ma_hoc_phan || 'Examination',
          code: item?.ma_hoc_phan || '',
          date,
          dateNumber: getExamDateNumber(date),
          month: getExamMonth(date),
          time: getExamTime(raw),
          room: 'Chưa có phòng',
          group: item?.nhom_thi || '',
          shared: item?.thi_chung || '',
          raw,
        };
      })
      .sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;

        return a.date.getTime() - b.date.getTime();
      });
  }, [studentData]);

  const mainExam = exams.length > 0 ? exams[0] : null;

  return (
    <View style={[styles.sceneContainer, { backgroundColor: theme.background }]}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.sceneContent}
      >
        <View style={styles.screenHeader}>
          <Text style={[styles.screenTitle, { color: theme.primary }]}>Examinations</Text>
        </View>

        <Text style={[styles.pageDescription, { color: theme.secondary }]}>
          Your upcoming examination schedule
        </Text>

        {mainExam ? (
          <View
            style={[styles.examCard, { backgroundColor: darkMode ? '#30283A' : '#DCCFEA' }]}
          >
            <View style={styles.examTop}>
              <View style={[styles.examIcon, { backgroundColor: theme.card }]}>
                <MaterialCommunityIcons
                  name="clipboard-text-outline"
                  size={23}
                  color={theme.primary}
                />
              </View>

              <View style={styles.examTitleBox}>
                <Text style={[styles.examCategory, { color: theme.secondary }]}>
                  FINAL EXAMINATION
                </Text>
                <Text style={[styles.examSubject, { color: theme.primary }]}>
                  {mainExam.subject}
                </Text>
              </View>

              <View style={[styles.daysBadge, { backgroundColor: theme.card }]}>
                <Text style={[styles.daysNumber, { color: theme.primary }]}>
                  {mainExam.date ? Math.max(0, getDaysUntil(mainExam.date) ?? 0) : '--'}
                </Text>
                <Text style={[styles.daysText, { color: theme.secondary }]}>days</Text>
              </View>
            </View>

            <View style={styles.examInfoRow}>
              <MaterialCommunityIcons name="clock-outline" size={16} color={theme.secondary} />
              <Text style={[styles.examInfo, { color: theme.secondary }]}>{mainExam.time}</Text>
            </View>

            <View style={styles.examInfoRow}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={16}
                color={theme.secondary}
              />
              <Text style={[styles.examInfo, { color: theme.secondary }]}>{mainExam.room}</Text>
            </View>

            <View style={styles.examBottom}>
              <Text style={[styles.seatText, { color: theme.primary }]}>
                {mainExam.code || 'Examination'}
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={[styles.examCard, { backgroundColor: darkMode ? '#30283A' : '#DCCFEA' }]}
          >
            <View style={styles.examTop}>
              <View style={[styles.examIcon, { backgroundColor: theme.card }]}>
                <MaterialCommunityIcons
                  name="clipboard-text-outline"
                  size={23}
                  color={theme.primary}
                />
              </View>

              <View style={styles.examTitleBox}>
                <Text style={[styles.examCategory, { color: theme.secondary }]}>
                  FINAL EXAMINATION
                </Text>
                <Text style={[styles.examSubject, { color: theme.primary }]}>No exam data</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Upcoming Exams</Text>
          <Text style={[styles.sectionLink, { color: theme.secondary }]}>View all</Text>
        </View>

        {exams.length > 0 ? (
          exams.map((exam, index) => (
            <View key={exam.id} style={[styles.upcomingCard, { backgroundColor: theme.card }]}>
              <View
                style={[
                  styles.examDateBox,
                  {
                    backgroundColor:
                      index % 3 === 0
                        ? darkMode
                          ? '#263A36'
                          : '#D7E8E4'
                        : index % 3 === 1
                        ? darkMode
                          ? '#30283A'
                          : '#DCCFEA'
                        : darkMode
                        ? '#293242'
                        : '#CCD7EF',
                  },
                ]}
              >
                <Text style={[styles.examDateNumber, { color: theme.primary }]}>
                  {exam.dateNumber}
                </Text>
                <Text style={[styles.examDateMonth, { color: theme.secondary }]}>
                  {exam.month}
                </Text>
              </View>

              <View style={styles.upcomingInfo}>
                <Text style={[styles.upcomingTitle, { color: theme.primary }]}>
                  {exam.subject}
                </Text>
                <Text style={[styles.upcomingDetail, { color: theme.secondary }]}>
                  {exam.time}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.upcomingCard, { backgroundColor: theme.card }]}>
            <View
              style={[
                styles.examDateBox,
                { backgroundColor: darkMode ? '#263A36' : '#D7E8E4' },
              ]}
            >
              <Text style={[styles.examDateNumber, { color: theme.primary }]}>--</Text>
              <Text style={[styles.examDateMonth, { color: theme.secondary }]}>---</Text>
            </View>

            <View style={styles.upcomingInfo}>
              <Text style={[styles.upcomingTitle, { color: theme.primary }]}>
                No examination schedule
              </Text>
              <Text style={[styles.upcomingDetail, { color: theme.secondary }]}>
                No exam data available
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ExamScreen;