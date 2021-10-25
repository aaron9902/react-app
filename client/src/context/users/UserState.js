import React, { useReducer } from 'react';
import UserContext from './userContext';
import userReducer from './userReducer';
import {
    SET_CURRENT,
    CLEAR_CURRENT,
} from '../types';

const UserState = props => {
    const initialState = {
        users: [],
        current: null,
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

    return (
        <UserContext.Provider value={{
            users: state.users,  
            current: state.current,
            setCurrent,
            clearCurrent,
        }}>
            {props.children }
        </UserContext.Provider>
    );
};

export default UserState;