import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { CardContent, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const LoginForm = () => {
	return (
		<form className='w-full'>
			<CardContent className='flex flex-col gap-5 w-full'>
				<div className='flex flex-col gap-3'>
					<Label className='text-white font-medium' htmlFor='email'>
						Email
					</Label>
					<Input
						type='email'
						name='email'
						placeholder='Johndoe@example.com'
						required
						className='text-gray-300 shadow-lg border-light-grey '
					/>
				</div>
				<div className='flex flex-col gap-3'>
					<Label className='text-white font-medium' htmlFor='email'>
						Password
					</Label>
					<Input
						type='password'
						name='password'
						placeholder='**********'
						required
						className='text-gray-300 shadow-lg border-light-grey focus-visible:border-gray-600'
					/>
				</div>
			</CardContent>
			<CardFooter className='w-full flex flex-col gap-4'>
				<Button
					variant={'default'}
					className='w-full bg-black hover:bg-black hover:bg-opacity-60 shadow-lg'
				>
					Login
				</Button>
				<Link to={'/register'} className='w-full focus:outline-none'>
					<Button variant={'secondary'} className='w-full shadow-lg'>
						Register
					</Button>
				</Link>
			</CardFooter>
		</form>
	);
};

export default LoginForm;
