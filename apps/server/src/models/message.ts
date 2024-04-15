import { InferSchemaType, Schema, model } from 'mongoose';

const messageSchema = new Schema(
	{
		type: {
			type: String,
			enum: ['text', 'image', 'gif', 'video'],
			required: true,
		},
		content: {
			type: Schema.Types.Mixed,
			required: true,
			trim: true,
		},
		sender: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		chatId: {
			type: Schema.Types.ObjectId,
			ref: 'Chat',
			required: true,
		},
		seenBy: {
			type: [Schema.Types.ObjectId],
			ref: 'User',
		},
	},
	{
		timestamps: true,
	},
);

type MessageModel = InferSchemaType<typeof messageSchema>;

export default model<MessageModel>('Message', messageSchema);
