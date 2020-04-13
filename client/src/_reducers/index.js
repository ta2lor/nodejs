import {combineReducers } from 'redux';
import user from './user_reducer';

const rootReduxer = combineReducers({
    user
})

export default rootReduxer;