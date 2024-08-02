import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PasswordUtil } from '../utilities/password.util';
import { TokenUtil } from '../utilities/token.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    if (user && PasswordUtil.comparePassword(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.generateRefreshToken(user.userId),
    };
  }

  generateRefreshToken(userId: string) {
    return TokenUtil.generateToken({ sub: userId }, '7d');
  }

  async refreshToken(refreshToken: string) {
    const payload = TokenUtil.verifyToken(refreshToken) as { sub: string };
    if (typeof payload === 'string') throw new Error('Invalid token');
    
    const user = await this.userService.findOneById(payload.sub);
    if (!user) throw new Error('User not found');
    
    return this.login(user);
  }
}

