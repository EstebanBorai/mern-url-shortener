import bcrypt from 'bcrypt';
import { Model, Schema, SchemaTypeOptions, model } from "mongoose";

const SALT_ROUNDS = 10;

interface IUser {
  name: string;
  surname: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserMethods {
  hashPassword(raw: string): Promise<void>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  name: {
    type: String,
    required: true,
  },
  surname: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

UserSchema.methods.hashPassword = async function (raw: string): Promise<void> {
  const hash = await bcrypt.hash(raw, SALT_ROUNDS);
  this.passwordHash = hash;
};

UserSchema.methods.verifyPassword = async function (rawPassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(rawPassword, hash);
};

export const UserModel = model("User", UserSchema);
