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
        // get the lastest friend list from the database
        case types.UPDATE_FRIEND_LIST:
            return [
                ...state,
                ...payload
            ]
            
        default:
            return state;
    }
}