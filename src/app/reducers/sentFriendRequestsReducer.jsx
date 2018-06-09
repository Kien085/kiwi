// - Import action types
import * as types from 'actionTypes';

// Default state, this user has no sent friend requests
let defaultState = [];

/**
 * Friend actions for keeping realtime sent friend requests
 * @param {array} state 
 * @param {object} action 
 */
export let sentFriendRequestsReducer = (state = defaultState, action) => {

    let { payload } = action;

    switch (action.type) {
    
        // get the lastest sent requests from the database
        case types.UPDATE_SENT_REQUESTS:
            return [
                ...payload
            ]
            
        default:
            return state;
    }
}