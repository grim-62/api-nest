import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateAuthDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsEmail()  email?: string;
}

// dto/request-otp.dto.ts
export class RequestOtpDto {
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() countryCode?: string;
}

// dto/verify-otp.dto.ts
export class VerifyOtpDto {
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() countryCode?: string;
  @IsString() otp: string;
}

