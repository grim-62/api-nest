import { IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString() title: string;
  @IsOptional() @IsString() content: string;
  @IsOptional() @IsString() imageUrl: string;
  @IsOptional() tags: string[];
}
