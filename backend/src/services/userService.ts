import bcrypt from 'bcryptjs';
import { UserModel } from '@models/User';
import { RegisterUserDTO, LoginUserDTO } from '@types/userType';

export class UserService {
  async register(data: RegisterUserDTO) {
    const { firstName, lastName, email, password } = data;
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) throw new Error('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return newUser;
  }

  async login(data: LoginUserDTO) {
    const { email, password } = data;
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    return user;
  }

  async findUserByEmail(email: string) {
    return UserModel.findOne({ email });
  }
}
