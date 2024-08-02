import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordUtil } from '../utilities/password.util';
import { ValidationUtil } from '../utilities/validation.util';
import { EmailService } from '../utilities/email.service';
import { generateQrCode } from '../utilities/qr-code.util'; // Import QR code utility
import { SmsService } from 'src/utilities/sms.util';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private emailService: EmailService,
    private smsService: SmsService,
  ) {}

  async create(userDto: CreateUserDto): Promise<User> {
    try {
      if (!ValidationUtil.isValidEmail(userDto.email)) {
        throw new Error('Invalid email address');
      }
      const hashedPassword = await PasswordUtil.hashPassword(userDto.password);
      const createdUser = new this.userModel({ ...userDto, password: hashedPassword });
      if (createdUser.roles && createdUser.roles.includes('agent')) {
        createdUser.qrCode = await generateQrCode(createdUser._id.toString());
      }
      
      createdUser.points = 0; // Initialize points
      await createdUser.save();

      // await this.emailService.sendMail(userDto.email, 'Welcome!', 'Thank you for registering with Lidapay.');
      // await this.smsService.sendSms(userDto.phoneNumber, 'Welcome to our airtime and internet data service!');
      
      return createdUser;
    } catch (error) {
      // Handle creation errors
      throw error;
    }
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    if (!username) {
      throw new Error('Username is required');
    }
    return this.userModel.findOne({ username }).exec();
  }

  async findOneById(userId: string): Promise<User | undefined> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.userModel.findById(userId).exec();
  }

  async updateProfile(userId: string, updateData: any): Promise<User> {
    // Add validation for updateData
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
  }

  async addPoints(userId: string, points: number): Promise<User> {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new Error('User not found');
      }
      user.points += points;
      return user.save();
    } catch (error) {
      // Handle errors
    }
  }

  // Other user management methods...
}
