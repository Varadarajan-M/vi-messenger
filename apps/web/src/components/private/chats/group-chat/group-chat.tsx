import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PlusIcon } from '@radix-ui/react-icons';
import { Label } from '@radix-ui/react-label';

import { createGroupChat, updateGroupChat } from '@/api/chat';
import { toast } from '@/components/ui/use-toast';
import useAuthInfo from '@/hooks/auth/useAuthInfo';
import { User } from '@/types/auth';
import { useChatsStore } from '@/zustand/store';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AddMembers from './add-members';

type CreateGroupFormData = {
	name: string;
	members: User[];
};

type GroupChatProps = {
	mode?: 'create' | 'edit' | 'view';
	defaultMembers?: User[];
	defaultName?: string;
	renderButton?: ({ onClick }: { onClick: () => void }) => React.ReactNode;
	onClose?: () => void;
	chatId?: string;
};

const GroupChat = ({
	mode = 'create',
	defaultMembers,
	defaultName,
	renderButton,
	onClose,
	chatId,
}: GroupChatProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors, submitCount },
		setError,
		setValue,
		clearErrors,
		reset,
	} = useForm<CreateGroupFormData>({
		mode: 'onSubmit',
		defaultValues: {
			name: mode === 'create' ? '' : defaultName ?? '',
			members: [],
		},
	});

	const { user } = useAuthInfo();

	const initialSelectedUsers = !defaultMembers?.find((m) => m._id === user?._id)
		? [user as User, ...(defaultMembers ?? [])]
		: defaultMembers;

	const [selectedUsers, setSelectedUsers] = useState<User[]>(
		mode === 'create' ? [user as User] : initialSelectedUsers,
	);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setValue('members', selectedUsers);
		if (selectedUsers.length < 3 && submitCount > 0) {
			setError('members', { type: 'required', message: 'Please select at least 3 users.' });
		}
		if (selectedUsers.length >= 3) {
			clearErrors('members');
		}
	}, [clearErrors, selectedUsers, setError, setValue, submitCount]);

	const addToChats = useChatsStore((state) => state.addToChats);
	const onSubmit = async (data: CreateGroupFormData) => {
		try {
			const memberIds = data.members.map((member) => member._id);
			if (memberIds.length < 3) return;
			setLoading(true);
			if (mode === 'edit') {
				const res = (await updateGroupChat(chatId as string, data.name, memberIds)) as any;
				if (res?.chat) {
					toast({
						title: 'Group updated successfully',
						variant: 'default',
						style: {
							backgroundColor: 'black',
							color: 'white',
							border: '1px solid purple',
						},
					});
					window.location.reload();
				} else {
					toast({
						title: 'Group update failed',
						description: res?.error,
						variant: 'destructive',
					});
				}
			} else if (mode === 'create') {
				const res = (await createGroupChat(data.name, memberIds)) as any;
				if (res?.chat) {
					addToChats(res.chat);
					toast({
						title: 'Group created successfully',
						variant: 'default',
						style: {
							backgroundColor: 'black',
							color: 'white',
							border: '1px solid purple',
						},
					});
					reset();
					setSelectedUsers([user as User]);
					setOpen(false);
				} else {
					toast({
						title: 'Group creation failed',
						variant: 'destructive',
					});
				}
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	const dialogTitle =
		mode === 'create' ? 'Create Group' : mode === 'view' ? 'Group Details' : 'Edit Group';

	const handleOpenChange = (open: boolean) => {
		!open && onClose?.();
		setOpen(open);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{renderButton ? (
					renderButton({ onClick: () => setOpen(true) })
				) : (
					<Button
						type='submit'
						title='Create Group Chat'
						aria-label='Create Group Chat'
						role='button'
						onClick={() => setOpen(true)}
						className='self-center h-full transition-colors bg-black hover:bg-opacity-20 border border-transparent focus:border-purple-950'
					>
						<PlusIcon />
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className='w-[85vw] sm:max-w-md bg-black text-white border-white  h-[70vh] overflow-y-auto flex flex-col'>
				<DialogHeader>
					<DialogTitle>{dialogTitle}</DialogTitle>
					{mode !== 'view' && (
						<DialogDescription>Chat with your people with groups.</DialogDescription>
					)}
				</DialogHeader>
				<form className='flex-1 flex flex-col' onSubmit={handleSubmit(onSubmit)}>
					<div className='flex flex-col gap-3 flex-1'>
						<div>
							<Label htmlFor='link' className='sr-only'>
								Group Name
							</Label>
							<Input
								id='name'
								placeholder='Group Name'
								className='border border-purple-950 focus-within:border-blue-300 h-10'
								{...register('name', {
									required: 'Group name is required',
								})}
								disabled={mode === 'view'}
							/>
							{errors?.name && (
								<p className='text-red-600 text-xs mt-2'>{errors.name?.message}</p>
							)}
						</div>

						<AddMembers
							currentUser={user}
							selectedUsers={selectedUsers}
							setSelectedUsers={setSelectedUsers}
							viewOnly={mode === 'view'}
						/>
						{errors?.members && (
							<p className=' text-red-600 text-xs m-0 flex-grow-[2]'>
								{errors.members?.message}
							</p>
						)}
						<DialogFooter className='justify-end gap-2'>
							<DialogClose asChild>
								<Button
									type='button'
									variant='secondary'
									className='bg-dark-grey text-white hover:bg-gray-700'
									onClick={() => {
										setOpen(false);
										onClose?.();
									}}
									disabled={loading}
								>
									Close
								</Button>
							</DialogClose>
							{mode !== 'view' && (
								<Button type='submit' variant={'secondary'} disabled={loading}>
									{mode === 'create'
										? !loading
											? 'Create'
											: 'Creating...'
										: 'Update Group'}
								</Button>
							)}
						</DialogFooter>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default GroupChat;
