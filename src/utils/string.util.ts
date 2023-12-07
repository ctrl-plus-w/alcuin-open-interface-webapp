import crypto from 'crypto';

export const prettifyCalendarName = (name: string) => {
  if (!name.startsWith('23_24')) return name.replaceAll('_', ' ');
  return name.replaceAll('_', ' ');
};

export const capitalize = (str: string): string => {
  return str[0].toUpperCase() + str.slice(1);
};

export const encryptDataWithRSA = (data: string, publicKey: string): string => {
  const buffer = Buffer.from(data, 'utf-8');
  const encryptedBuffer = crypto.publicEncrypt(
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
    buffer,
  );
  return encryptedBuffer.toString('base64');
};
