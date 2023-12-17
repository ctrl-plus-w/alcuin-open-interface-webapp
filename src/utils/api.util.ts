import type { NextApiRequest } from 'next';

import { verify, decode } from 'jsonwebtoken';

import { MethodsNotAllowedError, UnauthorizedError } from '@/class/ApiError';

import HTTPMethod from '@/constant/HTTPMethod';

/**
 * Check if the passed NextApiHandler has been run with one / the allowed method(s)
 * @param methodOrMethods The methods to check the handler against
 * @throws A CustomError with status 403 if the method isn't allowed
 */
export const checkIsHTTPMethod = (methodOrMethods: HTTPMethod | HTTPMethod[]) => (req: NextApiRequest) => {
  const methods = Array.isArray(methodOrMethods) ? methodOrMethods : [methodOrMethods];
  if (!req.method || !methods.some((method) => method === req.method)) throw new MethodsNotAllowedError(methods);
};

export const checkIsDELETE = checkIsHTTPMethod(HTTPMethod.DELETE);
export const checkIsPATCH = checkIsHTTPMethod(HTTPMethod.PATCH);
export const checkIsPOST = checkIsHTTPMethod(HTTPMethod.POST);
export const checkIsGET = checkIsHTTPMethod(HTTPMethod.GET);
export const checkIsPUT = checkIsHTTPMethod(HTTPMethod.PUT);

export const getUserIdFromRequest = async (req: NextApiRequest): Promise<string> => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new UnauthorizedError();

    const [_, token] = authorization.split(' ');

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("Missing environment variable 'JWT_SECRET'.");
      throw new UnauthorizedError();
    }

    verify(token, jwtSecret);

    const jwt = decode(token);
    if (!jwt || typeof jwt !== 'object' || !('sub' in jwt) || !jwt.sub) throw new UnauthorizedError();

    return jwt.sub;
  } catch (err) {
    throw new UnauthorizedError();
  }
};
