export const getScheduleBackground = (darkMode, index) => {
  const lightColors = ['#263A36', '#30283A', '#293242'];
  const darkColors = ['#263A36', '#30283A', '#293242'];
  const colors = darkMode ? darkColors : lightColors;

  return colors[index % colors.length];
};