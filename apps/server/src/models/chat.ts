import { InferSchemaType, Schema, model, Types } from 'mongoose';

const chatSchema = new Schema({
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
		required: true,
	},
});

type ChatModel = InferSchemaType<typeof chatSchema>;

export default model<ChatModel>('Chat', chatSchema);
