// - Import action types
import * as types from 'actionTypes';

// Default state, this user has no friends
let defaultState = [];

/**
 * Friend actions for keeping realtime friend list
 * @param {array} state 
 * @param {object} action 
 */
export let friendListReducer = (state = defaultState, action) => {

    let { payload } = action;

    switch (action.type) {

        // get the lastest friend list from the database
        case types.UPDATE_FRIEND_LIST:
            return [
                ...payload
            ]
            
        default:
            return state;
    }
}