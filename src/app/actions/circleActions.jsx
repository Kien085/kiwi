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
 * Add a circle
 * @param {string} circleName 
 */
export var dbAddCircle = (circleName) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;
        let circle = {
            creationDate: moment().unix(),
            name: circleName,
            users: {}
        };

        let circleRef = firebaseRef.child(`userCircles/${uid}/circles`).push(circle);
        return circleRef.then(() => {
            dispatch(addCircle(uid, {
                ...circle,
                id: circleRef.key
            }));

        }, (error) => dispatch(globalActions.showErrorMessage(error.message)));
    }
}

/**
 * Add a user in a circle
 * @param {string} cid is circle identifier 
 * @param {object} userFollowing is the user for following
 */
export var dbAddFollowingUser = (cid, userFollowing) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;
        let user = getState().user.info[uid];


        let userCircle = {
            creationDate: moment().unix(),
            fullName: userFollowing.fullName,
            avatar: userFollowing.avatar || ''
        };

        let userFriend = {
            creationDate: moment().unix(),
            fullName: userFollowing.fullName,
            avatar: userFollowing.avatar || '',
        };

        let userFollower = {
            creationDate: moment().unix(),
            fullName: user.fullName,
            avatar: user.avatar || '',
        };

        let updates = {};
        updates[`userRequests/${uid}/${userFollowing.userId}/approved`] = 'accepted';
        updates[`userFriends/${uid}/${userFollowing.userId}`] = userFriend;
        // updates[`userFriends/${uid}/${userFollowing.userId}`] = userFollower;
        return firebaseRef.update(updates).then((result) => {
            dispatch(addFollowingUser(uid, cid, userFollowing.userId, { ...userCircle }));
            dispatch(notifyActions.dbAddNotify(
                {
                    description: `${user.fullName} became friends with you.`,
                    url: `/${uid}`,
                    notifyRecieverUserId: userFriending.userId,
                    notifierUserId: uid,
                    isRequest: false,
                }));
        }, (error) => {
            dispatch(globalActions.showErrorMessage(error.message));
        })
    }
}


// Send friend request to user
export var dbAddFriendRequest = (cid, userFriending) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;
        let user = getState().user.info[uid];

        let userCircle = {
            creationDate: moment().unix(),
            fullName: userFriending.fullName,
            avatar: userFriending.avatar || ''
        };

        let userReq = {
            creationDate: moment().unix(),
            fullName: user.fullName,
            avatar: user.avatar || '',
            approved: 'pending',
            userId: uid,
        };

        let updates = {};
        updates[`userRequests/${userFriending.userId}/${uid}`] = userReq;
        return firebaseRef.update(updates).then((result) => {

            dispatch(notifyActions.dbAddNotify(
                {
                    description: `${user.fullName} wants to be friends with you.`,
                    url: `/${uid}`,
                    notifyRecieverUserId: userFriending.userId,
                    notifierUserId: uid,
                    isRequest: true,
                }));

            // Add to friends if user accepts friend request
            let requestRef = firebaseRef.child(`userRequests/${userFriending.userId}/${uid}`);
            requestRef.on('value', (snapshot) => {

                if (snapshot.val().approved === 'accepted') {
                    dispatch(addFollowingUser(uid, cid, userFollowing.userId, { ...userCircle }));
                } else if (snapshot.val().approved === 'rejected') {
                    dispatch(deleteFollowingUser(uid, cid, followingId))
                }

            });

        }, (error) => {
            dispatch(globalActions.showErrorMessage(error.message));
        })
    }

}


// // Handles your own state when others request you as friend
export var dbHandleFriendRequests = () => {
    console.error('Listening for friend requests')
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;

        let requestRef = firebaseRef.child(`userRequests/${uid}`);
        requestRef.on('child_changed', (snapshot) => {
            console.error('Change occurred in my request branch')
            let requests = snapshot.val() || {};
            Object.keys(requests).forEach((userId) => {
                let user = snapshot.val()[userId];
                // TODO: Remove from request branch
                if (user.approved === 'accepted') {
                    dispatch(addFollowingUser(uid, cid, userFollowing.userId, { ...userCircle }));
                } else if (user.approved === 'rejected') {
                    dispatch(deleteFollowingUser(uid, cid, followingId))
                }
                // // Remove from request branch
                // let updates = {};
                // updates[`userRequests/${uid}/${followingId}`] = null;
                // return firebaseRef.update(updates).then((result) => {
                //     dispatch(deleteFollowingUser(uid, cid, followingId))
                // }, (error) => {
                //     dispatch(globalActions.showErrorMessage(error.message))
                //     })
                // });
            });
        });
    }
}

/**
 * Delete a user from a circle
 * @param {string} cid is circle identifier 
 * @param {string} followingId following user identifier
 */
export var dbDeleteFollowingUser = (cid, followingId) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;
        let updates = {};
        updates[`userRequests/${uid}/${followingId}`] = null;
        // updates[`userCircles/${uid}/circles/${cid}/users/${followingId}`] = null;
        // updates[`userCircles/${followingId}/circles/-Followers/users/${uid}`] = null;
        return firebaseRef.update(updates).then((result) => {
            dispatch(deleteFollowingUser(uid, cid, followingId))
        }, (error) => {
            dispatch(globalActions.showErrorMessage(error.message))
        });
    }
}

