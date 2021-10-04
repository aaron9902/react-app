import React, { useState, useContext, useEffect } from 'react'
import UserssContext from '../../context/users/userssContext';

const UserssForm = () => {
    const userssContext = useContext(UserssContext);

    const { addUserss, updateUserss, clearCurrent, current } = userssContext;

    useEffect (() => {
        if(current !== null) {
            setUserss(current);
        } else {
            setUserss({
                name: '',
                email: '',
                password: ''    
            });
        }
    }, [userssContext, current]);

    const [userss, setUserss] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { name, email, password } = userss;

    const onChange = e => setUserss({ ...userss, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if(current === null) {
            addUserss(userss);   
        } else {
            updateUserss(userss);
        }
        clearAll();
    };

    const clearAll = () => {
        clearCurrent();
    }
    
    return (
        <form onSubmit={onSubmit}>
            <h2 className="text-primary">{current ? 'Edit User' : 'Add a User'} </h2>
            <input type="text" placeholder="name" name="name" value={name} onChange={onChange}/>  
            <input type="email" placeholder="email" name="email" value={email} onChange={onChange}/> 
            <input type="password" placeholder="password" name="password" value={password} onChange={onChange}/> 
            <h5>User Role</h5> 
            <input type="radio" name="type" value="user" checked={true} /> User{' '}
            <input type="radio" name="type" value="staff" /> Staff
            <div>
                <input type="submit" value={current ? 'Update User Details' : 'Add a User'} className="btn btn-primary btn-block"/>
            </div>
            {current && <div>
                <button className="btn btn-light btn-block" onClick={clearAll}> Clear </button>    
            </div>}
        </form>
    )
}

export default UserssForm;