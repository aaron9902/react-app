import React, { Fragment, useContext, useEffect, useState } from 'react'
import UserItem from './UserItem';
import UserContext from '../../context/users/userContext';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]); 

    useEffect(() => {
        let isMounted = true; 
        axios.get('/api/users/').then((res) => { 
            if (isMounted) setUsers(res.data); 
        })
        return () => { isMounted = false };
    }, []);

    return (
        <Fragment>
            {users.map(user => (
                <UserItem key={user._id} user={user} />
            ))}
        </Fragment>
    )
}

export default Users;