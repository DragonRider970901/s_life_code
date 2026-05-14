import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { determineType, getActive, getWarehouse } from "../../utils/personalityUtilsFrontend";
import { fetchTypes, selectTypes } from "../../store/typesSlice";

export default function FullResult() {

    
    const [profile, setProfile] = useState();
    const [utype, setUtype] = useState({});
    const [found, setFound] = useState(false);
    const [utypecode, setUtypecode] = useState();
    

    const types = useSelector(selectTypes);
    //const utypecode = determineType(profile);
    const useDispatch = useDispatch();

    useEffect(() => {
        dispatchEvent(fetchTypes());
    }, []);

    /*useEffect(() => {

        if (types.length === 0 || !utypecode) {
            console.log("EMPTYYYY!");
            return;
        }

        for (const t of types) {
            console.log("t TYPE IN LOOP: ", t.type);
            console.log("utypecode IN LOOP: ", utypecode);
            if (t.type === utypecode) {
                setUtype(t);
                console.log("UPDATED UTYPE");
                setFound(true);
                break;
                console.log("User Type: ", utype);
            }
        }
    }, [types])*/


    const fetchProfile = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/me/overview/latest-test-result`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(response.data);
            setUtypecode(determineType(response.data));
        } catch (err) {
            console.error("Error fetching profile: ", err);
        }
    }

    useEffect(() => {
        fetchProfile();
        //setUtypecode(determineType(profile));
    }, []);

    //const utypecode = determineType(profile);


    useEffect(() => {

        if (types.length === 0 || !utypecode) {
            console.log("EMPTYYYY!");
            return;
        }

        for (const t of types) {
            console.log("t TYPE IN LOOP: ", t.type);
            console.log("utypecode IN LOOP: ", utypecode);
            if (t.type === utypecode) {
                setUtype(t);
                console.log("UPDATED UTYPE");
                setFound(true);
                break;
                console.log("User Type: ", utype);
            }
        }
    }, [types])
    

    const FACTOR_ORDER = ['h', 's', 'e', 'hy', 'k', 'p', 'd', 'm'];




    return (
        <div className="result">
            <h1>{profile.user_id}</h1>
        </div>
    )
}