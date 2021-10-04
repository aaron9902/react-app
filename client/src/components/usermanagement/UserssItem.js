import React, { useContext } from 'react';
import UserssContext from '../../context/users/userssContext';
import PropTypes from 'prop-types'
import axios from 'axios';



const UserssItem = ({ userss }) => {
    const userssContext = useContext(UserssContext);
    const { deleteUserss, setCurrent, clearCurrent } = userssContext;

    const { _id, name, email } = userss;

    const onDelete = () => {
        axios.delete('/api/users/delete/' + _id).then((res) => {
            window.location.reload();
        });
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