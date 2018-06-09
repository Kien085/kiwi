// - Import action types
import * as types from 'actionTypes';

// Default state
let defaultState = {
    postComments: {},
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
                    uid: payload.uid,
                    avatar: payload.avatar,
                    fullName: payload.fullName
                }
            ];
        case types.DELETE_FRIEND:
            return [
                ...(state.filter((friend) => {
                    if ( friend.uid != payload.followingId) {
                        return true;
                    }
                    return false;
                }))
            ];
}


/**
 * Add following user in a circle
 * @param {string} uid user identifire who want to follow the following user
 * @param {string} followingId following user identifier
 */
export const addFriendUser = (uid, followingId) => {
    return {
        type: types.ADD_FRIEND,
        payload: { uid, followingId }
    };
}
/**
 * Delete following user from a circle
 * @param {string} uid user identifire who want to follow the following user
 * @param {string} followingId following user identifier
 */
export const deleteFriendUser = (uid, followingId) => {
    return {
        type: types.DELETE_FRIEND,
        payload: { uid, followingId }
    };
}