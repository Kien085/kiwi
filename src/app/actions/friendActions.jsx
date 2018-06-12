import firebase, { firebaseRef } from 'app/firebase/';

// - Import utility components
import moment from 'moment';

// - Import action types
import * as types from 'actionTypes';

// - Import actions
import * as globalActions from 'globalActions';
import * as notifyActions from 'notifyActions';
import EncryptionAPI from '../api/EncryptionAPI';

/* _____________ CRUD DB _____________ */


/**
 * Send friend request to a user
 * @param {object} userFriend is the user to send request to
 * */
export var dbAddFriendRequest = (userFriend) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;
        let user = getState().user.info[uid];
        let myRequestId = firebaseRef.child(`userRequests/${uid}/sent`).push().key;
        let theirRequestId = firebaseRef.child(`userRequests/${userFriend.userId}/received`).push().key;
        let timestamp = moment().unix();

        // Store userFriend details 
        let userSentReq = {
            creationDate: timestamp,
            fullName: userFriend.fullName,
            avatar: userFriend.avatar || '',
            approved: false,
            acknowledged: false,
            uid: userFriend.userId,
            reqId: theirRequestId
        };

        // Send your user details to userFriend
        let userReceivedReq = {
            creationDate: timestamp,
            fullName: user.fullName,
            avatar: user.avatar || '',
            uid,
            reqId: myRequestId,
        };

        let updates = {};
        // Track the request on my sent requests branch
        updates[`userRequests/${uid}/sent/${myRequestId}`] = userSentReq;

        // Add to userFriend's request branch
        updates[`userRequests/${userFriend.userId}/received/${theirRequestId}`] = userReceivedReq;
        return firebaseRef.update(updates).then((result) => {
            dispatch(notifyActions.dbAddNotify(
                {
                    description: `${user.fullName} wants to be friends with you.`,
                    url: `/${uid}`,
                    notifyRecieverUserId: userFriend.userId,
                    notifierUserId: uid,
                    isRequest: true,
                }));
        }, (error) => {
            dispatch(globalActions.showErrorMessage(error.message));
        });
    };
}


/**
 * Accept friend request
 * @param string myReqId the id of the received request
 * @param {object} request the received request object
 * */
export var dbAcceptFriendRequest = (myReqId, request) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;

        let userFriend =
            {
                fullName: request.fullName,
                avatar: request.avatar,
                userId: request.uid,
            };
        dispatch(dbAddFriend(userFriend, myReqId, request.reqId, false));
    };
}


export var dbDenyFriendRequest = (myReqId, request) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;

        let userFriend =
            {
                fullName: request.fullName,
                avatar: request.avatar,
                userId: request.uid
            };

        let updates = {};
        updates[`userRequests/${uid}/received/${myReqId}`] = null;
        updates[`userRequests/${userFriend.userId}/sent/${request.reqId}/acknowledged`] = true;
        updates[`userRequests/${userFriend.userId}/sent/${request.reqId}/approved`] = false;
        return firebaseRef.update(updates).then((result) => {

        });
    }
}

/**
* Add a user to friend list
* @param {object} userFriend is the user to add to friend's list
* @param {boolean} requestId unique id of friend request
*/
export var dbAddFriend = (userFriend, myRequestId, theirRequestId, fromUser) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;
        let user = getState().user.info[uid];

        let friend = {
            creationDate: moment().unix(),
            fullName: userFriend.fullName,
            avatar: userFriend.avatar || '',
            uid: userFriend.userId,
        };

        // Encrypt your data key in friend's public key
        EncryptionAPI.sendEncryptedKey(uid, userFriend.userId);

        let updates = {};
        // Check if the friend request was sent by current user
        if (fromUser) {
            // A request that you sent
            updates[`userRequests/${uid}/sent/${myRequestId}`] = null;
        } else {
            // A request which you are responding to
            updates[`userRequests/${userFriend.userId}/sent/${theirRequestId}/approved`] = true;
            updates[`userRequests/${userFriend.userId}/sent/${theirRequestId}/acknowledged`] = true;
            updates[`userRequests/${uid}/received/${myRequestId}`] = null;
        }
        updates[`userFriends/${uid}/${userFriend.userId}`] = friend;
        return firebaseRef.update(updates).then((result) => {
            dispatch(notifyActions.dbAddNotify(
                {
                    description: `${user.fullName} became friends with you.`,
                    url: `/${uid}`,
                    notifyRecieverUserId: userFriend.userId,
                    notifierUserId: uid,
                    isRequest: false,
                }));
        }, (error) => {
            dispatch(globalActions.showErrorMessage(error.message));
        });
    };
}


/**
 * Process the friend request you sent once it was denied
 * @param {object} userFriend is the user whom to cancel the request to
 */
