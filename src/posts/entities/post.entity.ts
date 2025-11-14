import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/core/entities/base.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Post extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ unique: true })
  slug: string;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;
}
