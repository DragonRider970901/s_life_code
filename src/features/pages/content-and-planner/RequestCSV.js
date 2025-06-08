import axios from "axios";
import React from "react";


export default function RequestCSV () {

    const token = localStorage.getItem('token');

    const handleRequest = async () => {

        try {

            await axios.post("http://localhost:5000/creator/request-csv", {},
                {
                    headers: { Authorization: `Bearer ${token}`},
                }
            );
            alert("Request sent to admin!");

        } catch (err) {
            alert("Failed to send request!");
        }
    }

    return (
        <div className="request-csv">
            <button onClick={handleRequest}>Request CSV</button>
        </div>
    );
}