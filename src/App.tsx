import React from 'react';
import './App.css';
import CreateRepoForm from './components/CreateRepoForm';
import { ExtensionServiceProvider } from './providers/ExtensionProvider';

function App() {
    return (
        <React.StrictMode>
            <ExtensionServiceProvider>
                <CreateRepoForm></CreateRepoForm>
            </ExtensionServiceProvider>
        </React.StrictMode>
    );
}

export default App;
