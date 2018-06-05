// - Import action types
import * as types from 'actionTypes';

// Default state
let defaultState = {
    loaded: false
};

/**
 * Comment actions
 * @param {object} state 
 * @param {object} action 
 */
export let friendReducer = (state = defaultState, action) => {

    let { payload } = action;

    switch (action.type) {
        /* _____________ CRUD _____________ */
        case types.ADD_FRIEND:
            return [
                ...state,
                {
                    uid: payload.userFriend.userId,
                    avatar: payload.userFriend.avatar,
                    fullName: payload.userFriend.fullName
                }
            ];
        case types.DELETE_FRIEND:
            return [
                ...(state.filter((friend) => {
                    if (friend.uid != payload.friendId) {
                        return true;
                    }
                    return false;
                }))
            ];
        default:
            return state;
    }
}


/**
 * Add user to friend list
 * @param {string} uid friend user identifier
 * @param {object} userFriend info of user's friend
 */
export const addFriendUser = (uid, userFriend) => {
    return {
        type: types.ADD_FRIEND,
        payload: { uid, userFriend }
    };
}

/**
 * Delete user from friend list
 * @param {string} friendId friend user identifier
 */
export const deleteFriendUser = (friendId) => {
    return {
        type: types.DELETE_FRIEND,
        payload: { friendId }
    };
}