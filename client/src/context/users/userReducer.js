import {
    ADD_USER,
    DELETE_USER,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_USER,
    FILTER_USERS,
    CLEAR_FILTER
} from '../types';

const variable = (state, action) => {
    switch(action.type) {
        case ADD_USER:
            return {
                ...state,
                users: [...state.users, action.payload]
            }
        case UPDATE_USER:
            return {
                ...state,
                users: state.users.map(user => user.id === action.payload.id ? action.payload : user)
            }
        case DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user.id !== action.payload)
            }
        case SET_CURRENT:
            return {
                ...state,
                current: action.payload
            }
        case CLEAR_CURRENT:
            return {
                ...state,
                current: null
            }
        case FILTER_USERS:
            return {
                ...state,
                filtered: state.users.filter(user => {
                    const regex = new RegExp(`${action.payload}`, 'gi');
                    return user.name.match(regex);
                })
            }
        case CLEAR_FILTER:
            return {
                ...state,
                filtered: null
            } 
        default:
            return state;
    }
}

export default variable;

