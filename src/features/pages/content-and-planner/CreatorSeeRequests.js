import axios from "axios";
import React, { useEffect, useState } from "react";

export default function CreatorSeeRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/creator/requests", {
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
      const response = await axios.get(`http://localhost:5000${filePath}`, {
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
  }, []);

  return (
    <div className="creator-requests">
      <h2>Your Data Requests</h2>

      {requests.length > 0 ? (
        <ul>
          {requests.map((req) => (
            <li key={req.id} style={{ marginBottom: "15px" }}>
              <strong>Status:</strong> {req.status} <br />
              <strong>Requested on:</strong> {new Date(req.created_at).toLocaleString()} <br />
              {req.status === "approved" && req.file_path && (
                <button onClick={() => handleDownload(req.file_path, req.id)}>
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
