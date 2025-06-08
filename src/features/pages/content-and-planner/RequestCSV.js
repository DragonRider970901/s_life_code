import axios from "axios";
import React, { useState } from "react";


export default function RequestCSV () {


    const [ requestFor, setRequestFor ] = useState('');
    const [ reason, setReason ] = useState('');



    const handleRequest = async (e) => { 

        e.preventDefault();
        const token = localStorage.getItem('token');

        try {

            await axios.post("http://localhost:5000/creator/request-csv", { requestFor, reason },
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
            <form onSubmit={handleRequest}>
                <input type="text" value={requestFor} onChange={(e) => setRequestFor(e.target.value)} placeholder="What CSV do you need?" />
                <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why do you need this CSV?" />
                <button>Request CSV</button>
            </form>
            
        </div>
    );
}