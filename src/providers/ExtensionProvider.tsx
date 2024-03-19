import React, { createContext } from 'react';
import { ExtensionFacadeService } from '../services/extension.facade.service';

const service = new ExtensionFacadeService();
const ExtensionServiceContext = createContext(service)

const ExtensionServiceProvider: React.FC<any> = ({children}) => {
    return (
        <ExtensionServiceContext.Provider value={service}>
            {children}
        </ExtensionServiceContext.Provider>
    )
}

export { ExtensionServiceContext, ExtensionServiceProvider }
