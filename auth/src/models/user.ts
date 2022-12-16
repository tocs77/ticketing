import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Password } from '../services/password';

interface IUser {
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  build(attrs: IUser): Promise<HydratedDocument<IUser>>;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.password);
    this.password = hashed;
  }
  done();
});

userSchema.static('build', async function build(attrs: IUser) {
  return await this.create(attrs);
});

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export { User };
