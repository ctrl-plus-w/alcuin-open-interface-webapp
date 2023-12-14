import { useEffect } from 'react';

import { encryptDataWithRSA } from '@/util/string.util';

const Temp = () => {
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_RSA_PUBLIC_KEY;
    // eslint-disable-next-line no-console
    if (publicKey) console.log(encryptDataWithRSA('test123', publicKey));
  }, []);

  return <></>;
};

export default Temp;
