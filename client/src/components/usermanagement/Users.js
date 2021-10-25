import React, { Fragment, useEffect, useState } from 'react';
import UserItem from './UserItem';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]); 

// Get all users and update the users state
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