export const prettifyCalendarName = (name: string) => {
  if (!name.startsWith('23_24')) return name.replaceAll('_', ' ');
  return name.replaceAll('_', ' ');
};
