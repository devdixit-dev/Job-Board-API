import jwt from 'jsonwebtoken';

export const encodeJwt = async (sessionId: any) => {
  if(!sessionId) return null
  const secret = process.env.JWT_SEC_KEY as string
  const encoded = jwt.sign({ sessionId }, secret, { expiresIn: '30m' });
  return encoded;
}

export const decodeJwt = async (encodedJwt: any) => {
  const secret = process.env.JWT_SEC_KEY as string
  if(!encodedJwt) return null
  const decode = jwt.verify(encodedJwt, secret);
  const token = decode
}