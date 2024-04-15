import { useEffect, useRef } from 'react';

type FileuploaderProps = {
	onUploadSuccess: (result: any) => void;
	onUploadError: (error: any) => void;
	children: ({ openWidget }: { openWidget: () => void }) => JSX.Element;
};

const Fileuploader = ({ onUploadSuccess, onUploadError, children }: FileuploaderProps) => {
	const widgetRef = useRef<any>(null);

	useEffect(() => {
		if ('cloudinary' in window) {
			// @ts-expect-error No types available
			widgetRef.current = window.cloudinary.createUploadWidget(
				{
					cloudName: 'dsyrltebn',
					uploadPreset: 'vdth9cfm',
					sources: ['local', 'url'],
					defaultSource: 'local',
					showCompletedButton: true,
					cropping: true,
					multiple: true,
					clientAllowedFormats: ['png', 'jpg', 'svg', 'webp', 'mp4', 'mov', 'wmv'],
					styles: {
						palette: {
							window: '#000000',
							sourceBg: '#000000',
							windowBorder: '#8E9FBF',
							tabIcon: '#FFFFFF',
							inactiveTabIcon: '#8E9FBF',
							menuIcons: '#2AD9FF',
							link: 'purple',
							action: '#336BFF',
							inProgress: '#00BFFF',
							complete: '#33ff00',
							error: '#EA2727',
							textDark: '#000000',
							textLight: '#FFFFFF',
						},
						frame: {
							background: '#0e0e0e69',
						},
						fonts: {
							default: null,
							"'Archivo', sans-serif": {
								url: 'https://fonts.googleapis.com/css?family=Archivo',
								active: true,
							},
						},
					},
				},
				(err: any, res: any) => {
					if (err) {
						onUploadError(err);
					}

					if (!err && res?.event === 'success') {
						onUploadSuccess(res?.info);
					}
				},
			);
		}
	}, [onUploadError, onUploadSuccess]);

	return children({ openWidget: () => widgetRef?.current?.open() });
};

export default Fileuploader;
