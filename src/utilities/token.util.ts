import { sign, verify } from 'jsonwebtoken';

const secretKey = 'your-secret-key';

export class TokenUtil {
  static generateToken(payload: object, expiresIn: string = '1h'): string {
    return sign(payload, secretKey, { expiresIn });
  }

  static verifyToken(token: string): object | string {
    try {
      return verify(token, secretKey);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
