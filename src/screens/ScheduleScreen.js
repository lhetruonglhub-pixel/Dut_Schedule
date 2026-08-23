import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles';
import { LIGHT, DARK } from '../theme';
import { WEEK_1_START_DATE } from '../constants';
import { useResetScroll } from '../hooks/useResetScroll';
import { getLocalDateString, formatDate, parseLocalDate } from '../utils/date';
import { parseTKB } from '../utils/parseTKB';
import { parseWeekList, isCourseActiveInWeek } from '../utils/academicWeek';
import { getScheduleBackground } from '../utils/scheduleColors';

const ScheduleScreen = ({ isActive, resetSignal, darkMode, studentData }) => {
  const scrollRef = useResetScroll(isActive, resetSignal);
  const theme = darkMode ? DARK : LIGHT;

  const [selectedDate, setSelectedDate] = useState(getLocalDateString());

  const scheduleData = useMemo(() => {
    const data = {};
    const source = Array.isArray(studentData?.lich_hoc) ? studentData.lich_hoc : [];

    source.forEach((item, itemIndex) => {
      const tkb = item?.thoi_khoa_bieu || '';
      const tuanHoc = item?.tuan_hoc || '';
      const parsedTKB = parseTKB(tkb);
      const weekday = parsedTKB.weekday;

      if (weekday === null) {
        console.log('Không đọc được thứ từ TKB:', tkb);
        return;
      }

      const activeWeeks = parseWeekList(tuanHoc);
      const weeksToUse =
        activeWeeks.length > 0
          ? activeWeeks
          : Array.from({ length: 52 }, (_, index) => index + 1);

      weeksToUse.forEach((academicWeek) => {
        if (!isCourseActiveInWeek(tuanHoc, academicWeek)) {
          return;
        }

        const week1Start = parseLocalDate(WEEK_1_START_DATE);
        const targetDate = new Date(week1Start);

        targetDate.setDate(week1Start.getDate() + (academicWeek - 1) * 7);

        const offset = weekday === 0 ? 6 : weekday - 1;
        targetDate.setDate(targetDate.getDate() + offset);

        const dateString = formatDate(targetDate);

        const itemData = {
          id: `${item?.ma_hoc_phan || 'course'}-${itemIndex}-${academicWeek}`,
          time: parsedTKB.time,
          subject: item?.ten_hoc_phan || item?.ma_hoc_phan || 'Course',
          room: parsedTKB.room,
          background: getScheduleBackground(darkMode, itemIndex),
          weekday,
          academicWeek,
          code: item?.ma_hoc_phan || '',
          teacher: item?.giang_vien || '',
          credits: item?.so_tin_chi || '',
          tuanHoc,
          originalTKB: tkb,
        };

        if (!data[dateString]) {
          data[dateString] = [];
        }

        data[dateString].push(itemData);
      });
    });

    Object.keys(data).forEach((date) => {
      data[date].sort((a, b) => {
        const aMatch = a.time.match(/\d+/);
        const bMatch = b.time.match(/\d+/);
        const aNumber = aMatch ? Number(aMatch[0]) : 999;
        const bNumber = bMatch ? Number(bMatch[0]) : 999;

        return aNumber - bNumber;
      });
    });

    return data;
  }, [studentData, darkMode]);

  const classesToday = scheduleData[selectedDate] || [];

  const markedDates = useMemo(() => {
    const result = {};

    Object.keys(scheduleData).forEach((date) => {
      result[date] = {
        marked: true,
        dotColor: '#8D76A8',
      };
    });

    result[selectedDate] = {
      ...(result[selectedDate] || {}),
      selected: true,
      selectedColor: darkMode ? '#FFFFFF' : '#20242B',
      selectedTextColor: darkMode ? '#20242B' : '#FFFFFF',
    };

    return result;
  }, [scheduleData, selectedDate, darkMode]);

  return (
    <View style={[styles.sceneContainer, { backgroundColor: theme.background }]}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.sceneContent}
        scrollEventThrottle={16}
      >
        <View style={styles.screenHeader}>
          <Text style={[styles.screenTitle, { color: theme.primary }]}>Your Schedule</Text>
        </View>

        <View
          style={[
            styles.calendarCard,
            { backgroundColor: theme.card, borderColor: theme.border },
            darkMode && styles.calendarCardDark,
          ]}
        >
          <Calendar
            current={selectedDate}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
            }}
            firstDay={1}
            enableSwipeMonths={true}
            markedDates={markedDates}
            theme={{
              backgroundColor: theme.card,
              calendarBackground: theme.card,
              textSectionTitleColor: theme.secondary,
              selectedDayBackgroundColor: darkMode ? '#FFFFFF' : '#20242B',
              selectedDayTextColor: darkMode ? '#20242B' : '#FFFFFF',
              todayTextColor: darkMode ? '#FFFFFF' : '#20242B',
              dayTextColor: theme.primary,
              textDisabledColor: darkMode ? '#555A63' : '#C7C7C7',
              dotColor: '#8D76A8',
              selectedDotColor: darkMode ? '#20242B' : '#FFFFFF',
              arrowColor: theme.primary,
              monthTextColor: theme.primary,
              textMonthFontSize: 19,
              textMonthFontWeight: '900',
              textDayFontSize: 13,
              textDayFontWeight: '600',
              textDayHeaderFontSize: 10,
              textDayHeaderFontWeight: '800',
            }}
          />
        </View>

        <View style={[styles.selectedDateCard, { backgroundColor: theme.card }]}>
          <View>
            <Text style={[styles.selectedDateLabel, { color: theme.secondary }]}>
              SELECTED DATE
            </Text>
            <Text style={[styles.selectedDateValue, { color: theme.primary }]}>
              {selectedDate}
            </Text>
          </View>

          <View
            style={[
              styles.classCountBadge,
              { backgroundColor: darkMode ? '#263A36' : '#D7E8E4' },
            ]}
          >
            <Text style={[styles.classCountNumber, { color: theme.primary }]}>
              {classesToday.length}
            </Text>
            <Text style={[styles.classCountText, { color: theme.secondary }]}>
              {classesToday.length === 1 ? 'class' : 'classes'}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Classes</Text>
          <Text style={[styles.sectionLink, { color: theme.secondary }]}>
            {classesToday.length === 0 ? 'Free day' : 'Scheduled'}
          </Text>
        </View>

        {classesToday.length > 0 ? (
          classesToday.map((item) => (
            <View
              key={item.id}
              style={[styles.scheduleCard, { backgroundColor: item.background }]}
            >
              <View style={styles.scheduleTop}>
                <View style={[styles.timeBadge, { backgroundColor: theme.card }]}>
                  <Text style={[styles.timeText, { color: theme.primary }]}>{item.time}</Text>
                </View>
              </View>

              <Text style={[styles.categoryText, { color: theme.secondary }]}>
                {item.category}
              </Text>

              <Text style={[styles.subjectText, { color: theme.primary }]}>{item.subject}</Text>

              <Text style={[styles.detailText, { color: theme.secondary }]}>
                Room {item.room}
              </Text>
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
            <View
              style={[
                styles.emptyIconCircle,
                { backgroundColor: darkMode ? '#263A36' : '#D7E8E4' },
              ]}
            >
              <MaterialCommunityIcons name="check" size={27} color={theme.primary} />
            </View>

            <Text style={[styles.emptyTitle, { color: theme.primary }]}>
              No classes scheduled
            </Text>

            <Text style={[styles.emptyDescription, { color: theme.secondary }]}>
              You have a free day. Enjoy your time!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ScheduleScreen;