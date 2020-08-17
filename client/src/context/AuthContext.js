import React, { useState } from 'react';

export const AuthContext = React.createContext();

export const AuthProvider = (props) => {
    const [authInfo, setAuthInfo] = useState([]);
    return (
        <AuthContext.Provider value={[authInfo, setAuthInfo]}>
            {props.children}
        </AuthContext.Provider>
    )
}