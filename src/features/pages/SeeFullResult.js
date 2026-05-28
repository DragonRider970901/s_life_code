import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function SeeFullResult() {

    const [profile, setProfile] = useState();
    const [tests, setTests] = useState([]);


    const { id } = useParams();

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

            const res = await axios.get(`${process.env.REACT_APP_API_URL}/me/overview/test-result/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setProfile({
                ...res.data,
                result: typeof res.data.result === "string" ? JSON.parse(res.data.result) : res.data.result,

            })
            console.log("Fetched profile: ", profile);

        } catch (err) {
            console.error("Error fetching selected profile: ", err);
        }
    }

    useEffect(() => {
        fetchProfile();
        console.log("Profile after fetch: ", profile);
        fetchTests();
    }, []);

    const getProfileNumber = () => {
        if (!profile || tests.length === 0) return '0';

        if (profile && tests.length > 0) {
            for (let i = 1; i <= tests.length; i++) {
                if (tests[i - 1].id === profile.id) {
                    return i.toString();
                    break;
                }
            }
        }
    }

    const FACTOR_ORDER = ['h', 's', 'e', 'hy', 'k', 'p', 'd', 'm'];

    return (
        <div className="see-full-result">
            <h1>See Full Result</h1>
            <p>{profile && tests.length > 0 ? (
                <div className="full-result-container">
                    <h2 className="full-result-header"> Profile Number {getProfileNumber()}</h2>

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
                                
                            </tr>
                        </tbody>
                    </table>

                </div>) : "Loading..."}</p>
        </div>
    );
}