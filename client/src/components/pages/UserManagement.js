import React, { useContext, useEffect } from 'react';
import Users from '../usermanagement/Users';
import UserForm from '../usermanagement/UserForm';



const UserManagement = () => {
    return (
        <div className="grid-2">
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
