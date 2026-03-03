import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import "../../../style/dektop/edit-profile.css";

export default function EditProfile() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        axios.get(`${process.env.REACT_APP_API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            setUsername(res.data.username);
            setEmail(res.data.email);
            if (res.data.profile_pic) setPreview(`${process.env.REACT_APP_API_URL}${res.data.profile_pic}`);
        });
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        const formData = new FormData();
        if (username) formData.append('username', username);
        if (email) formData.append('email', email);
        if (profilePic) formData.append('profile_pic', profilePic);

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/me/update-profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Profile updated successfully");
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert("Update failed");
        }
    };


    return (
        <div className="edit-profile">
            <h2>Edit Profile</h2>
            <form onSubmit={handleUpdate}>
                <div className='edit-input-fields'>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    id="choose-profile-picture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        setProfilePic(e.target.files[0]);
                        setPreview(URL.createObjectURL(e.target.files[0]));
                    }}
                    className='choose-profile-picture'
                />
                <label for="choose-profile-picture">Choose Picture</label>
                </div>
                {preview && <img src={preview} alt="" width={100} />}
                <button type="submit">Update</button>
            </form>
        </div>
    );
}
