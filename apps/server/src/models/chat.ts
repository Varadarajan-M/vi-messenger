import { InferSchemaType, Schema, Types, model } from 'mongoose';

const chatSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		members: {
			type: [Types.ObjectId],
			ref: 'User',
			default: [],
		},
		admin: {
			type: Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	},
);

type ChatModel = InferSchemaType<typeof chatSchema>;

export default model<ChatModel>('Chat', chatSchema);
