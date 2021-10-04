import React, { useContext } from 'react';
import UserssContext from '../../context/users/userssContext';
import PropTypes from 'prop-types'



const UserssItem = ({ userss }) => {
    const userssContext = useContext(UserssContext);
    const { deleteUserss, setCurrent, clearCurrent } = userssContext;

    const { id, name, email, password } = userss;

    const onDelete = () => {
        deleteUserss(id); 
        clearCurrent();          
    }

    return (
        <div className='card bg-light'>
            <h3 className="text-left">
                {name}{' '} 
            </h3>
            <ul className="list">
                {email && (<li>
                     {email}
                    </li>
                )}
                {password && (<li>
                     {password}
                    </li>
                )}
            </ul>
            <p>
                <button className="btn btn-dark btn-sm" onClick={() => setCurrent(userss)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={onDelete}>Delete</button>
            </p>
        </div>
    );
};

UserssItem.propTypes = {
    userss: PropTypes.object.isRequired
}

export default UserssItem