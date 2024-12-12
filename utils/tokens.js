import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
class Token {
  constructor(secret_key){
    this.secret_key = secret_key;
  }

  generateToken({payload, expiresIn}) {
    return jwt.sign(payload, this.secret_key, { expiresIn });
  }

  verifyToken({token}) {
    return jwt.verify(token, process.env.SECRET_KEY);
  }
}

export const jwtToken = new Token(process.env.SECRET_KEY);