import jwt from 'jsonwebtoken';

export const encodeJwt = async (sessionId) => {
  if(!sessionId) return null
  const secret = process.env.JWT_SEC_KEY
  const encoded = jwt.sign({ sessionId }, secret, { expiresIn: '30m' });
  return encoded;
}

export const decodeJwt = async (encodedJwt) => {
  const secret = process.env.JWT_SEC_KEY
  if(!encodedJwt) return null
  const decode = jwt.verify(encodedJwt, secret);
  const token = decode
}