import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles';
import { LIGHT, DARK } from '../theme';
import { WEEK_1_START_DATE } from '../constants';
import { useResetScroll } from '../hooks/useResetScroll';
import {
  getLocalDateString,
  formatDate,
  parseLocalDate,
} from '../utils/date';
import { parseTKB } from '../utils/parseTKB';
import {
  parseWeekList,
  isCourseActiveInWeek,
} from '../utils/academicWeek';
import { getScheduleBackground } from '../utils/scheduleColors';

const ScheduleScreen = ({
  isActive,
  resetSignal,
  darkMode,
  studentData,
}) => {
  const scrollRef = useResetScroll(isActive, resetSignal);
  const theme = darkMode ? DARK : LIGHT;

  const [selectedDate, setSelectedDate] = useState(
    getLocalDateString()
  );

  const scheduleData = useMemo(() => {
    const data = {};

    const source = Array.isArray(studentData?.lich_hoc)
      ? studentData.lich_hoc
      : [];

    source.forEach((item, itemIndex) => {
      const tkb = item?.thoi_khoa_bieu || '';
      const tuanHoc = item?.tuan_hoc || '';

      const parsedTKB = parseTKB(tkb);
      const weekday = parsedTKB.weekday;

      if (weekday === null) {
        console.log(
          'Không đọc được thứ từ TKB:',
          tkb
        );
        return;
      }

      const activeWeeks = parseWeekList(tuanHoc);

      const weeksToUse =
        activeWeeks.length > 0
          ? activeWeeks
          : Array.from(
              { length: 52 },
              (_, index) => index + 1
            );

      weeksToUse.forEach((academicWeek) => {
        if (
          !isCourseActiveInWeek(
            tuanHoc,
            academicWeek
          )
        ) {
          return;
        }

        const week1Start =
          parseLocalDate(WEEK_1_START_DATE);

        const targetDate = new Date(week1Start);

        targetDate.setDate(
          week1Start.getDate() +
            (academicWeek - 1) * 7
        );

        const offset =
          weekday === 0 ? 6 : weekday - 1;

        targetDate.setDate(
          targetDate.getDate() + offset
        );

        const dateString = formatDate(targetDate);

        const itemData = {
          id: `${item?.ma_hoc_phan || 'course'}-${itemIndex}-${academicWeek}`,

          time: parsedTKB.time,

          subject:
            item?.ten_hoc_phan ||
            item?.ma_hoc_phan ||
            'Course',

          room: parsedTKB.room,

          background: getScheduleBackground(
            darkMode,
            itemIndex
          ),

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

        const aNumber = aMatch
          ? Number(aMatch[0])
          : 999;

        const bNumber = bMatch
          ? Number(bMatch[0])
          : 999;

        return aNumber - bNumber;
      });
    });

    return data;
  }, [studentData, darkMode]);

  const classesToday =
    scheduleData[selectedDate] || [];

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

      selectedColor: darkMode
        ? '#FFFFFF'
        : '#20242B',

      selectedTextColor: darkMode
        ? '#20242B'
        : '#FFFFFF',
    };

    return result;
  }, [
    scheduleData,
    selectedDate,
    darkMode,
  ]);

  // ==========================================
  // CALENDAR THEME
  // ==========================================

  const calendarTheme = useMemo(
    () => ({
      backgroundColor: theme.card,
      calendarBackground: theme.card,

      textSectionTitleColor: theme.secondary,

      textSectionTitleDisabledColor: darkMode
        ? '#3A3F47'
        : '#D9D9D9',

      selectedDayBackgroundColor: darkMode
        ? '#FFFFFF'
        : '#20242B',

      selectedDayTextColor: darkMode
        ? '#20242B'
        : '#FFFFFF',

      todayTextColor: darkMode
        ? '#FFFFFF'
        : '#20242B',

      todayBackgroundColor: darkMode
        ? '#2A2F37'
        : '#EFEFEF',

      dayTextColor: theme.primary,

      textDisabledColor: darkMode
        ? '#4A4F58'
        : '#C7C7C7',

      dotColor: '#8D76A8',

      selectedDotColor: darkMode
        ? '#20242B'
        : '#FFFFFF',

      arrowColor: theme.primary,

      disabledArrowColor: darkMode
        ? '#3A3F47'
        : '#D9D9D9',

      indicatorColor: theme.primary,

      monthTextColor: theme.primary,

      textMonthFontSize: 19,
      textMonthFontWeight: '900',

      textDayFontSize: 13,
      textDayFontWeight: '600',

      textDayHeaderFontSize: 10,
      textDayHeaderFontWeight: '800',
    }),
    [theme, darkMode]
  );

  return (
    <View
      style={[
        styles.sceneContainer,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.sceneContent}
        scrollEventThrottle={16}
      >
        {/* HEADER */}
        {/* <View style={styles.screenHeader}>
          <Text
            style={[
              styles.screenTitle,
              {
                color: theme.primary,
              },
            ]}
          >
            Your Schedule
          </Text>
        </View> */}

        {/* CALENDAR */}
        <View
          style={[
            styles.calendarCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },

            darkMode &&
              styles.calendarCardDark,

            {
              overflow: 'hidden',
            },
          ]}
        >
          <Calendar
            key={
              darkMode
                ? 'calendar-dark'
                : 'calendar-light'
            }

            current={selectedDate}

            onDayPress={(day) => {
              setSelectedDate(day.dateString);
            }}

            firstDay={1}

            enableSwipeMonths={true}

            markedDates={markedDates}

            style={{
              backgroundColor: theme.card,
            }}

            theme={calendarTheme}
          />
        </View>

        {/* SELECTED DATE */}
        <View
          style={[
            styles.selectedDateCard,
            {
              backgroundColor: theme.card,
            },
          ]}
        >
          <View>
            <Text
              style={[
                styles.selectedDateLabel,
                {
                  color: theme.secondary,
                },
              ]}
            >
              SELECTED DATE
            </Text>

            <Text
              style={[
                styles.selectedDateValue,
                {
                  color: theme.primary,
                },
              ]}
            >
              {selectedDate}
            </Text>
          </View>

          <View
            style={[
              styles.classCountBadge,
              {
                backgroundColor: darkMode
                  ? '#263A36'
                  : '#D7E8E4',
              },
            ]}
          >
            <Text
              style={[
                styles.classCountNumber,
                {
                  color: theme.primary,
                },
              ]}
            >
              {classesToday.length}
            </Text>

            <Text
              style={[
                styles.classCountText,
                {
                  color: theme.secondary,
                },
              ]}
            >
              {classesToday.length === 1
                ? 'class'
                : 'classes'}
            </Text>
          </View>
        </View>

        {/* SECTION HEADER */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.primary,
              },
            ]}
          >
            Classes
          </Text>

          <Text
            style={[
              styles.sectionLink,
              {
                color: theme.secondary,
              },
            ]}
          >
            {classesToday.length === 0
              ? 'Free day'
              : 'Scheduled'}
          </Text>
        </View>

        {/* CLASSES */}
        {classesToday.length > 0 ? (
          classesToday.map((item) => (
            <View
              key={item.id}
              style={[
                styles.scheduleCard,
                {
                  backgroundColor:
                    item.background,
                },
              ]}
            >
              {/* TIME */}
              <View style={styles.scheduleTop}>
                <View
                  style={[
                    styles.timeBadge,
                    {
                      backgroundColor:
                        theme.card,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.timeText,
                      {
                        color: theme.primary,
                      },
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>
              </View>

              {/* CATEGORY */}
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: theme.secondary,
                  },
                ]}
              >
                {item.category}
              </Text>

              {/* SUBJECT */}
              <Text
                style={[
                  styles.subjectText,
                  {
                    color: theme.primary,
                  },
                ]}
              >
                {item.subject}
              </Text>

              {/* ROOM */}
              <View
                style={[
                  styles.timeBadge,
                  localStyles.roomBadge,
                  {
                    backgroundColor:
                      theme.card,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={20}
                  color={theme.secondary}
                  style={localStyles.roomIcon}
                />

                <Text
                  style={[
                    styles.timeText,
                    localStyles.roomText,
                    {
                      color: theme.primary,
                    },
                  ]}
                >
                  Phòng{' '}
                  {item.room ||
                    'Chưa có phòng'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          /* EMPTY STATE */
          <View
            style={[
              styles.emptyState,
              {
                backgroundColor: theme.card,
              },
            ]}
          >
            <View
              style={[
                styles.emptyIconCircle,
                {
                  backgroundColor: darkMode
                    ? '#263A36'
                    : '#D7E8E4',
                },
              ]}
            >
              <MaterialCommunityIcons
                name="check"
                size={27}
                color={theme.primary}
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: theme.primary,
                },
              ]}
            >
              No classes scheduled
            </Text>

            <Text
              style={[
                styles.emptyDescription,
                {
                  color: theme.secondary,
                },
              ]}
            >
              You have a free day. Enjoy your
              time!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// ==============================================
// LOCAL STYLES
// Phần phòng dùng cùng kiểu với timeBadge.
// Chỉ thêm icon và căn ngang.
// ==============================================

const localStyles = StyleSheet.create({
  roomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
  },

  roomIcon: {
    marginRight: 8,
  },

  roomText: {
    fontWeight: '800',
  },
});

export default ScheduleScreen;