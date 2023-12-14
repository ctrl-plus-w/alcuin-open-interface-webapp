import { encryptDataWithRSA } from '@/util/string.util';

const handler = () => {
  const publicKey = process.env.NEXT_PUBLIC_RSA_PUBLIC_KEY;

  return publicKey ? encryptDataWithRSA('test123', publicKey) : { message: 'Public key not found.' };
};

export default handler;
