import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import AuthContextProvider from './contexts/AuthContext.tsx';
import './index.css';
import { registerSW } from './serviceworkerRegistration.js';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<AuthContextProvider>
			<App />
		</AuthContextProvider>
	</BrowserRouter>,
);

import.meta.env.PROD && registerSW();
