/* eslint-disable no-mixed-spaces-and-tabs */
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuthInfo from '@/hooks/auth/useAuthInfo';
import { CheckIcon, Cross1Icon, Pencil1Icon } from '@radix-ui/react-icons';
import { useRef, useState } from 'react';

type UserDetailTextFieldProps =
	| {
			label: string;
			defaultValue?: string;
			type?: string;
			placeholder?: string;
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
		<div className='flex flex-col gap-3  relative'>
			<Label>{label}</Label>
			<Input
				ref={inputRef}
				type={props.type ?? 'text'}
				readOnly={!isEditing}
				defaultValue={defaultValue}
				disabled={!allowEdit ? true : undefined}
				className={`pr-10 relative border border-t-0 border-l-0 border-r-0 border-b-light-blue rounded-none ${
					allowEdit ? 'disabled:opacity-75' : ''
				}`}
				placeholder={props?.placeholder}
			/>
			{allowEdit && (
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
	return (
		<div className='flex flex-col gap-4'>
			<UserDetailTextField
				label='Update Password'
				type='password'
				allowEdit
				onEdit={(v) => console.log(v)}
				placeholder='New Password'
			/>
			<p className='text-gray-400 text-sm'>
				{' '}
				A minimum of 8 characters with at least one uppercase letter, one lowercase letter,
				one number and one special character{' '}
			</p>
		</div>
	);
};

export const AccountDetailsForm = () => {
	const { user } = useAuthInfo();

	return (
		<>
			<div className='w-full flex flex-col gap-6 items-center '>
				<img
					src={user?.picture ?? 'https://i.pravatar.cc/300'}
					alt='profile avatar'
					className='w-52 h-52 rounded-full border-lime-300 border-[4px]'
				/>
			</div>

			<UserDetailTextField
				label='Username'
				defaultValue={user?.username ?? ''}
				allowEdit
				onEdit={(v) => console.log(v)}
			/>

			<UserDetailTextField label='Email' defaultValue={user?.email ?? ''} allowEdit={false} />
		</>
	);
};
