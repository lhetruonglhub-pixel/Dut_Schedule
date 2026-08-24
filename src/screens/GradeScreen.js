import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles';
import { LIGHT, DARK } from '../theme';
import { useResetScroll } from '../hooks/useResetScroll';
import { normalizeText } from '../utils/text';

const GradeScreen = ({
  isActive,
  resetSignal,
  darkMode,
  studentData,
}) => {
  const scrollRef = useResetScroll(isActive, resetSignal);
  const theme = darkMode ? DARK : LIGHT;

  /*
   ====================================================
   TỔNG HỢP KẾT QUẢ
   ====================================================
  */

  const summaries = Array.isArray(studentData?.tong_hop_ket_qua)
    ? studentData.tong_hop_ket_qua
    : [];

  const latestSummary =
    summaries.length > 0
      ? summaries[summaries.length - 1]
      : null;

  // Overall GPA vẫn lấy từ học kỳ mới nhất
  const cumulativeGPA =
    latestSummary?.diem_tbc_tich_luy_thang_4 || '--';

  /*
   ====================================================
   TẤT CẢ MÔN HỌC
   ====================================================
  */

  const allGrades = Array.isArray(studentData?.chi_tiet_mon_hoc)
    ? studentData.chi_tiet_mon_hoc
    : [];

  /*
   ====================================================
   HELPER
   ====================================================
  */

  const isEmptyGrade = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return true;
    }

    const normalized = String(value)
      .trim()
      .toLowerCase();

    return (
      normalized === 'n/a' ||
      normalized === '--' ||
      normalized === '-' ||
      normalized === 'null' ||
      normalized === 'undefined'
    );
  };

  const formatScore = (value) => {
    if (isEmptyGrade(value)) {
      return '—';
    }

    return String(value).trim();
  };

  /*
   ====================================================
   ĐIỂM THÀNH PHẦN

   BE trả về tối đa 6 loại điểm thành phần: BT (bài tập),
   CK (cuối kỳ), DA (đồ án), GK (giữa kỳ), QT (quá trình),
   TN (thí nghiệm) — nhưng mỗi môn chỉ dùng một tổ hợp con
   tuỳ theo "Công thức điểm" của môn đó, ví dụ:
     [BT]*0.40+[CK]*0.60          -> chỉ BT, CK
     [DA]*0.30+[CK]*0.70          -> chỉ DA, CK
     [BT]*0.10+[GK]*0.20+[TN]*0.10+[CK]*0.60 -> BT, GK, TN, CK

   Đọc theo công thức điểm (cong_thuc_diem) là nguồn xác
   định thành phần cần hiện — phản ánh đúng cấu trúc tính
   điểm của từng môn. Thành phần nào nằm trong công thức
   nhưng chưa có điểm thì vẫn hiện (kèm "—") để biết môn
   còn thiếu điểm gì, thay vì biến mất.

   COMPONENT_VALUE_KEYS ánh xạ mã trong công thức sang đúng
   field điểm tương ứng trả về từ BE.
   ====================================================
  */

  const COMPONENT_VALUE_KEYS = {
    BT: 'diem_bt',
    CK: 'diem_ck',
    DA: 'diem_da',
    GK: 'diem_gk',
    QT: 'diem_qt',
    TN: 'diem_tn',
  };

  const COMPONENT_ORDER = ['BT', 'CK', 'DA', 'GK', 'QT', 'TN'];

  // Đọc công thức (vd "[BT]*0.40+[CK]*0.60") và trả về
  // danh sách mã thành phần theo ĐÚNG thứ tự xuất hiện
  // trong công thức, loại trùng, chỉ giữ mã hợp lệ.
  const parseFormulaComponents = (formula) => {
    if (!formula) {
      return [];
    }

    const matches =
      String(formula).match(/\[([A-Za-z]+)\]/g) || [];

    const seen = new Set();
    const result = [];

    matches.forEach((token) => {
      const code = token
        .replace(/[[\]]/g, '')
        .trim()
        .toUpperCase();

      if (
        COMPONENT_VALUE_KEYS[code] &&
        !seen.has(code)
      ) {
        seen.add(code);
        result.push(code);
      }
    });

    return result;
  };

  // Danh sách thành phần cần hiện cho 1 môn: ưu tiên đọc
  // từ công thức điểm (cong_thuc_diem) của môn đó. Nếu môn
  // không có công thức (hiếm, dữ liệu thiếu), fallback về
  // hiện thành phần nào thực sự có giá trị.
  const getGradeComponents = (grade) => {
    const fromFormula = parseFormulaComponents(
      grade?.cong_thuc_diem
    );

    if (fromFormula.length > 0) {
      return fromFormula;
    }

    return COMPONENT_ORDER.filter(
      (code) => !isEmptyGrade(grade?.[COMPONENT_VALUE_KEYS[code]])
    );
  };

  /*
   ====================================================
   LẤY HỌC KỲ
   ====================================================
  */

  const getSemesterFromObject = (object) => {
    if (!object || typeof object !== 'object') {
      return '';
    }

    const possibleKeys = [
      'hoc_ky',
      'hocky',
      'hocKy',
      'semester',
      'semester_name',
      'ten_hoc_ky',
      'ky_hoc',
      'nam_hoc',
      'namHoc',
    ];

    for (const key of possibleKeys) {
      const value = object?.[key];

      if (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ''
      ) {
        const text = String(value).trim();

        if (/\d+\s*\/\s*\d{4}\s*-\s*\d{4}/.test(text)) {
          return text;
        }
      }
    }

    return '';
  };

  /*
   ====================================================
   SO SÁNH / SORT HỌC KỲ
   ====================================================
  */

  const semesterToNumber = (semester) => {
    if (!semester) {
      return -1;
    }

    const match = String(semester).match(
      /(\d+)\s*\/\s*(\d{4})\s*-\s*(\d{4})/
    );

    if (!match) {
      return -1;
    }

    const semesterNumber = Number(match[1]);
    const startYear = Number(match[2]);
    const endYear = Number(match[3]);

    return (
      endYear * 1000000 +
      startYear * 100 +
      semesterNumber
    );
  };

  function sortSemesters(semesters) {
    return [...new Set(semesters.filter(Boolean))].sort(
      (a, b) => semesterToNumber(b) - semesterToNumber(a)
    );
  }

  /*
   ====================================================
   TÌM HỌC KỲ TỪ LỊCH HỌC
   ====================================================
  */

  const findSemesterInSchedule = (data) => {
    if (!data || typeof data !== 'object') {
      return '';
    }

    const scheduleKeys = [
      'lich_hoc',
      'lichHoc',
      'thoi_khoa_bieu',
      'thoiKhoaBieu',
      'schedule',
      'schedules',
      'classes',
      'current_classes',
      'currentClasses',
      'mon_hoc_hien_tai',
      'monHocHienTai',
    ];

    const foundSemesters = [];

    const collectFromValue = (value) => {
      if (!value) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (!item || typeof item !== 'object') {
            return;
          }

          const semester = getSemesterFromObject(item);

          if (semester) {
            foundSemesters.push(semester);
          }

          Object.values(item).forEach((nestedValue) => {
            if (
              Array.isArray(nestedValue) ||
              (
                nestedValue &&
                typeof nestedValue === 'object'
              )
            ) {
              collectFromValue(nestedValue);
            }
          });
        });

        return;
      }

      if (typeof value === 'object') {
        const semester = getSemesterFromObject(value);

        if (semester) {
          foundSemesters.push(semester);
        }

        Object.values(value).forEach((nestedValue) => {
          if (
            Array.isArray(nestedValue) ||
            (
              nestedValue &&
              typeof nestedValue === 'object'
            )
          ) {
            collectFromValue(nestedValue);
          }
        });
      }
    };

    scheduleKeys.forEach((key) => {
      if (data[key]) {
        collectFromValue(data[key]);
      }
    });

    if (foundSemesters.length === 0) {
      return '';
    }

    return sortSemesters(foundSemesters)[0] || '';
  };

  /*
   ====================================================
   XÁC ĐỊNH HỌC KỲ HIỆN TẠI
   ====================================================
  */

  const currentSemester = useMemo(() => {
    const scheduleSemester =
      findSemesterInSchedule(studentData);

    if (scheduleSemester) {
      return scheduleSemester;
    }

    const semesterGroups = {};

    allGrades.forEach((grade) => {
      const semester = getSemesterFromObject(grade);

      if (!semester) {
        return;
      }

      if (!semesterGroups[semester]) {
        semesterGroups[semester] = [];
      }

      semesterGroups[semester].push(grade);
    });

    const semesters = sortSemesters(
      Object.keys(semesterGroups)
    );

    /*
      Tìm kỳ mới nhất có môn chưa có điểm.
    */
    const semesterWithoutGrades = semesters.find(
      (semester) => {
        const grades = semesterGroups[semester] || [];

        return grades.some((grade) => {
          const score10 = grade?.diem_thang_10;
          const score4 = grade?.diem_thang_4;
          const letter = grade?.diem_chu;

          return (
            isEmptyGrade(score10) &&
            isEmptyGrade(score4) &&
            isEmptyGrade(letter)
          );
        });
      }
    );

    if (semesterWithoutGrades) {
      return semesterWithoutGrades;
    }

    return semesters[0] || '';
  }, [studentData, allGrades]);

  /*
   ====================================================
   GOM CÁC MÔN THEO HỌC KỲ
   ====================================================
  */

  const semesterGroups = useMemo(() => {
    const groups = {};

    allGrades.forEach((grade) => {
      const semester = getSemesterFromObject(grade);

      if (!semester) {
        return;
      }

      if (!groups[semester]) {
        groups[semester] = [];
      }

      groups[semester].push(grade);
    });

    return groups;
  }, [allGrades]);

  /*
   ====================================================
   DANH SÁCH HỌC KỲ
   ====================================================
  */

  const semesterList = useMemo(() => {
    const semesters = Object.keys(semesterGroups);

    if (
      currentSemester &&
      !semesters.includes(currentSemester)
    ) {
      semesters.push(currentSemester);
    }

    return sortSemesters(semesters);
  }, [semesterGroups, currentSemester]);

  /*
   ====================================================
   STATE MỞ / ĐÓNG HỌC KỲ
   ====================================================
  */

  const [expandedSemesters, setExpandedSemesters] =
    useState({});

  const toggleSemester = (semester) => {
    setExpandedSemesters((previous) => ({
      ...previous,
      [semester]:
        previous[semester] === undefined
          ? false
          : !previous[semester],
    }));
  };

  /*
   ====================================================
   CHECK KỲ HIỆN TẠI
   ====================================================
  */

  const isCurrentSemester = (semester) => {
    return (
      normalizeText(semester) ===
      normalizeText(currentSemester)
    );
  };

  /*
   ====================================================
   TÍNH SỐ MÔN KỲ HIỆN TẠI
   ====================================================
  */

  const currentSemesterGrades =
    semesterGroups[currentSemester] || [];

  const currentCourseCount =
    currentSemesterGrades.length;

  /*
   ====================================================
   RENDER
   ====================================================
  */

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
      >
        {/* ==========================================
            HEADER
        ========================================== */}

        <View style={styles.screenHeader}>
          <Text
            style={[
              styles.screenTitle,
              {
                color: theme.primary,
              },
            ]}
          >
            My Grades
          </Text>
        </View>

        {/* ==========================================
            OVERALL GPA
        ========================================== */}

        <View
          style={[
            styles.gpaCard,
            {
              backgroundColor: darkMode
                ? '#30283A'
                : '#DCCFEA',
            },
          ]}
        >
          <View>
            <Text
              style={[
                styles.gpaTitle,
                {
                  color: theme.secondary,
                },
              ]}
            >
              Cumulative GPA
            </Text>

            <Text
              style={[
                styles.gpaScore,
                {
                  color: theme.primary,
                },
              ]}
            >
              {cumulativeGPA}
            </Text>

            <Text
              style={[
                styles.gpaScale,
                {
                  color: theme.secondary,
                },
              ]}
            >
              out of 4.00
            </Text>
          </View>

          <View
            style={[
              styles.gpaCircle,
              {
                backgroundColor: theme.card,
              },
            ]}
          >
            <Text
              style={[
                styles.gpaCircleScore,
                {
                  color: theme.primary,
                },
              ]}
            >
              {cumulativeGPA !== '--'
                ? `${Math.round(
                    Number(
                      String(cumulativeGPA).replace(
                        ',',
                        '.'
                      )
                    ) * 25
                  )}%`
                : '--'}
            </Text>

            <Text
              style={[
                styles.gpaCircleText,
                {
                  color: theme.secondary,
                },
              ]}
            >
              Overall
            </Text>
          </View>
        </View>

        {/* ==========================================
            CURRENT SEMESTER HEADER
        ========================================== */}

        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.primary,
              },
            ]}
          >
            {currentSemester || 'Current Semester'}
          </Text>

          <Text
            style={[
              styles.sectionLink,
              {
                color: theme.secondary,
              },
            ]}
          >
            {currentCourseCount}{' '}
            {currentCourseCount === 1
              ? 'course'
              : 'courses'}
          </Text>
        </View>

        {/* ==========================================
            DANH SÁCH CÁC HỌC KỲ
        ========================================== */}

        {semesterList.length > 0 ? (
          semesterList.map((semester) => {
            const grades =
              semesterGroups[semester] || [];

            const current =
              isCurrentSemester(semester);

            /*
              Mặc định:
              - Kỳ hiện tại: mở
              - Kỳ cũ: đóng

              Sau khi click:
              - Có thể đóng/mở tất cả.
            */
            const expanded =
              expandedSemesters[semester] !== undefined
                ? expandedSemesters[semester]
                : current;

            return (
              <View
                key={semester}
                style={{
                  marginBottom: 14,
                }}
              >
                {/* ====================================
                    SEMESTER HEADER
                ==================================== */}

                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() =>
                    toggleSemester(semester)
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: theme.card,
                    borderRadius: 18,
                    paddingHorizontal: 18,
                    paddingVertical: 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: current
                          ? darkMode
                            ? '#30283A'
                            : '#DCCFEA'
                          : darkMode
                          ? '#263A36'
                          : '#D7E8E4',
                        marginRight: 12,
                      }}
                    >
                      <MaterialCommunityIcons
                        name={
                          current
                            ? 'school-outline'
                            : 'history'
                        }
                        size={22}
                        color={theme.primary}
                      />
                    </View>

                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: '800',
                          color: theme.primary,
                        }}
                      >
                        {semester}
                      </Text>

                      <Text
                        style={{
                          marginTop: 3,
                          fontSize: 13,
                          color: theme.secondary,
                        }}
                      >
                        {grades.length}{' '}
                        {grades.length === 1
                          ? 'course'
                          : 'courses'}
                      </Text>
                    </View>
                  </View>

                  {/* ==================================
                      CURRENT + CHEVRON
                  ================================== */}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    {current && (
                      <View
                        style={{
                          backgroundColor: darkMode
                            ? '#263A36'
                            : '#D7E8E4',
                          borderRadius: 12,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          marginRight: 7,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: '800',
                            color: theme.primary,
                          }}
                        >
                          CURRENT
                        </Text>
                      </View>
                    )}

                    <MaterialCommunityIcons
                      name={
                        expanded
                          ? 'chevron-up'
                          : 'chevron-down'
                      }
                      size={24}
                      color={theme.secondary}
                    />
                  </View>
                </TouchableOpacity>

                {/* ====================================
                    CÁC MÔN
                ==================================== */}

                {expanded && (
                  <View
                    style={{
                      marginTop: 8,
                    }}
                  >
                    {grades.length > 0 ? (
                      grades.map((grade, index) => {
                        const components =
                          getGradeComponents(grade);

                        return (
                          <View
                            key={`${grade?.ma_hoc_phan || 'grade'}-${index}-${semester}`}
                            style={[
                              styles.gradeRow,
                              {
                                backgroundColor:
                                  theme.card,
                                marginBottom: 8,
                                alignItems: 'center',
                              },
                            ]}
                          >
                            {/* ==================================
                                ICON
                            ================================== */}

                            <View
                              style={[
                                styles.gradeIcon,
                                {
                                  backgroundColor:
                                    darkMode
                                      ? '#263A36'
                                      : '#D7E8E4',
                                },
                              ]}
                            >
                              <MaterialCommunityIcons
                                name="book-open-page-variant-outline"
                                size={21}
                                color={theme.primary}
                              />
                            </View>

                            {/* ==================================
                                SUBJECT
                            ================================== */}

                            <View
                              style={[
                                styles.gradeInfo,
                                {
                                  flex: 1,
                                  minWidth: 0,
                                },
                              ]}
                            >
                              {/* TÊN MÔN */}

                              <Text
                                style={[
                                  styles.gradeSubject,
                                  {
                                    color:
                                      theme.primary,
                                  },
                                ]}
                                numberOfLines={2}
                              >
                                {grade?.ten_hoc_phan ||
                                  'Unknown subject'}
                              </Text>

                              {/* MÃ HP */}

                              <Text
                                style={[
                                  styles.gradeCode,
                                  {
                                    marginTop: 3,
                                    color:
                                      theme.secondary,
                                  },
                                ]}
                              >
                                {grade?.ma_hoc_phan ||
                                  'N/A'}
                              </Text>

                              {/* ==================================
                                  ĐIỂM THÀNH PHẦN
                                  Hiển thị đúng theo công
                                  thức điểm (cong_thuc_diem)
                                  của môn — thành phần nào
                                  nằm trong công thức thì
                                  hiện, kể cả khi chưa có
                                  điểm (hiện "—").
                              ================================== */}

                              {components.length > 0 && (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    marginTop: 6,
                                  }}
                                >
                                  {components.map((code) => {
                                    const value =
                                      grade?.[
                                        COMPONENT_VALUE_KEYS[
                                          code
                                        ]
                                      ];

                                    return (
                                      <View
                                        key={code}
                                        style={{
                                          flexDirection: 'row',
                                          alignItems:
                                            'baseline',
                                          backgroundColor:
                                            darkMode
                                              ? '#242229'
                                              : '#F2EFF6',
                                          borderRadius: 8,
                                          paddingHorizontal: 8,
                                          paddingVertical: 4,
                                          marginRight: 6,
                                          marginBottom: 4,
                                        }}
                                      >
                                        <Text
                                          style={{
                                            fontSize: 10,
                                            fontWeight: '800',
                                            color:
                                              theme.secondary,
                                            marginRight: 4,
                                          }}
                                        >
                                          {code}
                                        </Text>

                                        <Text
                                          style={{
                                            fontSize: 12,
                                            fontWeight: '800',
                                            color: isEmptyGrade(
                                              value
                                            )
                                              ? theme.secondary
                                              : theme.primary,
                                          }}
                                        >
                                          {formatScore(value)}
                                        </Text>
                                      </View>
                                    );
                                  })}
                                </View>
                              )}
                            </View>

                            {/* ==================================
                                TỔNG KẾT BÊN PHẢI
                                Luôn hiện đủ 3 dòng: thang
                                10, chữ, thang 4 — rõ ràng,
                                dùng "—" khi thiếu dữ liệu
                                thay vì ẩn đi.
                            ================================== */}

                            <View
                              style={{
                                alignItems: 'flex-end',
                                marginLeft: 10,
                                minWidth: 56,
                              }}
                            >
                              {/* ĐIỂM THANG 10 */}

                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'baseline',
                                }}
                              >
                                <Text
                                  style={[
                                    styles.gradeNumber,
                                    {
                                      color:
                                        theme.primary,
                                    },
                                  ]}
                                >
                                  {formatScore(
                                    grade?.diem_thang_10
                                  )}
                                </Text>

                                <Text
                                  style={{
                                    marginLeft: 2,
                                    fontSize: 11,
                                    color:
                                      theme.secondary,
                                    fontWeight: '700',
                                  }}
                                >
                                  /10
                                </Text>
                              </View>

                              {/* ĐIỂM CHỮ */}

                              <View
                                style={[
                                  styles.gradeLetter,
                                  {
                                    backgroundColor:
                                      darkMode
                                        ? '#30283A'
                                        : '#DCCFEA',
                                    marginTop: 6,
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.gradeLetterText,
                                    {
                                      color:
                                        theme.primary,
                                    },
                                  ]}
                                >
                                  {formatScore(
                                    grade?.diem_chu
                                  )}
                                </Text>
                              </View>

                              {/* ĐIỂM THANG 4 */}

                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'baseline',
                                  marginTop: 6,
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 13,
                                    fontWeight: '800',
                                    color:
                                      theme.primary,
                                  }}
                                >
                                  {formatScore(
                                    grade?.diem_thang_4
                                  )}
                                </Text>

                                <Text
                                  style={{
                                    marginLeft: 2,
                                    fontSize: 10,
                                    color:
                                      theme.secondary,
                                    fontWeight: '700',
                                  }}
                                >
                                  /4
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      })
                    ) : (
                      <View
                        style={[
                          styles.emptyState,
                          {
                            backgroundColor:
                              theme.card,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.emptyIconCircle,
                            {
                              backgroundColor:
                                darkMode
                                  ? '#263A36'
                                  : '#D7E8E4',
                            },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="book-open-outline"
                            size={27}
                            color={theme.primary}
                          />
                        </View>

                        <Text
                          style={[
                            styles.emptyTitle,
                            {
                              color:
                                theme.primary,
                            },
                          ]}
                        >
                          No grades available
                        </Text>

                        <Text
                          style={[
                            styles.emptyDescription,
                            {
                              color:
                                theme.secondary,
                            },
                          ]}
                        >
                          No grade records were found
                          for this semester.
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })
        ) : (
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
                name="book-open-outline"
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
              No grades available
            </Text>

            <Text
              style={[
                styles.emptyDescription,
                {
                  color: theme.secondary,
                },
              ]}
            >
              No grade records were found.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default GradeScreen;
