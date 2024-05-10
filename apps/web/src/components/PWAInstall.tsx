import { Fragment, useEffect, useState } from 'react';
import logo from '../../assets/logo192.png';
import { Button } from './ui/button';

const PwaInstallPrompt = ({ onInstall, onClose }: any) => {
	return (
		<div className='fixed bottom-0 left-0 right-0 z-50 flex flex-col md:flex-row items-center justify-center gap-3 px-4 py-8 bg-gradient-to-tr from-[#030307] to-[#2a0909]'>
			<div className='flex items-center gap-3 self-end md:self-auto'>
				<img src={logo} alt='logo' className='w-8 h-8 rounded-full border-2' />
				<p className='text-white text-center text-sm md:text-base'>
					Add VI Messenger to your home screen.
				</p>
			</div>
			<div className='flex items-center gap-2 self-end  md:self-auto'>
				<Button
					onClick={onInstall}
					variant={'secondary'}
					className='bg-purple-900 border border-purple-950 text-white hover:bg-purple-400 hover:border-cyan-600 text-sm md:text-base'
				>
					Install
				</Button>
				<Button
					variant='outline'
					onClick={onClose}
					className='bg-transparent text-white text-sm md:text-base'
				>
					Close
				</Button>
			</div>
		</div>
	);
};

const PWAInstall = () => {
	const [promptVisible, setPromptVisible] = useState(false);
	const [prompt, setPrompt] = useState<any>(null);
	const [isPromptClosed, setIsPromptClosed] = useState(
		sessionStorage.getItem('in-app-install-dismissed') === 'true',
	);

	useEffect(() => {
		const handleBeforeInstallPrompt = (event: any) => {
			event.preventDefault();

			if (!window.matchMedia('(display-mode: standalone)').matches) {
				setPrompt(event);
				setPromptVisible(true);
			}
		};
		const handleAppInstalled = () => {
			setPrompt(null);
			setPromptVisible(false);
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
		window.addEventListener('appinstalled', handleAppInstalled);
		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
			window.removeEventListener('appinstalled', handleAppInstalled);
		};
	}, []);

	const handleInstall = () => {
		if (prompt) {
			prompt.prompt();
			prompt.userChoice.then((choiceResult: any) => {
				if (choiceResult.outcome === 'accepted') {
					setPromptVisible(false);
				} else {
					setPromptVisible(false);
				}
			});
		}
	};

	const handleClose = () => {
		setPromptVisible(false);
		setIsPromptClosed(true);
		sessionStorage.setItem('in-app-install-dismissed', 'true');
	};

	return (
		<Fragment>
			{promptVisible && !isPromptClosed && (
				<PwaInstallPrompt onInstall={handleInstall} onClose={handleClose} />
			)}
		</Fragment>
	);
};

export default PWAInstall;
