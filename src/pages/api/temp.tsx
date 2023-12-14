import { NextApiHandler } from 'next';

import { encryptDataWithRSA } from '@/util/string.util';

const handler: NextApiHandler = (req, res) => {
  const publicKeyStr = process.env.NEXT_PUBLIC_RSA_PUBLIC_KEY;

  if (!publicKeyStr) return res.status(500).json({ message: 'Public key not found' });

  const publicKey = atob(publicKeyStr);
  // eslint-disable-next-line no-console
  console.log(publicKey);

  const data = encryptDataWithRSA('test123', publicKey);
  res.status(200).json(data);
};

export default handler;
