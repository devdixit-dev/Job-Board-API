import jwt from 'jsonwebtoken';

export const encodeJwt = async (id) => {
  if(!id) return null
  const secret = process.env.JWT_SEC_KEY
  const encoded = jwt.sign({ id }, secret, { expiresIn: '30m' });
  return encoded;
}

export const decodeJwt = async (encodedJwt) => {
  const secret = process.env.JWT_SEC_KEY
  if(!encodedJwt) return null
  const decoded = jwt.verify(encodedJwt, secret);
  return decoded;
}