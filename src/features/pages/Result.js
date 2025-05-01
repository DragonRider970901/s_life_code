import React from "react";
import { useSelector } from "react-redux";
import calculateType from "../../calculateType";

export default function Result() {


    const profile = useSelector((state) => state.test);
    calculateType(profile);
    return (
        <div className="result">
            <h1>result</h1>
            
        </div>
    )
}