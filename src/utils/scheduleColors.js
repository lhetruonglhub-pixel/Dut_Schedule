export const getScheduleBackground = (darkMode, index) => {
  const lightColors = ['#D7E8E4', '#DCCFEA', '#CCD7EF'];
  const darkColors = ['#263A36', '#30283A', '#293242'];
  const colors = darkMode ? darkColors : lightColors;

  return colors[index % colors.length];
};