export var dbFriendRequestDenied = (userFriend, myRequestId) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;
        let user = getState().user.info[uid];

        // Remove sent request from self
        let updates = {};
        updates[`userRequests/${uid}/sent/${myRequestId}`] = null;
        return firebaseRef.update(updates).then((result) => {
            // does not notify current user that there request was denied
        }, (error) => {
            dispatch(globalActions.showErrorMessage(error.message));
        });
    };
}

/**
 * Cancel a sent friend request
 * @param {object} userFriend is the user whom to cancel the request to
 */
export var dbCancelFriendRequest = (userFriend, myRequestId, theirRequestId) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;
        let user = getState().user.info[uid];

        // Remove sent request from self and received request from userFriend
        let updates = {};
        updates[`userRequests/${userFriend.userId}/received/${theirRequestId}`] = null;
        updates[`userRequests/${uid}/sent/${myRequestId}`] = null;
        return firebaseRef.update(updates).then((result) => {
        }, (error) => {
            dispatch(globalActions.showErrorMessage(error.message));
        });
    };
}


/**
 * Remove a user from friend list, unfriend another user
 * @param {string} friendId friend user identifier
 */
export var dbDeleteFriend = (friendId) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;

        // Remove friend
        let updates = {};
        updates[`userFriends/${friendId}/${uid}`] = null;
        updates[`userFriends/${uid}/${friendId}`] = null;
        updates[`keys/${friendId}/${uid}`] = null;
        return firebaseRef.update(updates).then((result) => {
            // dispatch(deleteFriendUser(uid, friendId))
        }, (error) => {
            dispatch(globalActions.showErrorMessage(error.message))
        });
    };
}


/**
 * Get all friend requests that current user has sent from database
 */
export var dbGetSentRequests = () => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;

        // Attach listener to request sent by user
        let requestRef = firebaseRef.child(`userRequests/${uid}/sent`);
        return requestRef.on('value', (snapshot) => {

            let sentRequests = snapshot.val() || {};
            let parsedRequests = [];
            Object.keys(sentRequests).forEach((reqId) => {
                parsedRequests.push({ myReqId: reqId, request: sentRequests[reqId] });
            });


            parsedRequests.forEach(pendingRequest => {
                let userFriend =
                    {
                        userId: pendingRequest.request.uid,
                        fullName: pendingRequest.request.fullName,
                        avatar: pendingRequest.request.avatar
                    };

                // Add to friends if userFriend accepts friend request
                if (pendingRequest.request.acknowledged && pendingRequest.request.approved) {
                    dispatch(dbAddFriend(userFriend, pendingRequest.myReqId, pendingRequest.request.reqId, true));
                }

                // Remove request if other user rejects friend request
                if (pendingRequest.request.acknowledged && !pendingRequest.request.approved) {
                    dispatch(dbFriendRequestDenied(userFriend, pendingRequest.myReqId));
                }

            });

            dispatch(updateSentRequestList(parsedRequests));
        });
    };

}


/**
 * Get all friend requests that current user has received from database
 */
export var dbGetReceivedRequests = () => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;

        let requestRef = firebaseRef.child(`userRequests/${uid}/received`);
        return requestRef.on('value', (snapshot) => {
            let receivedRequests = snapshot.val() || {};
            let parsedRequests = [];
            Object.keys(receivedRequests).forEach((reqId) => {
                parsedRequests.push({ myReqId: reqId, request: receivedRequests[reqId] });
            });

            // ensure that parsed requests is placed in the state correctly
            // for developers:
            // objects within parsedRequests will look like:
            //  {
            //      myReqId: <id of this 'request' in the database>
            //      request: <received request object>
            //  }
            dispatch(updateReceivedRequestList(parsedRequests));
        });
    };
}


/**
 * Get all user friends from database and keep up to date in realtime
 */
export var dbGetFriendList = () => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;

        let requestRef = firebaseRef.child(`userFriends/${uid}`);
        return requestRef.on('value', (snapshot) => {
            let userFriends = snapshot.val() || {};
            let friendList = [];
            Object.keys(userFriends).forEach((friendId) => {
                friendList.push(userFriends[friendId]);
            });
            dispatch(updateFriendList(friendList));
        });
    };
}



/* _____________ CRUD State _____________ */

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


/**
 * Update user's friend list
 * @param {array} friendList friend list of user 
 */
export const updateFriendList = (friendList) => {
    return {
        type: types.UPDATE_FRIEND_LIST,
        payload: friendList
    };
}


/**
 * Update the state of friend requests sent by current user
 * @param {array} parsedRequest array of friend requests sent
 */
export const updateSentRequestList = (parsedRequests) => {
    return {
        type: types.UPDATE_SENT_REQUESTS,
        payload: parsedRequests
    };
}


/**
 * Update the state of friend requests received by current user
 * @param {array} parsedRequest array of friend requests received
 */
export const updateReceivedRequestList = (parsedRequests) => {
    return {
        type: types.UPDATE_RECEIVED_REQUESTS,
        payload: parsedRequests
    };
}