import React, { Fragment, useContext, useEffect, useState } from 'react'
import UserssItem from './UserssItem';
import UserssContext from '../../context/users/userssContext';
import axios from 'axios';

const Usersss = () => {
    const [users, setUsers] = useState([]); 

    useEffect(() => {
        let isMounted = true; 
        axios.get('/api/users/').then((res) => { 
            if (isMounted) setUsers(res.data); 
        })
        return () => { isMounted = false };
    }, []);

    const { usersss } = users;

    return (
        <Fragment>
            {users.map(userss => (
                <UserssItem key={userss._id} userss={userss} />
            ))}
        </Fragment>
    )
}

export default Usersss;