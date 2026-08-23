import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  appContainer: {
    flex: 1,
  },

  sceneContainer: {
    flex: 1,
  },

  sceneContent: {
    padding: 20,
    paddingBottom: 40,
  },

  /* ==================== LOGIN ==================== */

  loginContainer: {
    flex: 1,
    backgroundColor: '#F5F5F3',
  },

  loginContent: {
    padding: 20,
    paddingBottom: 35,
  },

  loginIllustration: {
    height: 430,
    backgroundColor: '#DCCFEA',
    borderRadius: 38,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginStar1: {
    position: 'absolute',
    top: 30,
    right: 55,
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
  },

  loginStar2: {
    position: 'absolute',
    top: 95,
    left: 45,
    color: '#FFFFFF',
    fontSize: 23,
  },

  loginStar3: {
    position: 'absolute',
    top: 155,
    right: 75,
    color: '#FFFFFF',
    fontSize: 25,
  },

  loginStar4: {
    position: 'absolute',
    bottom: 95,
    left: 55,
    color: '#FFFFFF',
    fontSize: 30,
  },

  bookGlow: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: '#CBB9E0',
    opacity: 0.45,
  },

  booksContainer: {
    width: 315,
    height: 260,
    justifyContent: 'flex-end',
    alignItems: 'center',
    transform: [{ translateY: -15 }],
  },

  bookTop: {
    width: 245,
    height: 75,
    position: 'absolute',
    top: 15,
    transform: [{ rotate: '-3deg' }],
  },

  bookTopCover: {
    position: 'absolute',
    top: 0,
    left: 8,
    right: 0,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#65A8E8',
    transform: [{ skewX: '-8deg' }],
  },

  bookTopPages: {
    position: 'absolute',
    top: 19,
    left: 17,
    right: 8,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 14,
  },

  pageLine: {
    height: 2,
    backgroundColor: '#E4E7EA',
    marginHorizontal: 14,
    marginTop: 7,
    opacity: 0.8,
  },

  bookTopBottom: {
    position: 'absolute',
    left: 10,
    right: 0,
    bottom: 0,
    height: 12,
    borderRadius: 5,
    backgroundColor: '#4E8FD0',
  },

  bookMiddle: {
    width: 290,
    height: 85,
    position: 'absolute',
    top: 82,
    transform: [{ rotate: '1deg' }],
  },

  bookMiddlePages: {
    position: 'absolute',
    top: 10,
    left: 15,
    right: 8,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },

  bookMiddleLine: {
    width: 45,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D6D9DE',
    marginTop: 9,
    marginLeft: 15,
  },

  bookMiddleCover: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 17,
    borderRadius: 7,
    backgroundColor: '#4F96D8',
  },

  bookBottom: {
    width: 315,
    height: 90,
    position: 'absolute',
    bottom: 0,
    transform: [{ rotate: '-2deg' }],
  },

  bookBottomCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 5,
    height: 20,
    borderRadius: 7,
    backgroundColor: '#5B9FDD',
  },

  bookBottomPages: {
    position: 'absolute',
    top: 19,
    left: 12,
    right: 0,
    height: 55,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 10,
  },

  bookBottomEdge: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    right: 0,
    height: 14,
    borderRadius: 6,
    backgroundColor: '#4386C5',
  },

  /* ==================== LOGIN CARD ==================== */

  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 34,
    paddingHorizontal: 24,
    paddingTop: 27,
    paddingBottom: 25,
    marginTop: -85,
    elevation: 7,
    shadowColor: '#000000',
    shadowOpacity: 0.10,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    zIndex: 10,
  },

  loginTitle: {
    color: '#20242B',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },

  loginDescription: {
    color: '#747980',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 16,
  },

  inputLabel: {
    color: '#20242B',
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 6,
    marginTop: 7,
  },

  input: {
    height: 50,
    backgroundColor: '#F5F5F3',
    borderWidth: 1,
    borderColor: '#E5E5E2',
    borderRadius: 16,
    paddingHorizontal: 15,
    color: '#20242B',
    fontSize: 14,
  },

  loginBtn: {
    height: 54,
    backgroundColor: '#20242B',
    borderRadius: 28,
    marginTop: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  /* ==================== HEADER ==================== */

  screenHeader: {
    marginBottom: 18,
  },

  screenTitle: {
    fontSize: 30,
    fontWeight: '900',
  },

  /* ==================== CALENDAR ==================== */

  calendarCard: {
    borderRadius: 28,
    padding: 8,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 0,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  calendarCardDark: {
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 0,
    shadowOpacity: 0,
  },

  /* ==================== SELECTED DATE ==================== */

  selectedDateCard: {
    borderRadius: 23,
    paddingHorizontal: 17,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 23,
  },

  selectedDateLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  selectedDateValue: {
    fontSize: 17,
    fontWeight: '900',
    marginTop: 4,
  },

  classCountBadge: {
    minWidth: 58,
    height: 48,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  classCountNumber: {
    fontSize: 17,
    fontWeight: '900',
  },

  classCountText: {
    fontSize: 8,
    fontWeight: '700',
    marginTop: 1,
  },

  /* ==================== SECTION ==================== */

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '900',
  },

  sectionLink: {
    fontSize: 11,
    fontWeight: '700',
  },

  /* ==================== SCHEDULE ==================== */

  scheduleCard: {
    borderRadius: 28,
    padding: 18,
    marginBottom: 14,
  },

  scheduleTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  timeBadge: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 16,
  },

  timeText: {
    fontSize: 11,
    fontWeight: '800',
  },

  categoryText: {
    fontSize: 12,
    marginTop: 17,
  },

  subjectText: {
    fontSize: 19,
    fontWeight: '900',
    marginTop: 5,
  },

  detailText: {
    fontSize: 12,
    marginTop: 7,
  },

  /* ==================== EMPTY ==================== */

  emptyState: {
    borderRadius: 25,
    padding: 35,
    alignItems: 'center',
  },

  emptyIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
  },

  emptyDescription: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },

  /* ==================== DESCRIPTION ==================== */

  pageDescription: {
    fontSize: 13,
    marginBottom: 20,
  },

  /* ==================== EXAMS ==================== */

  examCard: {
    borderRadius: 29,
    padding: 19,
    marginBottom: 25,
  },

  examTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  examIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },

  examTitleBox: {
    flex: 1,
    marginLeft: 12,
  },

  examCategory: {
    fontSize: 9,
    fontWeight: '900',
  },

  examSubject: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },

  daysBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  daysNumber: {
    fontSize: 18,
    fontWeight: '900',
  },

  daysText: {
    fontSize: 8,
  },

  examInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
  },

  examInfo: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 7,
  },

  examBottom: {
    marginTop: 15,
  },

  seatText: {
    fontSize: 11,
    fontWeight: '800',
  },

  upcomingCard: {
    minHeight: 75,
    borderRadius: 22,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  examDateBox: {
    width: 48,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  examDateNumber: {
    fontSize: 19,
    fontWeight: '900',
  },

  examDateMonth: {
    fontSize: 8,
    fontWeight: '900',
  },

  upcomingInfo: {
    flex: 1,
    marginLeft: 12,
  },

  upcomingTitle: {
    fontSize: 14,
    fontWeight: '900',
  },

  upcomingDetail: {
    fontSize: 10,
    marginTop: 5,
  },

  /* ==================== GRADES ==================== */

  gpaCard: {
    borderRadius: 30,
    padding: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  gpaTitle: {
    fontSize: 12,
    fontWeight: '700',
  },

  gpaScore: {
    fontSize: 42,
    fontWeight: '900',
    marginTop: 2,
  },

  gpaScale: {
    fontSize: 11,
  },

  gpaCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    justifyContent: 'center',
    alignItems: 'center',
  },

  gpaCircleScore: {
    fontSize: 19,
    fontWeight: '900',
  },

  gpaCircleText: {
    fontSize: 9,
    marginTop: 3,
  },

  gradeRow: {
    minHeight: 82,
    borderRadius: 23,
    padding: 14,
    marginBottom: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },

  gradeIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },

  gradeInfo: {
    flex: 1,
    marginLeft: 12,
  },

  gradeSubject: {
    fontSize: 14,
    fontWeight: '900',
  },

  gradeCode: {
    fontSize: 10,
    marginTop: 4,
  },

  gradeRight: {
    alignItems: 'flex-end',
  },

  gradeNumber: {
    fontSize: 20,
    fontWeight: '900',
  },

  gradeLetter: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 3,
  },

  gradeLetterText: {
    fontSize: 9,
    fontWeight: '900',
  },

  /* ==================== PROFILE ==================== */

  profileCard: {
    borderRadius: 30,
    alignItems: 'center',
    paddingVertical: 25,
    marginBottom: 14,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  avatarEdit: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 29,
    height: 29,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  profileName: {
    fontSize: 23,
    fontWeight: '900',
    marginTop: 12,
  },

  profileId: {
    fontSize: 11,
    marginTop: 4,
  },

  profileBadge: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 11,
  },

  profileBadgeText: {
    fontSize: 8,
    fontWeight: '900',
  },

  changeAvatarText: {
    fontSize: 9,
    marginTop: 9,
    fontWeight: '600',
  },

  /* ==================== PROFILE STATS ==================== */

  statsCard: {
    borderRadius: 23,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 24,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 18,
    fontWeight: '900',
  },

  statLabel: {
    fontSize: 9,
    marginTop: 4,
  },

  statDivider: {
    width: 1,
    height: 30,
  },

  /* ==================== SETTINGS ==================== */

  settingsTitle: {
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 11,
  },

  settingsCard: {
    borderRadius: 24,
    paddingHorizontal: 15,
    marginBottom: 13,
    paddingVertical: 3,
  },

  settingRow: {
    minHeight: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },

  settingIcon: {
    width: 41,
    height: 41,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  settingTextBox: {
    flex: 1,
  },

  settingName: {
    fontSize: 13,
    fontWeight: '800',
  },

  settingDescription: {
    fontSize: 10,
    marginTop: 4,
  },

  /* ==================== PROFILE ACTIONS ==================== */

  actionCard: {
    minHeight: 60,
    borderRadius: 20,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 12,
  },

  /* ==================== LOGOUT ==================== */

  logoutBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 7,
    flexDirection: 'row',
  },

  logoutText: {
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 8,
  },
});