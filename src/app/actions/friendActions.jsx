import firebase, { firebaseRef } from 'app/firebase/';

// - Import utility components
import moment from 'moment';

// - Import action types
import * as types from 'actionTypes';

// - Import actions
import * as globalActions from 'globalActions';
import * as postActions from 'postActions';
import * as userActions from 'userActions';
import * as notifyActions from 'notifyActions';

/* _____________ CRUD DB _____________ */


/**
 * Send friend request to a user
 * @param {object} userFriend is the user to send request to
 * */
export var dbAddFriendRequest = (userFriend) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;
        let user = getState().user.info[uid];
        let requestId = firebaseRef.child(`userRequests/${uid}/sent`).push().key;

        // Store userFriend details 
        let userSentReq = {
            creationDate: moment().unix(),
            fullName: userFriend.fullName,
            avatar: userFriend.avatar || '',
            approved: false,
            acknowledged: false,
            uid: userFriend.userId,
            requestId,
        };

        // Send your user details to userFriend
        let userReceivedReq = {
            creationDate: moment().unix(),
            fullName: user.fullName,
            avatar: user.avatar || '',
            uid,
        };

        // Add to userFriend's request branch
        let updates = {};
        updates[`userRequests/${uid}/sent/${requestId}`] = userSentReq;
        updates[`userRequests/${userFriend.userId}/received/${uid}`] = userReceivedReq;
        firebaseRef.update(updates).then((result) => {
            // Update list of sent requests`
            dbGetSentRequests();
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
        })

        // Attach listener to request sent by user
        let requestRef = firebaseRef.child(`userRequests/${userFriend.userd}/received/${requestId}`);
        return requestRef.on('value', (snapshot) => {
            let userRef = snapshot.val() || {};
            console.error('Change occurred in my friend request')

            // Add to friends if userFriend accepts friend request
            if (userRef.acknowledged && userRef.approved) { 
                dbAddFriend(userFriend);
            }

            // Remove request if other user rejects friend request
            if (userRef.acknowledged && !userRef.approved) {
                dbCancelFriendRequest(userFriend);
            }
        });
    }

}


/**
 * Handles your own state when others request you as friend
 * */
export var dbHandleFriendRequests = () => {
    console.error('Listening for friend requests')
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;

        // Listen for friend requests from other users 
        let requestRef = firebaseRef.child(`userRequests/${uid}/received`);
        return requestRef.on('value', (snapshot) => {
            // Update list of received requests
            dbGetReceivedRequests();
            console.error('Change occurred in my request branch');

            // let requests = snapshot.val() || {};
            // Object.keys(requests).forEach((userId) => {
            //     let userFriend = snapshot.val()[userId];
            //     // TODO: Add friend request
            //     if (userFriend.acknowledged) {
            //         userFriend.approved ? dispatch(addFriendUser(uId, userFriend)) 
            //         : dispatch(deleteFriendUser(uid, userId));
            //     }
            // });
        });
    }
}



/**
 * Add a user to friend list
 * @param {object} userFriend is the user to add to friend's list
 */
export var dbAddFriend = (userFriend) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;
        let user = getState().user.info[uid];

        let friend = {
            creationDate: moment().unix(),
            fullName: userFriend.fullName,
            avatar: userFriend.avatar || '',
            uid: userFriend.userId,
        };

        // TODO: Encrypt your data key in friend's public key
        let requestId = firebaseRef.child(`userRequests/${uid}/received/${userFriend.userId}`).requestId;
        let updates = {};
        updates[`userRequests/${userFriend.userId}/send/${uid}/approved`] = true;
        updates[`userRequests/${userFriend.userId}/send/${uid}/acknowledged`] = true;
        updates[`userRequests/${uid}/received/${requestId}`] = null;
        updates[`userFriends/${uid}/${userFriend.userId}`] = friend;
        // updates[`userFriends/${uid}/${userFriend.userId}`] = userFollower;
        return firebaseRef.update(updates).then((result) => {
            console.error('ADDING FRIEND')
            // Add user to friend list
            dispatch(addFriendUser(uid, userFriend));
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
        })
    }
}


/**
 * Cancel a friend request sent
 * @param {object} userFriend is the user whom to cancel the request to
 */
export var dbCancelFriendRequest = (userFriend) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;
        let user = getState().user.info[uid];

        // Remove sent request from self and received request from userFriend
        let requestId = firebaseRef.child(`userRequests/${uid}/received/${userFriend.userId}`).requestId;
        let updates = {};
        updates[`userRequests/${userFriend.userId}/received/${uid}`] = null;
        updates[`userRequests/${uid}/sent/${requestId}`] = null;
        return firebaseRef.update(updates).then((result) => {
        }, (error) => {
            dispatch(globalActions.showErrorMessage(error.message));
        })
    }
}

/**
 * Remove a user from friend list
 * @param {string} friendId friend user identifier
 */
export var dbDeleteFriend = (friendId) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;

        // Remove friend
        let updates = {};
        updates[`userFriends/${friendId}/${uid}`] = null;
        return firebaseRef.update(updates).then((result) => {
            dispatch(deleteFriendUser(uid, friendId))
        }, (error) => {
            dispatch(globalActions.showErrorMessage(error.message))
        });
    }
}


/**
 * Read all friend requests that current user has sent
 */
export var dbGetSentRequests = () => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;

        let requestRef = firebaseRef.child(`userRequests/${uid}/sent`);
        return requestRef.once('value', (snapshot) => {
            let sentRequests = snapshot.val() || {};
            let parsedRequests = [];
            Object.keys(sentRequests).forEach((reqId) => {
                parsedRequests.push(sentRequests[reqId]);
            });

            dispatch(addSentRequestList(parsedRequests));
        });
    }

}


/**
 * Read all friend requests that current user has receive
 */
export var dbGetReceivedRequests = () => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;

        let requestRef = firebaseRef.child(`userRequests/${uid}/received`);
        return requestRef.once('value', (snapshot) => {
            let receivedRequests = snapshot.val() || {};
            let parsedRequests = [];
            Object.keys(receivedRequests).forEach((reqId) => {
                parsedRequests.push(receivedRequests[reqId]);
            });
            dispatch(addReceivedRequestList(parsedRequests));
        });
    }
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
 * Add list of friend request sent by current user
 * @param {string} parsedRequest list of requests sent
 */
export const addSentRequestList = (parsedRequests) => {
    return {
        type: types.SENT_REQUESTS,
        payload: { parsedRequests }
    };
}

/**
 * Add list of friend request sent by current user
 * @param {string} parsedRequest list of requests sent
 */
export const addReceivedRequestList = (parsedRequests) => {
    return {
        type: types.RECEIVED_REQUESTS,
        payload: { parsedRequests }
    };
}