import {
    SET_CURRENT,
    CLEAR_CURRENT,
    FILTER_USERS,
    CLEAR_FILTER
} from '../types';

const variable = (state, action) => {
    switch(action.type) {
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

