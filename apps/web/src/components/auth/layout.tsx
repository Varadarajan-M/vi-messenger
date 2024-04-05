import { Card, CardHeader, CardTitle } from '../ui/card';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className='bg-black h-screen w-full overflow-hidden flex justify-center items-center px-5'>
			<Card className='bg-gradient-dark px-0 py-3 max-w-80 w-80 min-w-72 sm:min-w-80 border-dark-grey flex flex-col items-center justify-center gap-3'>
				<CardHeader className=''>
					<CardTitle className='text-2xl text-white'>VI Messenger</CardTitle>
				</CardHeader>
				{children}
			</Card>
		</main>
	);
};

export default AuthLayout;
