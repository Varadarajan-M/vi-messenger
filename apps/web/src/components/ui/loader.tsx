import { CSSProperties } from 'react';

const Loader = ({ size }: { size: string }) => {
	return <div className='loader' style={{ '--loader-size': size } as CSSProperties}></div>;
};

export default Loader;
