import { Platform } from 'react-native';

export const API_BASE_URL =
  Platform.OS === 'web'
    ? 'http://dutbackend-tenban.azurewebsites.net'
    : 'http://dutbackend-tenban.azurewebsites.net'; // đổi thành IP LAN máy bạn khi test trên điện thoại thật

export const CURRENT_WEEK = 2;

export const WEEK_1_START_DATE = '2026-08-10';

export const EMPTY_STUDENT_DATA = {
  tong_hop_ket_qua: [],
  chi_tiet_mon_hoc: [],
  lich_hoc: [],
  lich_thi: [],
};