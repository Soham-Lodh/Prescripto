import { createContext } from 'react';
import { doctors } from "../assets/assets_frontend/assets";

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
    const currency='$'
    const value = {
        doctors,
        currency
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
