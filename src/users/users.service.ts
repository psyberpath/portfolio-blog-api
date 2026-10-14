import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    // Use explicit salt rounds from env (default to 12) to avoid ambiguous genSalt() behavior
    const saltRounds = Number(process.env.SALT_ROUNDS ?? 12);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }
}
