import React from 'react';
import classes from './MButton.module.css';
const MButton = ({children, ...props}) => {
    return (
        <button {...props} className={classes.mBtn}>
           {children}
        </button>
    );
};

export default MButton;