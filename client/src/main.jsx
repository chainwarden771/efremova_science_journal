import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import ProfileProvider from "./shared/context/ProfileProvider";
import ModalProvider from "./shared/context/ModalProvider";

createRoot(document.getElementById('root')).render(
    <ProfileProvider>
        <ModalProvider>
            <App />
        </ModalProvider>
    </ProfileProvider>
);