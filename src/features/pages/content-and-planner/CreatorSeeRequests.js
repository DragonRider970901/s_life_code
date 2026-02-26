import axios from "axios";
import React, { useEffect, useState } from "react";


import "../../../style/dektop/creator-see-requests.css";

export default function CreatorSeeRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    
    try {
      const res = await axios.get(`${window.location.origin}/creator/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      alert("Failed to fetch your requests.");
    }
  };

  const handleDownload = async (filePath, requestId) => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await axios.get(`${window.location.origin}${filePath}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `research_data_${requestId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download the file.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [requests]);

  return (
    <div className="creator-requests">
      <h2>Your Data Requests</h2>

      {requests.length > 0 ? (
        <ul>
          {requests.map((req) => (
            <li key={req.id} style={{ marginBottom: "15px" }}>
              <div className="request-info-line"><strong className="request-label">Requested CSV:</strong> <p className="request-for">{req.request_for}</p></div>
              <div className="request-info-line"><strong className="request-label">Reason:</strong> <p className="request-reason">{req.reason}</p></div>
              <div className="request-info-line"><strong className="request-label">Status:</strong> <p className="request-status">{req.status}</p></div>
              <div className="request-info-line"><strong className="request-label">Requested on:</strong> <p className="request-date">{new Date(req.created_at).toLocaleString()}</p></div>
              <div className="request-info-line"><strong className="request-label">Responded on:</strong> <p className="request-date">{new Date(req.responded_at).toLocaleString()}</p></div>
              {req.status === "approved" && req.file_path && (
                <button onClick={() => handleDownload(req.file_path, req.id)} className="download-csv-button">
                  Download CSV
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No requests yet.</p>
      )}
    </div>
  );
}
