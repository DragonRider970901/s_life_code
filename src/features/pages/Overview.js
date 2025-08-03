import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Overview () {

    const [ tests, setTests ] = useState([]);

    const fetchTests = async () => {

        const token = localStorage.getItem('token');

        try {

            const res = await axios.get('/me/overview/tests-taken', {
                headers: {Authorization: `Bearer ${token}`},
            });
            console.log(res.data);
            setTests(res.data);
        } catch(err) {
            alert("Failed to fetch user tests");
        }
    }

    useEffect(() => {
        fetchTests();
    }, []);

    return (<div className="overview">
        <h2>overview</h2>
        {tests.length === 0 && (
            <div>
                <p>No tests taken yet!</p>
                <p>Give it a try!</p>
            </div>
        )}
    </div>)
}