import axios from "axios";
import React, { useEffect, useState } from "react";


import "../../style/dektop/overview.css";
import { interpretFactor } from "../../../utils/personalityUtils";
import { NavLink } from "react-router-dom";

export default function Overview() {

    const [tests, setTests] = useState([]);

    const fetchTests = async () => {

        const token = localStorage.getItem('token');

        try {
            
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/me/overview/tests-taken`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            //console.log(res.data);
            setTests(res.data);
        } catch (err) {
            alert("Failed to fetch user tests");
        }
    }

    useEffect(() => {
        fetchTests();
    }, []);

    const latest = tests.slice().sort((a, b) => {
        const ta = new Date(a.date).getTime();
        const tb = new Date(b.date).getTime();
        if (tb !== ta) return tb - ta;
        return (b.id ?? 0) - (a.id ?? 0);
    })[0] || null;

    const latestResult = latest
        ? (typeof latest.result === 'string' ? JSON.parse(latest.result) : latest.result)
        : null;

    const FACTOR_ORDER = ['h', 's', 'e', 'hy', 'k', 'p', 'd', 'm'];

    return (<div className="overview">
        <h2>Overview</h2>

        {
            tests.length > 0 && (
                <table>
                    <tbody>
                    <tr>
                        <th>Tests Taken</th>
                        <td>{tests.length}</td>
                    </tr>
                    <tr>
                        <th>Surveys Taken</th>
                        <td>0</td>
                    </tr>
                    <tr>
                        <th>Articles Written</th>
                        <td>0</td>
                    </tr>
                    <tr>
                        <th>Surveys Created</th>
                        <td>0</td>
                    </tr></tbody>
                </table>
            )
        }

        <h2>Tests Taken</h2>

        {tests.length === 0 && (
            <div>
                <p>No tests taken yet!</p>
                <p>Give it a try!</p>
            </div>
        )}

        {
            tests.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>DATE</th>
                            <th>TYPE</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>

                        {tests.map(uTest => (
                            <tr key={uTest.id}>
                                <td>{new Date(uTest.date).toLocaleDateString()}</td>
                                <td>{uTest.type}</td>
                                <td>See full result</td>
                            </tr>
                        ))}</tbody>
                </table>
            )
        }
        <h2>Last Result</h2>
        {
            tests.length > 0 && latest && (
                <div className="latest-result">
                    <div className="latest-result-details">
                        <div className="result-date"><p className="result-details-label">Date:</p>  <p className="date">{new Date(latest.date).toLocaleDateString()}</p> </div>
                        <div className="result-type"><p className="result-details-label">Type:</p>  <p className="type">{latest.type}</p> </div>
                        <p className="result-details-label">Factors:</p>
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
                                        const vals = latestResult?.[f]?.values ?? [0, 0, 0]; // [pos,neg,latent]
                                        return <td key={f}>{interpretFactor(vals)}</td>;
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <NavLink to='' className='full-result'>See Full Result</NavLink>
                </div>
            )
        }
    </div>)
}