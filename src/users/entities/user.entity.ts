import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/core/entities/base.entity';
import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/entities/post.entity';

@Entity('user')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
