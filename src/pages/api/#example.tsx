import { NextApiHandler } from 'next';

import withErrorHandler from '@/wrapper/withErrorHandler';

import { NotImplementedError } from '@/class/ApiError';

const handler: NextApiHandler = async () => {
  throw new NotImplementedError();
};

export default withErrorHandler(handler);
