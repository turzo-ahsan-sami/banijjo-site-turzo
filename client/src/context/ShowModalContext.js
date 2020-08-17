import React, { useState, useEffect } from 'react';

export const ShowModalContext = React.createContext();

export const ShowModalProvider = (props) => {
    const [showModal, setShowModal] = useState(true);    
    useEffect(() => {
        var show_modal = localStorage.getItem('showModal') || true;
        setShowModal(show_modal)
    }, [])

    return (
        <ShowModalContext.Provider value={[showModal, setShowModal]}>
            {props.children}
        </ShowModalContext.Provider>
    )
}