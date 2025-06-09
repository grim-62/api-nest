// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User> & {
  requestOtp(plainOtp: string): Promise<void>;
  verifyOtp(otp: string): Promise<boolean>;
};

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  countryCode: string;

  @Prop({ unique: true })
  phone: string;

  @Prop()
  avatar: string;

  @Prop({ select: false })
  otp: string;

  @Prop()
  otpExpiresAt: Date;

  @Prop({ select: false })
  refreshToken: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', function (next) {
  // if (!this.otp) {
  const otp = '111111';
  // this.otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = bcrypt.hashSync(otp, 10); // Hash the OTP before saving
  // For testing purposes, we can use a static OTP
  // this.otp = "111111"; // For testing purposes, use a static OTP
  this.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  // }
  next();
});

UserSchema.methods.requestOtp = async function (plainOtp: string) {
  this.otp = await bcrypt.hash(plainOtp, 10);
  this.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
};

UserSchema.methods.verifyOtp = async function (otp: string): Promise<boolean> {
  if (!this.otp || !this.otpExpiresAt) {
    return false;
  }
  const isMatch = await bcrypt.compare(otp, this.otp);

  if (isMatch && this.otpExpiresAt > new Date()) {
    this.otp = undefined;
    this.otpExpiresAt = new Date();
    return true;
  }
  return false;
};
// export const UserSchema = SchemaFactory.createForClass(User); // this line is not needed as we already created UserSchema above
export { UserSchema };
