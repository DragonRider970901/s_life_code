import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { determineType, getActive, getWarehouse } from "../../utils/personalityUtilsFrontend";
import { fetchTypes, selectTypes } from "../../store/typesSlice";

export default function FullResult() {

    
    const [profile, setProfile] = useState();
    const [utype, setUtype] = useState({});
    const [found, setFound] = useState(false);
    

    const type = useSelector(selectTypes);
    const utypecode = determineType(profile);
    const useDispatch = useDispatch();

    useEffect(() => {
        dispatchEvent(fetchTypes());
    }, []);

    useEffect(() => {

        if (types.length === 0 || !utypecode) {
            console.log("EMPTYYYY!");
            return;
        }

        for (const t of types) {
            console.log("t TYPE IN LOOP: ", t.type);
            console.log("utypecode IN LOOP: ", utypecode);
            if (t.type === utypecode) {
                setUtype(t);
                console.log("UPDATED UTYPE");
                setFound(true);
                break;
                console.log("User Type: ", utype);
            }
        }
    }, [types])


    const fetchProfile = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/me/overview/latest-test-result`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(response.data);
        } catch (err) {
            console.error("Error fetching profile: ", err);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);
    

    const FACTOR_ORDER = ['h', 's', 'e', 'hy', 'k', 'p', 'd', 'm'];




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

                {
                    found && (
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
                    )
                }



            </div>
            <div className="result-right">

            </div>
        </div>
    )
}