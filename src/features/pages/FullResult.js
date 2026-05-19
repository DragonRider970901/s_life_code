import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { determineType, getActive, getWarehouse } from "../../utils/personalityUtilsFrontend";
import { fetchTypes, selectTypes } from "../../store/typesSlice";


export default function FullResult() {


    const [profile, setProfile] = useState();
    const [utype, setUtype] = useState({});
    const [found, setFound] = useState(false);
    const [utypecode, setUtypecode] = useState();
    const [tests, setTests] = useState([]);


    const types = useSelector(selectTypes);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTypes());
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
    }, [types, utypecode])

    const fetchTests = async () => {

        const token = localStorage.getItem('token');

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/me/overview/tests-taken`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTests(res.data);
        } catch (err) {
            console.log("Failed to fetch user tests: ", err);
        }
    }


    const fetchProfile = async () => {
        const token = localStorage.getItem('token');

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/me/overview/latest-test-result`, {
                headers: { Authorization: `Bearer ${token}` },
            });


            console.log("Type of data: ", typeof res.data);
            console.log("Type of result: ", typeof res.data.result);

            setProfile({
                ...res.data,
                result: JSON.parse(res.data.result)
            })


        } catch (err) {
            console.error("Error fetching profile: ", err);
        }
    }


    useEffect(() => {

        fetchProfile();
        fetchTests();

    }, []);

    useEffect(() => {

        if (profile) {
            console.log("Profile in useEffect: ", profile);
            const code = determineType(profile.result);
            setUtypecode(code);
            console.log("Utype code: ", utypecode);
        } else {
            console.log("No profile found in useEffect");
        }


    }, [profile])

    //const utypecode = determineType(profile);


    useEffect(() => {

        if (types.length === 0 || !utypecode) {
            console.log("EMPTYYYY!");
            return;
        }

        for (const t of types) {

            if (t.type === utypecode) {
                setUtype(t);
                setFound(true);
                break;

            }
        }
    }, [types])

    /*const getProfileNumber = () => {
        if (!profile || !tests) return '0';

        if (profile && tests.length > 0) {
            for (let i = 1; i <= tests.length; i++) {
                if (tests[i - 1].id === profile.id) {
                    return i.toString();
                    break;
                }
            }
        }
    }*/

    const FACTOR_ORDER = ['h', 's', 'e', 'hy', 'k', 'p', 'd', 'm'];




    return (
        <div className="full-result-page">

            {profile && tests.length > 0 && (
                <div className='full-result-container'>
                    <h1 className='full-result-header'>Profile </h1>

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
                                    const vals = profile?.result?.[f]?.values ?? [0, 0, 0]; // [pos,neg,latent]
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
                                    const vals = profile?.result?.[f]?.values ?? [0, 0, 0]; // [pos,neg,latent]
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
                                    const vals = profile?.result?.rez?.[f] ?? [0, 0, 0]; // [pos,neg,latent]
                                    return <td key={f}>{getWarehouse(vals)}</td>;
                                })}
                            </tr>
                        </tbody>
                    </table>

                    <h3>Type: {profile.type}</h3>
                </div>
            )}
        </div>
    )
}