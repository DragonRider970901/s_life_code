import React from "react";
import { useSelector } from "react-redux";
import calculateType from "../../calculateType";
import { getActive, getWarehouse } from "../../utils/personalityUtils";


import "../../style/dektop/result.css";

export default function Result() {


    const profile = useSelector((state) => state.test);
    calculateType(profile);

    const FACTOR_ORDER = ['h', 's', 'e', 'hy', 'k', 'p', 'd', 'm'];

    return (
        <div className="result">
            <div className="result-left">

            </div>
            <diV className="result-main">
                <h2>My Result</h2>

                <h3>Active Profile</h3>
                <table>
                    <thead>
                        <th>H</th>
                        <th>S</th>
                        <th>E</th>
                        <th>HY</th>
                        <th>K</th>
                        <th>P</th>
                        <th>D</th>
                        <th>M</th>
                    </thead>
                    <tbody>
                        <tr>
                            {FACTOR_ORDER.map(f => {
                                const vals = profile?.[f]?.values ?? [0, 0, 0]; // [pos,neg,latent]
                                return <td key={f}>{getActive(vals)}</td>;
                            })}
                        </tr>
                    </tbody>
                </table>

                <h3>Latent Profile</h3>
                <table>
                    <thead>
                        <th>H</th>
                        <th>S</th>
                        <th>E</th>
                        <th>HY</th>
                        <th>K</th>
                        <th>P</th>
                        <th>D</th>
                        <th>M</th>
                    </thead>
                    <tbody>
                        <tr>
                            {FACTOR_ORDER.map(f => {
                                const vals = profile?.[f]?.values ?? [0, 0, 0]; // [pos,neg,latent]
                                return <td key={f}>-{vals[2]}</td>;
                            })}
                        </tr>
                    </tbody>
                </table>

                <h3>Warehouse</h3>
                <table>
                    <thead>
                        <th>H</th>
                        <th>S</th>
                        <th>E</th>
                        <th>HY</th>
                        <th>K</th>
                        <th>P</th>
                        <th>D</th>
                        <th>M</th>
                    </thead>
                    <tbody>
                        <tr>
                            {FACTOR_ORDER.map(f => {
                                const vals = profile?.rez?.[f] ?? [0, 0, 0]; // [pos,neg,latent]
                                return <td key={f}>{getWarehouse(vals)}</td>;
                            })}
                        </tr>
                    </tbody>
                </table>
            </diV>
            <div className="result-right">
                
            </div>
        </div>
    )
}