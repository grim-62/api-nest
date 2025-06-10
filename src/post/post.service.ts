import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { Model } from 'mongoose';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private readonly postModel : Model<PostDocument>){}

  async create(req, postdto) {
    const post = await new this.postModel({
      ...postdto,
      userId: req.userId,
    });
    return post.save();
  }

  async findAll() {
    return this.postModel.find().populate('userId').exec();
  }

  async findOne(id: number) {
    return this.postModel.findById(id).populate('userId', 'username').exec();
  }

  async  update(id: number, userId: string, updatePostDto: UpdatePostDto) {
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).populate('userId', 'username').exec();
  }

  remove(id: number, userId: string) {
    return this.postModel.findByIdAndDelete(id).exec();
  }
}
