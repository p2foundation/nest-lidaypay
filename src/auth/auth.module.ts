import { Module, forwardRef } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { JWT_SECRET } from '../constants';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { EmailService } from '../utilities/email.service';
import { SmsService } from '../utilities/sms.util';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET || process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    })
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtService,
    UserService,
    EmailService,
    SmsService
  ],
  exports: [AuthService,EmailService,SmsService]
})
export class AuthModule {}