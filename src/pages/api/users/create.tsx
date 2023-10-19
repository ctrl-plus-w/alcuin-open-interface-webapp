import { NextApiHandler } from 'next';

import { RessourceNotFoundError, UnauthorizedError } from '@/classes/ApiError';
import Joi from 'joi';

import { ProfilesRepository } from '@/repository/ProfilesRepository';

import withErrorHandler from '@/wrapper/withErrorHandler';

import supabase from '@/instance/supabaseAdmin';

import { getUserIdFromRequest } from '@/util/api.util';

import HttpMethod from '@/constant/HTTPMethod';

type BodySchemaType = {
  email: string;
  password: string;
};

const bodySchema = Joi.object<BodySchemaType>({
  email: Joi.string().email().not().empty().required(),
  password: Joi.string().not().empty().required(),
});

const profilesRepository = new ProfilesRepository(supabase);

const handler: NextApiHandler = async (req, res) => {
  const id = await getUserIdFromRequest(req);

  const { email, password } = await bodySchema.validateAsync(req.body);

  const user = await profilesRepository.getById(id);
  if (!user) throw new RessourceNotFoundError('User');
  if (user.role !== 'ADMIN') throw new UnauthorizedError();

  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;

  return res.status(200).json(data.user);
};

export default withErrorHandler(handler, HttpMethod.POST);
