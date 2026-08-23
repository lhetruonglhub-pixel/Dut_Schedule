import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles';
import { LIGHT, DARK } from '../theme';
import { useResetScroll } from '../hooks/useResetScroll';
import { normalizeText } from '../utils/text';

const GradeScreen = ({ isActive, resetSignal, darkMode, studentData }) => {
  const scrollRef = useResetScroll(isActive, resetSignal);
  const theme = darkMode ? DARK : LIGHT;

  /*
    ====================================================
    TỔNG HỢP KẾT QUẢ

    BE trả:
    tong_hop_ket_qua = [học kỳ 1, học kỳ 2, học kỳ 3, ...]

    Bản ghi cuối cùng được xem là học kỳ hiện tại / mới nhất.
    ====================================================
  */

  const summaries = Array.isArray(studentData?.tong_hop_ket_qua)
    ? studentData.tong_hop_ket_qua
    : [];

  const latestSummary = summaries.length > 0 ? summaries[summaries.length - 1] : null;

  const cumulativeGPA = latestSummary?.diem_tbc_tich_luy_thang_4 || '--';

  const currentSemester = latestSummary?.hoc_ky || '';

  /*
    ====================================================
    LỌC MÔN CỦA HỌC KỲ HIỆN TẠI
    ====================================================
  */

  const allGrades = Array.isArray(studentData?.chi_tiet_mon_hoc)
    ? studentData.chi_tiet_mon_hoc
    : [];

  const currentSemesterGrades = useMemo(() => {
    if (!currentSemester) {
      /*
        Nếu BE không trả học kỳ ở tổng hợp thì fallback:
        lấy các môn mới nhất.
      */
      return allGrades;
    }

    const target = normalizeText(currentSemester);

    const filtered = allGrades.filter((grade) => {
      const gradeSemester = normalizeText(grade?.hoc_ky);

      if (!gradeSemester) {
        return false;
      }

      if (gradeSemester === target) {
        return true;
      }

      /*
        Fallback: có thể BE trả "1" trong khi tổng hợp: "HK1"
        Hoặc format có thêm text. Kiểm tra các số học kỳ.
      */

      const targetNumbers = target.match(/\d+/g);
      const gradeNumbers = gradeSemester.match(/\d+/g);

      if (
        targetNumbers &&
        gradeNumbers &&
        targetNumbers.length > 0 &&
        gradeNumbers.length > 0
      ) {
        const targetLast = targetNumbers[targetNumbers.length - 1];
        const gradeLast = gradeNumbers[gradeNumbers.length - 1];

        return targetLast === gradeLast;
      }

      return gradeSemester.includes(target) || target.includes(gradeSemester);
    });

    return filtered;
  }, [allGrades, currentSemester]);

  const courseCount = currentSemesterGrades.length;

  return (
    <View style={[styles.sceneContainer, { backgroundColor: theme.background }]}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.sceneContent}
      >
        {/* HEADER */}
        <View style={styles.screenHeader}>
          <Text style={[styles.screenTitle, { color: theme.primary }]}>My Grades</Text>
        </View>

        {/* TỔNG ĐIỂM */}
        <View style={[styles.gpaCard, { backgroundColor: darkMode ? '#30283A' : '#DCCFEA' }]}>
          <View>
            <Text style={[styles.gpaTitle, { color: theme.secondary }]}>Cumulative GPA</Text>
            <Text style={[styles.gpaScore, { color: theme.primary }]}>{cumulativeGPA}</Text>
            <Text style={[styles.gpaScale, { color: theme.secondary }]}>out of 4.00</Text>
          </View>

          <View style={[styles.gpaCircle, { backgroundColor: theme.card }]}>
            <Text style={[styles.gpaCircleScore, { color: theme.primary }]}>
              {cumulativeGPA !== '--'
                ? `${Math.round(Number(String(cumulativeGPA).replace(',', '.')) * 25)}%`
                : '--'}
            </Text>
            <Text style={[styles.gpaCircleText, { color: theme.secondary }]}>Overall</Text>
          </View>
        </View>

        {/* HỌC KỲ HIỆN TẠI */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            {currentSemester || 'Current Semester'}
          </Text>
          <Text style={[styles.sectionLink, { color: theme.secondary }]}>
            {courseCount} {courseCount === 1 ? 'course' : 'courses'}
          </Text>
        </View>

        {/* ĐIỂM CÁC MÔN CỦA HỌC KỲ HIỆN TẠI */}
        {currentSemesterGrades.length > 0 ? (
          currentSemesterGrades.map((grade, index) => (
            <View
              key={`${grade?.ma_hoc_phan || 'grade'}-${index}`}
              style={[styles.gradeRow, { backgroundColor: theme.card }]}
            >
              <View
                style={[
                  styles.gradeIcon,
                  { backgroundColor: darkMode ? '#263A36' : '#D7E8E4' },
                ]}
              >
                <MaterialCommunityIcons
                  name="book-open-page-variant-outline"
                  size={21}
                  color={theme.primary}
                />
              </View>

              <View style={styles.gradeInfo}>
                <Text
                  style={[styles.gradeSubject, { color: theme.primary }]}
                  numberOfLines={2}
                >
                  {grade?.ten_hoc_phan || 'Unknown subject'}
                </Text>
                <Text style={[styles.gradeCode, { color: theme.secondary }]}>
                  {grade?.ma_hoc_phan || 'N/A'}
                </Text>
              </View>

              <View style={styles.gradeRight}>
                <Text style={[styles.gradeNumber, { color: theme.primary }]}>
                  {grade?.diem_thang_10 || '--'}
                </Text>
                <View
                  style={[
                    styles.gradeLetter,
                    { backgroundColor: darkMode ? '#30283A' : '#DCCFEA' },
                  ]}
                >
                  <Text style={[styles.gradeLetterText, { color: theme.primary }]}>
                    {grade?.diem_chu || '--'}
                  </Text>
                </View>
              </View>
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
              <MaterialCommunityIcons
                name="book-open-outline"
                size={27}
                color={theme.primary}
              />
            </View>

            <Text style={[styles.emptyTitle, { color: theme.primary }]}>
              No grades available
            </Text>

            <Text style={[styles.emptyDescription, { color: theme.secondary }]}>
              No grade records were found for the current semester.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default GradeScreen;