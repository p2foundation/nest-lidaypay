import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MerchantModule } from './merchant/merchant.module';
import { AffiliateModule } from './affiliate/affiliate.module';
import { RewardModule } from './reward/reward.module';
import { TransactionModule } from './transaction/transaction.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGODB_URI } from './constants';
import { EmailService } from './utilities/email.service';
import { SmsService } from './utilities/sms.util';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || MONGODB_URI),  
    AuthModule, 
    UserModule, 
    MerchantModule, 
    AffiliateModule, 
    RewardModule, 
    TransactionModule,
    HttpModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EmailService,
    SmsService
  ],
})
export class AppModule {}
