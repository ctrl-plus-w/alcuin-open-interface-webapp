const parsedAddHoursOffset = parseInt(process.env.NEXT_PUBLIC_ADD_HOURS_OFFSET ?? '');

const config = {
  ADD_HOURS_OFFSET: isNaN(parsedAddHoursOffset) ? 0 : parsedAddHoursOffset,
};

export default config;
