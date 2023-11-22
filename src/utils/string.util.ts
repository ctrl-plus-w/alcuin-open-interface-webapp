export const prettifyCalendarName = (name: string) => {
  if (!name.startsWith('23_24')) return name.replaceAll('_', ' ');
  return name.replaceAll('_', ' ');
};

export const capitalize = (str: string): string => {
  return str[0].toUpperCase() + str.slice(1);
};
