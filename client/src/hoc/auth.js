import React, { useEffect } from 'react';
//import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) {

    //null    =>  everyone can access this page (landing page and About page)
    //true    =>  logged in users can access this page ()
    //false   =>  logged in users CANNOT access this page (register and login page)
    function AuthenticationCheck(props) {
        const dispatch = useDispatch();

        useEffect(() => {

            dispatch(auth()).then(response => {
                console.log(response)
                //not logged in status
                if (!response.payload.isAuth) {
                    if (option) {
                        props.history.push('/login')
                    }
                } else {
                    //logged in status
                    if (adminRoute && !response.payload.isAdmin) {
                        props.history.push('/')
                    } else {
                        if (option === false)
                            props.history.push('/')
                    }
                } 
            })
        }, [])

        return (
            <SpecificComponent />
        )
    }
    return AuthenticationCheck
}