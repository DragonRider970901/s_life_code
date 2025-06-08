import axios from "axios";
import React, { useEffect, useState } from "react";
import RequestTile from "../../components/RequestTile";

export default function SeeRequests() {

    const [requests, setRequests] = useState([]);
    const [responded, setResponded] = useState();




    const fetchRequests = async () => {


        const token = localStorage.getItem('token');
        try {
            const res = await axios.get("http://localhost:5000/admin/requests", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("REQUESTS: ", res.data);
            setRequests(res.data);

        } catch (err) {

        }
    }



    const handleApprove = async (id) => {

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(`http://localhost:5000/admin/approve-request/${id}`, {}, {
               
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Request approved.");

            

            fetchRequests();
            //handleDownload();
        } catch (err) {
            alert("Failed to approve request.");
        }
    }

    const handleReject = async (id) => {


        const token = localStorage.getItem('token');

        try {
            await axios.post(`http://localhost:5000/admin/reject-request/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Request rejected.");
            fetchRequests();
        } catch (err) {
            alert("Failed to reject request.");
        }
    }

    useEffect(() => {

        fetchRequests();
    }, []);

    return (
        <div className="requests">
            <h2>Requests</h2>

            {requests && requests.length > 0 && (


                requests.map((request) => (<RequestTile key={request.id} request={request} onApprove={handleApprove} onReject={handleReject} />))

            )}
        </div>
    );
}