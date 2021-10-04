import {
    ADD_USERSS,
    DELETE_USERSS,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_USERSS,
    FILTER_USERSSS,
    CLEAR_FILTER
} from '../types';

const variable = (state, action) => {
    switch(action.type) {
        case ADD_USERSS:
            return {
                ...state,
                usersss: [...state.usersss, action.payload]
            }
        case UPDATE_USERSS:
            return {
                ...state,
                usersss: state.usersss.map(userss => userss.id === action.payload.id ? action.payload : userss)
            }
        case DELETE_USERSS:
            return {
                ...state,
                usersss: state.usersss.filter(userss => userss.id !== action.payload)
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
        case FILTER_USERSSS:
            return {
                ...state,
                filtered: state.usersss.filter(userss => {
                    const regex = new RegExp(`${action.payload}`, 'gi');
                    return userss.name.match(regex);
                })
            }
        case CLEAR_FILTER:
            return {
                ...state,
                filtered: null
            }
        // case CONTACT_ERROR:
        //     return {
        //         ...state,
        //         error: action.payload
        //     }  
        default:
            return state;
    }
}

export default variable;

