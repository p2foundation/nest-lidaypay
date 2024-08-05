import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  email: string;
  @Prop()
  phoneNumber: string;
  
  @Prop()
  gravatar: string;
  @Prop({ required: true, default: 'USER' })
  roles: string[];
  @Prop()
  qrCode: string; // For agents
  @Prop()
  points: number; // Reward points
  @Prop({ required: true, default: 'ACTIVE'})
  status: string;

  @Prop({ required: false, default: false })
  emailVerified: boolean;
  @Prop({ required: false, default: false })
  phoneVerified: boolean;

  @Prop({ default: Date.now() })
  createdAt: Date;
  @Prop({ default: Date.now() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