/**
 * Update a circle from database
 * @param  {object} newCircle
 */
export const dbUpdateCircle = (newCircle) => {
    return (dispatch, getState) => {
        // Get current user id
        var uid = getState().authorize.uid;

        // Write the new data simultaneously in the list
        let updates = {};
        let circle = getState().circle.userCircles[uid][newCircle.id];
        let updatedCircle = {
            name: newCircle.name || circle.name,
            users: newCircle.users ? newCircle.users : (circle.users || [])
        };

        updates[`userCircles/${uid}/circles/${newCircle.id}`] = updatedCircle;
        return firebaseRef.update(updates).then((result) => {
            dispatch(updateCircle(uid, { id: newCircle.id, ...updatedCircle }))
        }, (error) => {
            dispatch(globalActions.showErrorMessage(error.message))
        });
    }
}


/**
 * Delete a circle from database
 * @param  {string} id is circle identifier
 */
export const dbDeleteCircle = (id) => {
    return (dispatch, getState) => {

        // Get current user id
        var uid = getState().authorize.uid

        // Write the new data simultaneously in the list
        var updates = {};
        updates[`userCircles/${uid}/circles/${id}`] = null;

        return firebaseRef.update(updates).then((result) => {
            dispatch(deleteCircle(uid, id))
        }, (error) => {
            dispatch(globalActions.showErrorMessage(error.message))
        });
    }

}

//  Get all user circles from data base
export const dbGetCircles = () => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;
        if (uid) {
            var circlesRef = firebaseRef.child(`userCircles/${uid}/circles`);

            return circlesRef.once('value').then((snapshot) => {
                let circles = snapshot.val() || {};
                let parsedCircles = {};
                Object.keys(circles).forEach((circleId) => {
                    if (circleId !== '-Followers' && circles[circleId].users) {
                        Object.keys(circles[circleId].users).filter((v, i, a) => a.indexOf(v) === i).forEach((userId) => {
                            dispatch(postActions.dbGetPostsByUserId(userId));
                            dispatch(userActions.dbGetUserInfoByUserId(userId));
                        })
                    }

                    parsedCircles[circleId] = {
                        id: circleId,
                        ...circles[circleId]
                    };
                })

                dispatch(addCircles(uid, parsedCircles));;
            });
        }
    }
}


//  Get all user circles from data base by user id
export const dbGetCirclesByUserId = (uid) => {
    return (dispatch, getState) => {
        if (uid) {
            let circlesRef = firebaseRef.child(`userCircles/${uid}/circles`);

            return circlesRef.once('value').then((snapshot) => {
                let circles = snapshot.val() || {};
                let parsedCircles = {};
                Object.keys(circles).forEach((circleId) => {
                    parsedCircles[circleId] = {
                        id: circleId,
                        ...circles[circleId]
                    };
                })
                dispatch(addCircles(uid, parsedCircles));
            })
        }
    }
}

/* _____________ CRUD State _____________ */

/**
 * Add a normal circle
 * @param {string} uid is user identifier
 * @param {object} circle 
 */
export const addCircle = (uid, circle) => {
    return {
        type: types.ADD_CIRCLE,
        payload: { uid, circle }
    };
}

/**
 * Update a circle
 * @param {string} uid is user identifier
 * @param {object} circle 
 */
export const updateCircle = (uid, circle) => {
    return {
        type: types.UPDATE_CIRCLE,
        payload: { uid, circle }
    };
}

/**
 * Delete a circle
 * @param {string} uid is user identifier
 * @param {string} id is circle identifier
 */
export const deleteCircle = (uid, id) => {
    return {
        type: types.DELETE_CIRCLE,
        payload: { uid, id }
    };
}


/**
 * Add a list of circle
 * @param {string} uid 
 * @param {[object]} circles 
 */
export const addCircles = (uid, circles) => {
    return {
        type: types.ADD_LIST_CIRCLE,
        payload: { uid, circles }
    };
}

/**
 * Clea all data in circle store
 */
export const clearAllCircles = () => {
    return {
        type: types.CLEAR_ALL_CIRCLES
    };
}


/**
 * Open circle settings
 */
export const openCircleSettings = (uid, id) => {
    return {
        type: types.OPEN_CIRCLE_SETTINGS,
        payload: { uid, id }
    };
}

/**
 * Close open circle settings
 */
export const closeCircleSettings = (uid, id) => {
    return {
        type: types.CLOSE_CIRCLE_SETTINGS,
        payload: { uid, id }
    };
}

/**
 * Add following user in a circle
 * @param {string} uid user identifire who want to follow the following user
 * @param {string} cid circle identifier that following user should be added in
 * @param {string} followingId following user identifier
 * @param {object} userCircle information about following user
 */
export const addFollowingUser = (uid, cid, followingId, userCircle) => {
    return {
        type: types.ADD_FOLLOWING_USER,
        payload: { uid, cid, followingId, userCircle }
    };
}

/**
 * Delete following user from a circle
 * @param {string} uid user identifire who want to follow the following user
 * @param {string} cid circle identifier that following user should be added in
 * @param {string} followingId following user identifier
 */
export const deleteFollowingUser = (uid, cid, followingId) => {
    return {
        type: types.DELETE_FOLLOWING_USER,
        payload: { uid, cid, followingId }
    };
}