import React, { useReducer } from 'react';
import axios from 'axios';
import {v4 as uuid} from 'uuid';
import UserssContext from './userssContext';
import userssReducer from './userssReducer';
import {
    ADD_USERSS,
    DELETE_USERSS,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_USERSS,
    FILTER_USERSSS,
    CLEAR_FILTER
} from '../types';

const UserssState = props => {
    const initialState = {
        usersss: [
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

    const [state, dispatch] = useReducer(userssReducer, initialState);

    // Add User
    const addUserss = userss => {
        userss.id = uuid();
        dispatch({ type: ADD_USERSS, payload: userss });
    }

    // Delete User
    const deleteUserss = id => {
        dispatch({ type: DELETE_USERSS, payload: id });
    }

    // Set Current User
    const setCurrent = userss => {
        dispatch({ type: SET_CURRENT, payload: userss });
    }

    // Clear Current User
    const clearCurrent = () => {
        dispatch({ type: CLEAR_CURRENT });
    }

    // Update User
    const updateUserss = userss => {
        dispatch({ type: UPDATE_USERSS, payload: userss });
    }

    // Filter Users
    const filterUsersss = text => {
        dispatch({ type: FILTER_USERSSS, payload: text });
    }

    // Clear Filter
    const clearFilter = () => {
        dispatch({ type: CLEAR_FILTER });
    }



    // const [state, dispatch] = useReducer(usersReducer, initialState);

    // const getUserss = async () => {   
    //     try {
    //         const res = await axios.get('/api/users');

    //         dispatch({ 
    //             type: GET_USERSS, 
    //             payload: res.data 
    //         });
    //     } catch (err) {
    //         dispatch({ 
    //             type: USERSS_ERROR,
    //             payload: err.response.msg
    //          });
    //     }

        
    // }

    return (
        <UserssContext.Provider value={{
            usersss: state.usersss,  
            current: state.current,
            filtered: state.filtered,
            addUserss,
            deleteUserss ,
            setCurrent,
            clearCurrent,
            updateUserss,
            filterUsersss,
            clearFilter  
        }}>
            {props.children }
        </UserssContext.Provider>
    );
};

export default UserssState;