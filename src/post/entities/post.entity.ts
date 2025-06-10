import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/entities/user.entity';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  content: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: [String], default: [], required: false })
  tags: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
