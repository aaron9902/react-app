import React, { useReducer } from 'react';
import UserContext from './userContext';
import userReducer from './userReducer';
import {
    SET_CURRENT,
    CLEAR_CURRENT,
    FILTER_USERS,
    CLEAR_FILTER
} from '../types';

const UserState = props => {
    const initialState = {
        users: [],
        current: null,
        filtered: null
    };

    const [state, dispatch] = useReducer(userReducer, initialState);
    // Set Current User
    const setCurrent = user => {
        dispatch({ type: SET_CURRENT, payload: user });
    }

    // Clear Current User
    const clearCurrent = () => {
        dispatch({ type: CLEAR_CURRENT });
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
            setCurrent,
            clearCurrent,
            filterUsers,
            clearFilter  
        }}>
            {props.children }
        </UserContext.Provider>
    );
};

export default UserState;