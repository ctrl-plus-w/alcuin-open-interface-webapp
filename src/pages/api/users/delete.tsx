import { NextApiHandler } from 'next';

import { RessourceNotFoundError, UnauthorizedError } from '@/classes/ApiError';
import Joi from 'joi';

import { ProfilesRepository } from '@/repository/ProfilesRepository';

import withErrorHandler from '@/wrapper/withErrorHandler';

import supabase from '@/instance/supabaseAdmin';

import { getUserIdFromRequest } from '@/util/api.util';

import HttpMethod from '@/constant/HTTPMethod';

type BodySchemaType = {
  id: string;
};

const querySchema = Joi.object<BodySchemaType>({
  id: Joi.string().not().empty().required(),
});

const profilesRepository = new ProfilesRepository(supabase);

const handler: NextApiHandler = async (req, res) => {
  const id = await getUserIdFromRequest(req);

  const { id: userId } = await querySchema.validateAsync(req.query);

  const user = await profilesRepository.getById(id);
  if (!user) throw new RessourceNotFoundError('User');
  if (user.role !== 'ADMIN') throw new UnauthorizedError();

  const { data, error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw error;

  return res.status(200).json(data.user);
};

export default withErrorHandler(handler, HttpMethod.DELETE);
