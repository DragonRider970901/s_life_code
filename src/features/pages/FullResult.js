import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";


export default function FullResult({ latest }) {

    const [utype, setUtype] = useState({});
    const [found, setFound] = useState(false);
    const [ profile, setProfile ] = useState({});
    //const profile = useSelector((state) => state.test);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(response.data);
        } catch (err) {
            console.error("Error fetching profile: ", err);
        }
    }
    //calculateType(profile);

    //const types = useSelector(selectTypes);
    //console.log("Types: ", types);
    //const utypecode = determineType(profile);
    const dispatch = useDispatch();

    useEffect(() => {
        //dispatch(fetchTypes());
        console.log("Profile in useEffect: ", profile);
    }, []);

    /*useEffect(() => {
        if (types.length === 0 || !utypecode) {
            console.log("EMPTYYYY!");
            console.log("TYPES LENGTH: ", types.length);
            console.log("UTYPECODE IN USE EFFECT:", utypecode);
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
    }, [types]);*/

    const FACTOR_ORDER = ['h', 's', 'e', 'hy', 'k', 'p', 'd', 'm'];


    //console.log(utype);


    return (
        <div className="full-result">
            
        </div>
    )
}