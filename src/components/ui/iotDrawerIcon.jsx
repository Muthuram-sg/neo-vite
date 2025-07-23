 
import React from 'react';

const iotDrawerIcon = ({ children, onClick, selected,style }) => (
    <button
    style={style}
        className={`min-w-0 rounded-md hover:bg-Secondary_Interaction-secondary-active dark:hover:bg-Secondary_Interaction-secondary-active-dark dark:active:bg-Secondary_Interaction-secondary-active-dark focus:bg-Secondary_Interaction-secondary-active dark:focus:bg-Secondary_Interaction-secondary-active-dark p-2 border-0 capitalize ${
            selected ? 'bg-Secondary_Interaction-secondary-active dark:bg-Secondary_Interaction-secondary-active-dark' : ''
        }`}
        onClick={onClick}
    >
        {children}
    </button>
);

export default iotDrawerIcon;






