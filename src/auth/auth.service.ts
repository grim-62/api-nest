import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/entities/user.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()

export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  generateToken(id: string) {
    const payload = { id };
    const refreshToken = this.jwtService.sign(payload, {
      // secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
    const accessToken = this.jwtService.sign(payload, {
      // secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async requestOtp(data) {
    const { email, phone, countryCode } = data;

    if(!email && !(!phone && !countryCode)) {
      throw new BadRequestException('Provide either email or phone with country code');
    }
    const query = email ? { email } : { phone, countryCode };
    const user  = await this.userModel.findOne(query).select('+otp +otpExpiresAt').exec();
    if (!user) {
      throw new BadRequestException('User not found' + JSON.stringify(query));
    }
    // const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    const otp = "111111"
    user.requestOtp(otp);  
    await user.save();
    return {
      message: 'OTP sent successfully',
      success: true,
    }
  }

  async verifyOtp(data) {
    const  { email, phone, countryCode, otp } = data;
    if(!email && !(!phone && !countryCode)) {
      throw new BadRequestException('Provide either email or phone with country code');
    }
    const query = email ? { email } : { phone, countryCode };
    const user = await this.userModel.findOne(query).select('+otp +otpExpiresAt').exec();
    if (!user) {
      throw new BadRequestException('User not found' + JSON.stringify(query));
    }
    if (!user.otp || user.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP expired or not set');
    }
    const isValid = await user.verifyOtp(otp);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }
    const tokens = this.generateToken(user._id.toString());
    user.refreshToken = tokens.refreshToken;
    await user.save();
    return {
      message: 'OTP verified successfully',
      tokens,
      success: true,
    };
  }

  async register(data) {
    const {email, phone, countryCode} = data;
    if(!email && !(!phone && !countryCode)) {
      throw new BadRequestException('Provide either email or phone with country code');
    }
    const query = email ? { email } : { phone, countryCode };
    const existingUser = await this.userModel.findOne(query).exec();
    if (existingUser) {
      throw new BadRequestException('User already exists');
    } 
    const newUser = new this.userModel(data);
    await newUser.save();
    return {
      message: 'User registered successfully',
      success: true,
    };
  }

}
