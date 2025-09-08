import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import calculateType from "../../calculateType";
import { determineType, getActive, getWarehouse } from "../../utils/personalityUtils";
import { fetchTypes } from "../../store/typesSlice";

import "../../style/dektop/result.css";

export default function Result() {


    const [utype, setUtype] = useState({});

    const profile = useSelector((state) => state.test);
    calculateType(profile);

    const types = useSelector((state) => state.types.types);
    console.log("Types: ", types);
    const utypecode = determineType(profile);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTypes());
        //console.log("Types: ", types);

        for (const t of types) {
            console.log("t: ", t.type);
            console.log("utypecode: ", utypecode);
            if (t.type === utypecode) {
                setUtype(t);
                console.log("User Type: ", utype);
            }
        }
    }, []);

    const FACTOR_ORDER = ['h', 's', 'e', 'hy', 'k', 'p', 'd', 'm'];


    //console.log(utype);


    return (
        <div className="result">
            <div className="result-left">

            </div>
            <div className="result-main">
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

                <div className="type-description">
                    <h2>My Personality Type: {utype.type}</h2>

                    <div className="frequency">
                        <h3>Frequency</h3>
                        <ul>
                            <li>In overall population: {utype.frequency[0]}</li>
                            <li>In male population: {utype.frequency[1]}</li>
                            <li>In female population: {utype.frequency[2]}</li>
                        </ul>
                    </div>

                    <h3 >Rank According to Intellectual Potential: <span className="rank">{utype.rank} out of 16</span></h3>

                    <h3>General Description</h3>
                    <section dangerouslySetInnerHTML={{ __html: utype.general }} />

                    <h3>Behavior Patterns</h3>
                    <section dangerouslySetInnerHTML={{ __html: utype.behavior }} />

                    <h3>Core Structure</h3>
                    <section dangerouslySetInnerHTML={{ __html: utype.core }} />

                    <section>
                        <h3>Pressure Factors</h3>
                        <div dangerouslySetInnerHTML={{ __html: utype.pressure }} />
                    </section>
                    <section>
                        <h3>Regulation Factors</h3>
                        <div dangerouslySetInnerHTML={{ __html: utype.control_factor }} />
                    </section>
                </div>
            </div>
            <div className="result-right">

            </div>
        </div>
    )
}