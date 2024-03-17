import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Button } from '../ui/button';
import { CardContent, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

import useAuth from '@/hooks/auth/useAuth';
import { AUTH_FORM_VALIDATIONS } from '@/lib/auth';

import { AuthFormData } from '@/types/auth';

const RegisterForm = () => {
	const { handleRegister } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthFormData>({
		mode: 'onTouched',
		defaultValues: {
			email: '',
			password: '',
			username: '',
		},
	});

	const onSubmit = (data: AuthFormData) => {
		handleRegister(data);
	};

	const getInputClasses = (name: keyof AuthFormData) => {
		return clsx('text-gray-300 shadow-lg border-light-grey focus-visible:border-gray-600', {
			'border-red-900 focus-visible:border-red-800': errors?.[name],
		});
	};
	return (
		<form className='w-full' onSubmit={handleSubmit(onSubmit)}>
			<CardContent className='flex flex-col gap-5 w-full'>
				<div className='flex flex-col gap-2.5'>
					<Label className='text-white font-medium' htmlFor='username'>
						Username
					</Label>
					<Input
						type='text'
						placeholder='Johndoe'
						autoComplete='off'
						required
						className={getInputClasses('username')}
						{...register('username', AUTH_FORM_VALIDATIONS.username)}
					/>
					{errors?.username && (
						<p className='text-red-600 text-xs'>{errors.username?.message}</p>
					)}
				</div>
				<div className='flex flex-col gap-2.5'>
					<Label className='text-white font-medium' htmlFor='email'>
						Email
					</Label>
					<Input
						type='email'
						placeholder='Johndoe@example.com'
						autoComplete='off'
						className={getInputClasses('email')}
						{...register('email', AUTH_FORM_VALIDATIONS.email)}
					/>
					{errors?.email && (
						<p className='text-red-600 text-xs'>{errors.email?.message}</p>
					)}
				</div>
				<div className='flex flex-col gap-2.5'>
					<Label className='text-white font-medium' htmlFor='email'>
						Password
					</Label>
					<Input
						type='password'
						placeholder='**********'
						autoComplete='off'
						className={getInputClasses('password')}
						{...register('password', AUTH_FORM_VALIDATIONS.password)}
					/>
					{errors?.password && (
						<p className='text-red-500 text-xs'>{errors.password?.message}</p>
					)}
				</div>
			</CardContent>
			<CardFooter className='w-full flex flex-col gap-4'>
				<Button
					variant={'default'}
					className='w-full bg-black hover:bg-black hover:bg-opacity-60 shadow-lg'
				>
					Register
				</Button>
				<Link to={'/u/login'} className='w-full'>
					<Button variant={'secondary'} className='w-full shadow-lg'>
						Login
					</Button>
				</Link>
			</CardFooter>
		</form>
	);
};

export default RegisterForm;
