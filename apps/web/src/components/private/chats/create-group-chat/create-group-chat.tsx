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

import { createGroupChat } from '@/api/chat';
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

const CreateGroupChat = () => {
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
			name: '',
			members: [],
		},
	});

	const { user } = useAuthInfo();
	const [selectedUsers, setSelectedUsers] = useState<User[]>([user as User]);
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
			setLoading(true);
			const res = (await createGroupChat(data.name, memberIds)) as any;
			if (res?.chat) addToChats(res.chat);
			reset();
			setSelectedUsers([user as User]);
			setOpen(false);
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open}>
			<DialogTrigger asChild>
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
			</DialogTrigger>
			<DialogContent className='sm:max-w-md bg-black text-white border-white  h-[70vh] overflow-y-auto flex flex-col'>
				<DialogHeader>
					<DialogTitle>Create Group</DialogTitle>
					<DialogDescription>Chat with your people with groups.</DialogDescription>
				</DialogHeader>
				<form className='flex-1 flex flex-col' onSubmit={handleSubmit(onSubmit)}>
					<div className='flex flex-col gap-3 flex-1'>
						<div>
							<Label htmlFor='link' className='sr-only'>
								Group Name
							</Label>
							<Input
								id='name'
								defaultValue=''
								placeholder='Group Name'
								className='border border-purple-950 focus-within:border-blue-300 h-10'
								{...register('name', {
									required: 'Group name is required',
								})}
							/>
							{errors?.name && (
								<p className='text-red-600 text-xs mt-2'>{errors.name?.message}</p>
							)}
						</div>

						<AddMembers
							currentUser={user}
							selectedUsers={selectedUsers}
							setSelectedUsers={setSelectedUsers}
						/>
						{errors?.members && (
							<p className=' text-red-600 text-xs m-0 flex-grow-[2]'>
								{errors.members?.message}
							</p>
						)}
						<DialogFooter className='justify-end'>
							<DialogClose asChild>
								<Button
									type='button'
									variant='secondary'
									className='bg-dark-grey text-white hover:bg-gray-700'
									onClick={() => setOpen(false)}
									disabled={loading}
								>
									Close
								</Button>
							</DialogClose>
							<Button type='submit' variant={'secondary'} disabled={loading}>
								{!loading ? 'Create' : 'Creating...'}
							</Button>
						</DialogFooter>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateGroupChat;
