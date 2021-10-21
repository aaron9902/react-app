import React, { useContext } from 'react';
import UserContext from '../../context/users/userContext';
import PropTypes from 'prop-types'
import axios from 'axios';



const UserItem = ({ user }) => {
    const userContext = useContext(UserContext);
    const { setCurrent } = userContext;

    const { _id, name, email, role } = user;

    const onDelete = () => {
        axios.delete('/api/threads/parent/' + _id).then((res) => {
            console.log("User's threads deleted")
            if (role === 1) {
                alert('Cannot delete admin account');
            } else {
            axios.delete('/api/users/delete/' + _id).then((res) => {
                window.location.reload();
            });
        }
        });
    }

    return (
        <div className='card bg-light'>
            <h3 className="text-left">
                {name}{' '}
                {<span style = {{ float: 'right' }}
                 className={'badge ' + (role === 0 ? 'badge-success' : role === 1 ? 'badge-danger' : 'badge-primary')}>{(role === 0 ? 'User' : role === 1 ? 'Admin' : 'Moderator')}</span>                
                }
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