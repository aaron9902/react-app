import React, { Fragment, useContext, useEffect } from 'react'
import UserssItem from './UserssItem';
import UserssContext from '../../context/users/userssContext';

const Usersss = () => {
    const userssContext = useContext(UserssContext);

    const { usersss } = userssContext;

    return (
        <Fragment>
            {usersss.map(userss => (
                <UserssItem key={userss.id} userss={userss} />   
            ))}      
        </Fragment>
    )
}

export default Usersss;