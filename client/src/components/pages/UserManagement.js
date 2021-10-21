import React, { useContext, useEffect } from 'react';
import Users from '../usermanagement/Users';
import UserForm from '../usermanagement/UserForm';



const UserManagement = () => {
    return (
        <div className="container grid-2" style={{marginTop:10}}>
            <div>
                <UserForm />
            </div>
            <div>
                <Users />
            </div>
        </div>
    )
}

export default UserManagement;
