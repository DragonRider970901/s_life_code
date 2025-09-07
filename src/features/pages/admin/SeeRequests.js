import axios from "axios";
import React, { useEffect, useState } from "react";
import RequestTile from "../../components/RequestTile";


import "../../../style/dektop/see-requests.css";

export default function SeeRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]); // Multi-select filter

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/admin/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      alert("Failed to fetch requests.");
    }
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:5000/admin/approve-request/${id}`,
        {},
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "research_data.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert("Request approved.");
      fetchRequests();
    } catch (err) {
      alert("Failed to approve request.");
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/admin/reject-request/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Request rejected.");
      fetchRequests();
    } catch (err) {
      alert("Failed to reject request.");
    }
  };

  // Toggle selected statuses
  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Apply filters
  const filteredRequests = requests.filter(
    (req) =>
      selectedStatuses.length === 0 || selectedStatuses.includes(req.status)
  );

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="requests">
      <h2>Requests</h2>

      {/* Filter Buttons */}
      <div style={{ marginBottom: "15px" }}>
        {["pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => toggleStatus(status)}
            style={{
              marginRight: "10px",
              backgroundColor: selectedStatuses.includes(status)
                ? "#FDAC61"
                : "#e0e0e0",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Request List */}
      {filteredRequests.length > 0 ? (
        filteredRequests.map((request) => (
          <RequestTile
            key={request.id}
            request={request}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))
      ) : (
        <p>No requests match the selected filters.</p>
      )}
    </div>
  );
}
