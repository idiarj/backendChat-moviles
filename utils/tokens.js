import jwt from 'jsonwebtoken';

export class Token {
  static generateToken({payload, expiresIn}) {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn });
  }

  static verifyToken(token) {
    return jwt.verify(token, process.env.SECRET_KEY);
  }
}