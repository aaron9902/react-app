import React, { useEffect } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

function LandingPage(props) {
    
    useEffect (() => {
        
        axios.get('/api/hello')
        .then(response => {console.log(response)})
    
    }, [])


    const onLogoutClickHandler = () => {
        axios.get('/api/users/logout')
        .then(response => {
            if(response.data.success) {
                props.history.push("/login") 
            } else {
                alert ('Failed to logout')
            }
        })
    }
    const onRegisterClickHandler = () => {
                props.history.push("/register") 
    }
    const onLoginClickHandler = () => {
                props.history.push("/login")
    }
    
     return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' ,height: '100vh'}}>
                <h2>Start Page</h2>
                <button onClick ={onRegisterClickHandler}> Register </button>
                <button onClick ={onLoginClickHandler}> Login </button>
                <button onClick ={onLogoutClickHandler}> Logout </button>
        </div>
    )
}

export default withRouter (LandingPage);
