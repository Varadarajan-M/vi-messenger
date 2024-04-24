/* eslint-disable no-mixed-spaces-and-tabs */
import { uploadProfilePicture, uploadToCloudinary } from '@/api/user';
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
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import useAuth from '@/hooks/auth/useAuth';
import useAuthInfo from '@/hooks/auth/useAuthInfo';
import useModifyUser from '@/hooks/user/useModifyUser';
import { User } from '@/types/auth';
import { CheckIcon, Cross1Icon, DotsHorizontalIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { useRef, useState } from 'react';

type UserDetailTextFieldProps =
	| {
			label: string;
			defaultValue?: string;
			type?: string;
			placeholder?: string;
			loading?: boolean;
	  } & (
			| {
					allowEdit: false;
					onEdit?: undefined;
			  }
			| {
					label: string;
					defaultValue?: string;
					allowEdit: true;
					onEdit: (value: string) => void;
			  }
	  );

const UserDetailTextField = ({
	label,
	defaultValue,
	allowEdit,
	loading,
	...props
}: UserDetailTextFieldProps) => {
	const [isEditing, setIsEditing] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	const handleEdit = () => {
		const value = inputRef?.current?.value?.trim();
		if (value && allowEdit) {
			props?.onEdit?.(value);
			setIsEditing(false);
		}
	};

	return (
		<div
			className='flex flex-col gap-3  relative'
			title={allowEdit ? 'Click on pencil icon to edit' : ''}
		>
			<Label>{label}</Label>
			<Input
				ref={inputRef}
				type={props.type ?? 'text'}
				readOnly={!isEditing}
				defaultValue={defaultValue}
				disabled={!allowEdit || loading ? true : undefined}
				className={`pr-10 relative border border-t-0 border-l-0 border-r-0 border-b-light-blue rounded-none ${
					allowEdit ? 'disabled:opacity-75' : ''
				}`}
				onKeyDown={(e) => {
					e.key === 'Enter' && handleEdit();
				}}
				placeholder={props?.placeholder}
			/>
			{loading && <DotsHorizontalIcon className='absolute right-3 bottom-3 animate-pulse' />}
			{allowEdit && !loading && (
				<>
					{!isEditing ? (
						<Pencil1Icon
							onClick={() => setIsEditing(true)}
							className='absolute right-3 bottom-3 cursor-pointer'
						/>
					) : (
						<div className='flex gap-3 items-center absolute  right-2.5 bottom-2'>
							<CheckIcon onClick={handleEdit} className='cursor-pointer h-5 w-5' />
							<Cross1Icon
								onClick={() => setIsEditing(false)}
								className='cursor-pointer'
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export const UpdatePassword = () => {
	const { passwordLoading: loading, handleUpdatePassword } = useModifyUser();
	return (
		<div className='flex flex-col gap-4'>
			<UserDetailTextField
				label='Update Password'
				type='password'
				allowEdit
				placeholder='New Password'
				loading={loading}
				onEdit={handleUpdatePassword}
			/>
			<p className='text-gray-400 text-sm'>
				{' '}
				A minimum of 8 characters with at least one uppercase letter, one lowercase letter,
				one number and one special character{' '}
			</p>
		</div>
	);
};

export const DeleteAccount = () => {
	const { deleteUserLoading, handleDeleteUser } = useModifyUser();
	return (
		<div className='flex flex-col gap-4'>
			<h4 className='text-red-600'>Danger zone!!!</h4>
			<Dialog>
				<DialogTrigger asChild>
					<Button variant='destructive' className='w-full'>
						Delete Account
					</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-md rounded-sm w-[30vw] min-w-[300px] bg-black text-white border-white  overflow-y-auto flex flex-col'>
					<DialogHeader>
						<DialogTitle>Delete Account</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete your account? This action is permanent.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button disabled={deleteUserLoading} variant='secondary'>
								Cancel
							</Button>
						</DialogClose>
						<DialogClose asChild>
							<Button
								variant='destructive'
								disabled={deleteUserLoading}
								onClick={handleDeleteUser}
							>
								Delete Account
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export const AccountDetailsForm = () => {
	const { user } = useAuthInfo();

	const { usernameLoading: loading, handleEditUsername } = useModifyUser();

	return (
		<>
			<ProfilePicture />

			<UserDetailTextField
				label='Username'
				defaultValue={user?.username ?? ''}
				allowEdit
				onEdit={handleEditUsername}
				loading={loading}
			/>

			<UserDetailTextField label='Email' defaultValue={user?.email ?? ''} allowEdit={false} />
		</>
	);
};

export const ProfilePicture = () => {
	const { user } = useAuthInfo();
	const { setUser } = useAuth();

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const res = await uploadToCloudinary(file);

		if (res?.secure_url) {
			setUser({ ...user, picture: res?.secure_url } as User);
			const apiRes = (await uploadProfilePicture(res?.secure_url)) as any;
			if (apiRes?.message) {
				toast({
					title: 'Profile picture updated',
					duration: 2000,
					variant: 'default',
					style: { backgroundColor: 'black', color: 'white', border: '1px solid purple' },
				});
			}
			return;
		}
		toast({
			title: 'Failed to upload profile picture',
			description: 'Something went wrong. Please try again later',
			duration: 2000,
			variant: 'destructive',
		});
	};

	return (
		<div className='w-full  flex flex-col gap-6 items-center'>
			<div className='w-52 h-52 relative rounded-full group cursor-pointer border-lime-300 border-[4px] '>
				<img
					src={user?.picture}
					alt='profile avatar'
					className='rounded-full w-full h-full object-cover'
				/>
				<div className='hidden group-hover:flex gap-2 cursor-pointer justify-center items-center rounded-full w-full h-full absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent'>
					<Pencil1Icon className='w-6 h-6 text-white' />
					<span>Upload profile picture</span>
					<Input
						type='file'
						className='opacity-0 absolute inset-0 min-h-full min-w-full z-4'
						accept='image/png,image/jpeg, image/webp'
						onChange={handleImageUpload}
					/>
				</div>
			</div>
		</div>
	);
};
