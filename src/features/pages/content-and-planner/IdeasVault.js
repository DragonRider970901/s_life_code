import React from "react";
import RequestCSV from "./RequestCSV";
import CreatorSeeRequests from "./CreatorSeeRequests";
import MLTools from "./MLTools";

import "../../../style/dektop/ideas-vault.css";

export default function IdeasVault () {

    return (
        <div className="ideas-vault">

            <h2>Ideas Vault</h2>
            <RequestCSV />

            <CreatorSeeRequests />

            <h2>Creator ML Tools</h2>
            <MLTools />
            
            
        </div>
    );
}