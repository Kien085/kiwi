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
        /* _____________ CRUD _____________ */
        // case types.ADD_FRIEND:
        //     return [
        //         ...state,
        //         {
        //             uid: payload.userFriend.userId,
        //             avatar: payload.userFriend.avatar,
        //             fullName: payload.userFriend.fullName
        //         }
        //     ];
        // case types.DELETE_FRIEND:
        //     return [
        //         ...(state.filter((friend) => {
        //             if (friend.uid != payload.friendId) {
        //                 return true;
        //             }
        //         ];
        // get the lastest received requests from the database
        case types.UPDATE_RECEIVED_REQUESTS:
            return [
                ...state,
                ...payload
            ]
            
        default:
            return state;
    }
}