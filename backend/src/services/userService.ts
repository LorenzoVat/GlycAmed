import bcrypt from 'bcryptjs';
import { UserModel } from '@models/User';
import { RegisterUserDTO, LoginUserDTO, UpdateUserDTO } from '@types/userType';

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

    return { _id: newUser._id };;
  }

  async login(data: LoginUserDTO) {
    const { email, password } = data;
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    return { _id: user._id };
  }

  async findUserByEmail(email: string) {
    return UserModel.findOne({ email });
  }

  async getProfile(userId: string) {
    const user = await UserModel.findById(userId).select("-password");
    if (!user) throw new Error("User not found");

    return { firstName: user.firstName, lastName: user.lastName, email: user.email };
  }

  async updateProfile(userId: string, data: UpdateUserDTO) {
    const { firstName, lastName, email } = data;

    const existingEmail = await UserModel.findOne({ email, _id: { $ne: userId } });
    if (existingEmail) throw new Error("Email already in use");

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) throw new Error("User not found");

    return { firstName: updatedUser.firstName, lastName: updatedUser.lastName, email: updatedUser.email };
  }
}
