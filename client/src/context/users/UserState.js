import React, { useReducer } from 'react';
import axios from 'axios';
import {v4 as uuid} from 'uuid';
import UserContext from './userContext';
import userReducer from './userReducer';
import {
    ADD_USER,
    DELETE_USER,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_USER,
    FILTER_USERS,
    CLEAR_FILTER
} from '../types';

const UserState = props => {
    const initialState = {
        users: [
            {
                id: 1,
                name: 'Peter Jackson',
                email: 'peter@gmail.com',
                password: 'password1'
            },
            {
                id: 2,
                name: 'Michael Jackson',
                email: 'michael@gmail.com',
                password: 'password2'
            },
            {
                id: 3,
                name: 'Bob Jackson',
                email: 'bob@gmail.com',
                password: 'password3'
            },                        
        ],
        current: null,
        filtered: null
    };

    const [state, dispatch] = useReducer(userReducer, initialState);

    // Add User
    const addUser = user => {
        user.id = uuid();
        dispatch({ type: ADD_USER, payload: user });
    }

    // Delete User
    const deleteUser = id => {
        dispatch({ type: DELETE_USER, payload: id });
    }

    // Set Current User
    const setCurrent = user => {
        dispatch({ type: SET_CURRENT, payload: user });
    }

    // Clear Current User
    const clearCurrent = () => {
        dispatch({ type: CLEAR_CURRENT });
    }

    // Update User
    const updateUser = user => {
        dispatch({ type: UPDATE_USER, payload: user });
    }

    // Filter Users
    const filterUsers = text => {
        dispatch({ type: FILTER_USERS, payload: text });
    }

    // Clear Filter
    const clearFilter = () => {
        dispatch({ type: CLEAR_FILTER });
    }

    return (
        <UserContext.Provider value={{
            users: state.users,  
            current: state.current,
            filtered: state.filtered,
            addUser,
            deleteUser ,
            setCurrent,
            clearCurrent,
            updateUser,
            filterUsers,
            clearFilter  
        }}>
            {props.children }
        </UserContext.Provider>
    );
};

export default UserState;