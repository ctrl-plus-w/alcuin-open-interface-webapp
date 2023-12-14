import { NextApiHandler } from 'next';

import Joi from 'joi';

import withErrorHandler from '@/wrapper/withErrorHandler';

import { supabaseUrl } from '@/instance/supabaseAdmin';

import { encryptDataWithRSA } from '@/util/string.util';

type QuerySchemaType = {
  password: string;
};

const querySchema = Joi.object<QuerySchemaType>({
  password: Joi.string().required(),
});

const handler: NextApiHandler = async (req, res) => {
  const publicKeyStr = process.env.NEXT_PUBLIC_RSA_PUBLIC_KEY;
  if (!publicKeyStr || !supabaseUrl) throw new Error('Invalid config, please contact and administrator.');

  const publicKey = atob(publicKeyStr);

  const { password } = await querySchema.validateAsync(req.query);

  const data = encryptDataWithRSA(password, publicKey);
  res.status(200).json({ password: data });
};

export default withErrorHandler(handler);
