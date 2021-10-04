import React, { useContext, useEffect } from 'react';
import Usersss from '../usermanagement/Usersss';
import UserssForm from '../usermanagement/UserssForm';



const UserManagement = () => {
    return (
        <div className="grid-2">
            <div>
                <UserssForm />
            </div>
            <div>
                <Usersss />
            </div>
        </div>
    )
}

export default UserManagement;
