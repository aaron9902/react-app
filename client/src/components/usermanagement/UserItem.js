import React, { useContext } from 'react';
import UserContext from '../../context/users/userContext';
import PropTypes from 'prop-types'
import axios from 'axios';



const UserItem = ({ user }) => {
    const userContext = useContext(UserContext);
    const { deleteUser, setCurrent, clearCurrent } = userContext;

    const { _id, name, email, role } = user;

    const onDelete = () => {
        axios.delete('/api/users/delete/' + _id).then((res) => {
            window.location.reload();
        });
    }

    return (
        <div className='card bg-light'>
            <h3 className="text-left">
                {name}{' '}
                <span style = {{ float: 'right' }}
                 className={'badge ' + (role === 0 ? 'badge-success' : 'badge-primary')}>{(role === 0 ? 'User' : 'Admin')}</span>
            </h3>
            <ul className="list">
                {email && (<li>
                    {email}
                </li>
                )}
            </ul>
            <p>
                <button className="btn btn-dark btn-sm" onClick={() => setCurrent(user)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={onDelete}>Delete</button>
            </p>
        </div>
    );
};

UserItem.propTypes = {
    user: PropTypes.object.isRequired
}

export default UserItem