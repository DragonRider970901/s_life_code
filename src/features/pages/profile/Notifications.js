import axios from "axios";
import React, { useEffect, useState } from "react";

import "../../../style/dektop/notifications.css";


import MessageIcon from "../../../style/res/icons/email.png";
export default function Notifications() {

    const [ notifications, setNotifications ] = useState([]);

    const fetchNotifications = async () => {

        const token = localStorage.getItem('token');

        try {

            const res = await axios.get('http://localhost:5000/me/notifications', {
                headers: {Authorization: `Bearer ${token}`},
            });

            setNotifications(res.data);
        } catch(err) {
            console.error("Error (from frontend) in fetching notifications: ", err);
        }
    };


    const markAllSeen = async () => {

        const token = localStorage.getItem('token');

        try {

            await axios.post("http://localhost:5000/me/notifications/mark-seen", {}, {
                headers: {Authorization: `Bearer ${token}`},
            });

            setNotifications([]);


        } catch (err) {
            console.error("Error (from frontend) in updating notifications status: ", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [])
    return (
    <div className="notifications">
        <h2>Notifications</h2>

        {notifications.length === 0 ? 
        (<p>No new notifications.</p>) : (
            <ul>
                {
                    notifications.map((notification) => (
                    <li key={notification.id}>
                        {notification.type === 'message' && (<img src={MessageIcon} />)}
                        <div className="notification-details">
                            <p className="notification-type">{notification.type==='message' ? "Message":""}</p>
                            <p className="notification-date">sent at {new Date(notification.date).toLocaleString()}</p>
                        </div>
                    </li>))
                }
            </ul>
        )}

        {notifications.length > 0 && (
            <button onClick={markAllSeen}>Mark All As Seen</button>
        )}
        
    </div>);
}