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
        let userSentReq = {
            creationDate: moment().unix(),
            fullName: user.fullName,
            avatar: user.avatar || '',
            approved: false,
            acknowledged: false,
            userId: uid,
            requestId,
        };
        let userReceivedReq = {
            creationDate: moment().unix(),
            fullName: user.fullName,
            avatar: user.avatar || '',
            userId: uid,
            requestId,
        };

        // Add to userFriend's request branch
        let updates = {};
        updates[`userRequests/${uid}/sent/${requestId}`] = userSentReq;
        updates[`userRequests/${userFriend.userId}/received/${uid}`] = userReceivedReq;
        firebaseRef.update(updates).then((result) => {
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
        let requestRef = firebaseRef.child(`userRequests/${userFriend.userId}/received/${requestId}`);
        return requestRef.on('value', (snapshot) => {
            let userRef = snapshot.val() || {};
            console.error('Change occurred in my friend request')
            // Add to friends if user accepts friend request
            if (userRef.approved === 'accepted') {
                dbAddFriend(userFriend)
            } else if (userRef.approved === 'rejected') {
                dbDeleteFriendRequest(userFriend.userId)
                // dispatch(deleteFriendUser(uid, friendId))
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
            console.error('Change occurred in my request branch')
            let requests = snapshot.val() || {};
            Object.keys(requests).forEach((userId) => {
                let user = snapshot.val()[userId];

                // TODO: Remove from request branch
                if (user.approved === 'accepted') {
                    dispatch(addFriendUser(uid, userId, ));
                } else if (user.approved === 'rejected') {
                    dispatch(deleteFriendUser(uid, userId))
                }
               
            });
        });
    }
}



/**
 * Add a user to friend list
 * @param {object} user is the user for following
 */
export var dbAddFriend = (userFriend) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;
        let user = getState().user.info[uid];

        let friend = {
            creationDate: moment().unix(),
            fullName: userFriend.fullName,
            avatar: userFriend.avatar || '',
        };

        let userSelf = {
            creationDate: moment().unix(),
            fullName: user.fullName,
            avatar: user.avatar || '',
        };

        // Remove from request branch
       // let updates = {};
       // updates[`userRequests/${uid}/${friendId}`] = null;
       // return firebaseRef.update(updates).then((result) => {
       //     dispatch(deleteFriendUser(uid, cid, friendId))
       // }, (error) => {
       //     dispatch(globalActions.showErrorMessage(error.message))
       //     })
       // });

       // TODO: Encrypt your data key in friend's public key

        // Add user to friend list
        let requestId = firebaseRef.child(`userRequests/${uid}/received/${userFriend.userId}`).requestId;
        let updates = {};
        updates[`userRequests/${userFriend.userId}/received/${uid}/approved`] = true;
        updates[`userRequests/${userFriend.userId}/received/${uid}/acknowledged`] = true;
        updates[`userRequests/${uid}/sent/${requestId}`] = null;
        updates[`userFriends/${uid}/${userFriend.userId}`] = friend;
        // updates[`userFriends/${uid}/${userFriend.userId}`] = userFollower;
        return firebaseRef.update(updates).then((result) => {
            dispatch(addFriendUser(uid, userFriend.userId, ));
            console.error('Friend added');
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

/* _____________ CRUD State _____________ */

/**
 * Add user to friend list
 * @param {string} uid user identifier
 * @param {string} followingId friend user identifier
 */
export const addFriendUser = (uid, followingId) => {
    return {
        type: types.ADD_FRIEND,
        payload: { uid, followingId }
    };
}

/**
 * Delete user from friend list
 * @param {string} uid user identifier 
 * @param {string} followingId friend user identifier
 */
export const deleteFriendUser = (uid, followingId) => {
    return {
        type: types.DELETE_FRIEND,
        payload: { uid, followingId }
    };
}