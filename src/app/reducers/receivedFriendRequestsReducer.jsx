// - Import action types
import * as types from 'actionTypes';

// Default state, this user has no received friend requests
let defaultState = [];

/**
 * Friend actions for keeping realtime received friend requests
 * @param {array} state 
 * @param {object} action 
 */
export let receivedFriendRequestsReducer = (state = defaultState, action) => {

    let { payload } = action;

    switch (action.type) {

        // get the lastest received requests from the database
        case types.UPDATE_RECEIVED_REQUESTS:
            return [
                ...payload
            ]
            
        default:
            return state;
    }
}