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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Message } from '@/types/message';
import { useForm } from 'react-hook-form';

const EditMessageDialog = ({
	message,
	onEdit,
	children,
	onClose,
}: {
	message: Message;
	onEdit: (messageId: string, chatId: string, message: string) => void;
	children?: React.ReactNode;
	onClose: (open: boolean) => void;
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm({
		mode: 'onSubmit',
		defaultValues: {
			message: message?.content as string,
		},
	});

	const onSubmit = (data: { message: string }) => {
		onEdit(message?._id, message?.chatId, data?.message?.trimStart());
	};

	return (
		<Dialog onOpenChange={onClose}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-md rounded-sm w-[30vw] min-w-[300px] bg-black text-white border-white  overflow-y-auto flex flex-col'>
				<DialogHeader>
					<DialogTitle className='text-center'>Edit message</DialogTitle>
				</DialogHeader>
				<form className='flex-1 flex flex-col' onSubmit={handleSubmit(onSubmit)}>
					<div className='flex flex-col gap-3 flex-1'>
						<div>
							<Label htmlFor='link' className='sr-only'>
								Update Message
							</Label>
							<Input
								placeholder='Type a message...'
								className='border border-purple-950 focus-within:border-blue-300 h-10'
								{...register('message', { required: "Message can't be empty" })}
							/>
							{errors?.message && (
								<p className='text-red-500 mt-1 text-xs'>
									{errors.message?.message as string}
								</p>
							)}
						</div>

						<DialogFooter className='justify-end'>
							<DialogClose asChild>
								<Button
									type='button'
									variant='secondary'
									className='bg-dark-grey text-white hover:bg-gray-700'
								>
									Close
								</Button>
							</DialogClose>
							<DialogClose asChild>
								<Button type='submit' variant={'secondary'}>
									Save
								</Button>
							</DialogClose>
						</DialogFooter>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default EditMessageDialog;
