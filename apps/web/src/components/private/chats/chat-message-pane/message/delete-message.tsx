import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Chat } from '@/types/chat';
import { Message } from '@/types/message';

const DeleteMessageDialog = ({
	message,
	chat,
	onDelete,
	children,
	onClose,
}: {
	message: Message;
	chat: Chat;
	onDelete: (messageId: string, chatId: string) => void;
	children?: React.ReactNode;
	onClose: (open: boolean) => void;
}) => {
	return (
		<>
			<Dialog onOpenChange={onClose}>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent className='sm:max-w-md rounded-sm w-[30vw] min-w-[300px] bg-black text-white border-white  overflow-y-auto flex flex-col'>
					<DialogHeader>
						<DialogTitle className='text-center'>Are you sure?</DialogTitle>
					</DialogHeader>
					<DialogFooter className='flex sm:justify-center gap-2'>
						<DialogClose asChild>
							<Button
								type='button'
								variant='secondary'
								className='bg-dark-grey text-white hover:bg-gray-700'
							>
								Cancel
							</Button>
						</DialogClose>
						<Button
							type='submit'
							variant={'destructive'}
							onClick={() => onDelete(message._id, chat?._id as string)}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default DeleteMessageDialog;
