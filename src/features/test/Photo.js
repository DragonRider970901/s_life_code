import React from "react";
import "../../style/desktop.css";


export default function Photo({photo, onClick, disabled}) {
    return (
        <div className={`photo ${disabled ? 'disabled' : ''}`} onClick={!disabled ? onClick : null} style={{ opacity: disabled ? 0.5 : 1 }}>
            <img src={photo}/>
        </div>
    );
}