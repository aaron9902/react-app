import React, { useState, useContext, useEffect } from 'react'
import UserContext from '../../context/users/userContext';
import axios from 'axios';

const UserForm = () => {
    const userContext = useContext(UserContext);

    const { clearCurrent, current } = userContext;

    useEffect(() => {
        if (current !== null) {
            setUser(current);
        } else {
            setUser({
                name: '',
                email: '',
                password: '',
                role: '0'
            });
        }
        console.log(current);
    }, [userContext, current]);

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        role: '0'
    });

    const { _id, name, email } = user;

    const role = user.role.toString();

    const onChange = e => setUser({ ...user, [e.target.name]: e.target.value});

// Update user's details if there is a user in current. Otherwise Add the user.
    const onSubmit = e => {
        e.preventDefault();
        if (current === null) {
            axios.post('/api/users/register', user).then((res) => {
                console.log(res);
                window.location.reload();
            });
        } else {
            axios.patch('/api/users/' + _id, user).then((res) => {
                console.log(res);
                window.location.reload();
            });
        }
        clearAll();
    };

    const clearAll = () => {
        clearCurrent();
    }

    return (
        <form onSubmit={onSubmit}>
            <h2 className="text-primary">{current ? 'Edit User' : 'Add a User'} </h2>
            <input type="text" placeholder="name" name="name" value={name} onChange={onChange} required />
            <input type="email" placeholder="email" name="email" value={email} onChange={onChange} required />
            <input type="password" placeholder="password" name="password" defaultValue='' onChange={onChange} required={!current} />
            <h4>User Role</h4>
            <input type="radio" name="role" value="0" checked={ role ==="0" } onChange={onChange} /> User{' '}
            <input type="radio" name="role" value="2" checked={ role ==="2" } onChange={onChange} /> Moderator{' '}
            <div>
                <input type="submit" value={current ? 'Update User Details' : 'Add a User'} className="btn btn-primary btn-block" />
            </div>
            {current && <div>
                <button className="btn btn-light btn-block" onClick={clearAll}> Clear </button>
            </div>}
        </form>
    )
}

export default UserForm;