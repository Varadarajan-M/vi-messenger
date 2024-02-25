import mongoose, { InferSchemaType, model } from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			requried: true,
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			requried: true,
			trim: true,
		},
		password: {
			type: String,
			requried: true,
		},
		picture: {
			type: String,
		},
		lastSeen: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

type UserModel = InferSchemaType<typeof userSchema>;

export default model<UserModel>('User', userSchema);
