/* eslint-disable no-mixed-spaces-and-tabs */

import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { AccountDetailsForm, UpdatePassword } from './account';

const ProfileDrawer = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent
				className='bg-gradient-dark text-white border-purple-900 w-full sm:w-3/4 flex flex-col gap-10'
				side={'left'}
			>
				<SheetHeader className='text-xl font-semibold -mt-3'>Profile</SheetHeader>
				<AccountDetailsForm />
				<UpdatePassword />
			</SheetContent>
		</Sheet>
	);
};

export default ProfileDrawer;
