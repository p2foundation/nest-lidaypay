import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordUtil } from '../utilities/password.util';
import { ValidationUtil } from '../utilities/validation.util';
import { EmailService } from '../utilities/email.service';
import { generateQrCode } from '../utilities/qr-code.util'; // Import QR code utility
import { SmsService } from 'src/utilities/sms.util';
import { GravatarService } from 'src/utilities/gravatar.util';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private emailService: EmailService,
    private smsService: SmsService,
    private gravatarService: GravatarService
  ) {}

  async create(userDto: CreateUserDto): Promise<User> {
    try {
      if (!ValidationUtil.isValidEmail(userDto.email)) {
        throw new Error('Invalid email address');
      }
      const hashedPassword = await PasswordUtil.hashPassword(userDto.password);
      const gravatarUrl = await this.gravatarService.fetchAvatar(userDto.email);
      const createdUser = new this.userModel({ ...userDto, password: hashedPassword });
      
      if (createdUser.roles && createdUser.roles.some(role => role.toLowerCase() === 'agent')) {
        this.logger.debug(`User QrCode Generating ==>`);
        createdUser.qrCode = await generateQrCode(createdUser._id.toString());
      }

      createdUser.points = 0; // Initialize points
      createdUser.gravatar = gravatarUrl; 
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
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!updateData || typeof updateData !== 'object') {
      throw new Error('Invalid update data');
    }

    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
      if (!updatedUser) {
        throw new Error('User not found');
      }
      return updatedUser;
    } catch (error) {
      // Handle update errors
      throw error;
    }
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
      throw error;
    }
  }

  async findAll(): Promise<{ users: User[], totalCount: number }> {
    try {
      const users = await this.userModel.find().exec();
      const totalCount = await this.userModel.countDocuments().exec();
      return { users, totalCount };
    } catch (error) {
      // Handle errors
      throw error;
    }
  }
  
  async deleteUserById(userId: string): Promise<{ message: string }> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const result = await this.userModel.findByIdAndDelete(userId).exec();
      if (!result) {
        throw new Error('User not found');
      }
      return { message: 'User successfully deleted' };
    } catch (error) {
      // Handle deletion errors
      throw error;
    }
  }
  async deleteAllUsers(): Promise<{ message: string }> {
    try {
      await this.userModel.deleteMany({}).exec();
      return { message: 'All users successfully deleted' };
    } catch (error) {
      // Handle deletion errors
      throw error;
    }
  }

  // Other user management methods...
}
