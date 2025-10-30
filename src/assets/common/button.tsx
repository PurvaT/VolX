import { LucideIcon } from "lucide-react";
import React, { useState, useEffect } from 'react';

interface ButtonProps {
    buttonTitle:string;
    buttonIcon?: LucideIcon;
    onClick?: () => void;
    className?: string;
}

const Button = (props: ButtonProps)=> {
    const {buttonTitle, onClick, buttonIcon, className} = props;
    return <button
              onClick={onClick}
              className={`${className}`}
            >
                {buttonIcon && <div>{React.createElement(buttonIcon)}</div>}
                {buttonTitle}
            </button>
}
export default Button;