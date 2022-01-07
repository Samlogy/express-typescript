import { DocumentDefinition, FilterQuery } from "mongoose";
import { omit } from "lodash";
import User, { UserDocument } from "../models/user.model";

export async function createUser(input: DocumentDefinition<UserDocument>) {
  try {
    return await User.create(input);
  } catch (err: any) {
    throw new Error(err);
  }
};

export async function findUser(query: FilterQuery<UserDocument>) {
  return User.findOne(query).lean();
};

export async function validatePassword({
  email,
  password,
}: {
  email: UserDocument["email"];
  password: string;
}) {
  const user = await User.findOne({ email });

  if (!user) return false;

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
};

export function findUserByEmail(email: string): FilterQuery<UserDocument> {
  return User.findOne({ email }).lean();
};

export function findUserById(id: string): FilterQuery<UserDocument> {
  return User.findById(id).lean();
};