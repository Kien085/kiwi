import moment from 'moment';
import { firebaseRef } from '../firebase/';

// - Import action types
import * as types from '../constants/actionTypes';

// - Import actions
import * as globalActions from './globalActions';
import * as notifyActions from './notifyActions';

// - Import app API
import EncryptionAPI from '../api/EncryptionAPI';

import forge from 'node-forge';
/* _____________ CRUD DB _____________ */

/**
 *  Add comment to database
 * @param  {object} newComment user comment
 * @param  {function} callBack  will be fired when server responsed
 */
export const dbAddComment = (newComment, callBack) => {
    return (dispatch, getState) => {

        dispatch(globalActions.showTopLoading());

        let uid = getState().authorize.uid;
        let comment = {
            postId: newComment.postId,
            score: 0,
            text: newComment.text,
            creationDate: moment().unix(),
            userDisplayName: getState().user.info[uid].fullName,
            userAvatar: getState().user.info[uid].avatar,
            userId: uid,
        };

        // Deep copy of comments
        let encryptedComment = JSON.parse(JSON.stringify(comment));

        // Get own data key
        let key = localStorage.getItem('dataKey');
        let iv = localStorage.getItem('dataIV');
        let keysRef = firebaseRef.child(`keys/${uid}/${uid}`);
        keysRef.once('value', (snap) => {
            if (snap.val() && (!key || !iv)) {
                let encryptedKey = snap.val().key || '';
                let encryptedIV = snap.val().iv || '';

                // decrypt data key with a private key (defaults to RSAES PKCS#1 v1.5)
                let keyPair = JSON.parse(localStorage.getItem('keyPair'));
                let privateKey = forge.pki.privateKeyFromPem(keyPair.private);
                key = forge.util.decodeUtf8(privateKey.decrypt(encryptedKey));
                iv = forge.util.decodeUtf8(privateKey.decrypt(encryptedIV));
            }

            // Encrypt contents of comments
            encryptedComment.text = EncryptionAPI.encrypt(comment.text, key, iv);

            // Save encrypted comment to firebase
            let commentRef = firebaseRef.child(`postComments/${newComment.postId}`).push(encryptedComment);
            dispatch(addComment(
                {
                    comment,
                    postId: newComment.postId,
                    id: commentRef.key,
                    editorStatus: false,
                }));
            return commentRef.then(() => {
                callBack();
                dispatch(globalActions.hideTopLoading());

                if (newComment.ownerPostUserId !== uid)
                    dispatch(notifyActions.dbAddNotify(
                        {
                            description: 'Add comment on your post.',
                            url: `/${newComment.ownerPostUserId}/posts/${newComment.postId}`,
                            notifyRecieverUserId: newComment.ownerPostUserId, notifierUserId: uid,
                            isRequest: false,
                        }));
            }, (error) => {
                dispatch(globalActions.showErrorMessage(error.message));
                dispatch(globalActions.hideTopLoading());
            })
        })

    }
}

// Get all comments from database
export const dbGetComments = () => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;
        if (uid) {
            let commentsRef = firebaseRef.child(`postComments`);
            return commentsRef.on('value', (snapshot) => {
                let comments = snapshot.val() || {};

                // Get reference to all keys in db
                let keysRef = firebaseRef.child(`keys`);
                keysRef.once('value', (keySnapshot) => {
                    let decryptedComments = comments;
                    // For each post, look up its comments
                    Object.keys(comments).forEach((postId) => {
                        // For each comment of a post, decrypt its contents
                        Object.keys(comments[postId]).forEach((commentId) => {
                            // Reference to current comment
                            let currComment = comments[postId][commentId];
                            let keyRef = keySnapshot.val()[uid][currComment.userId] || '';
                            if (keyRef) {
                                // Look up key and iv to decipher comment
                                let encryptedKey = keyRef.key;
                                let encryptedIV = keyRef.iv;

                                // decrypt data with a private key (defaults to RSAES PKCS#1 v1.5)
                                let keyPair = JSON.parse(localStorage.getItem('keyPair'));
                                let privateKey = forge.pki.privateKeyFromPem(keyPair.private);
                                let key = forge.util.decodeUtf8(privateKey.decrypt(encryptedKey));
                                let iv = forge.util.decodeUtf8(privateKey.decrypt(encryptedIV));

                                // Decipher comment
                                decryptedComments[postId][commentId].text = EncryptionAPI.decrypt(currComment.text, key, iv);
                            }
                        });
                    });
                    dispatch(addCommentList(decryptedComments));
                });

            });
        }
    }
}

/**
 * Update a comment from database
 * @param  {string} id of comment
 * @param {string} postId is the identifier of the post which comment belong to
 */
export const dbUpdateComment = (id, postId, text) => {

    return (dispatch, getState) => {

        // Deep copy of comments
        let encryptedText = JSON.parse(JSON.stringify(text));

        // Get own data key
        let key = localStorage.getItem('dataKey');
        let iv = localStorage.getItem('dataIV');
        let keysRef = firebaseRef.child(`keys/${uid}/${uid}`);
        keysRef.once('value', (snap) => {
            if (snap.val() && (!key || !iv)) {
                let encryptedKey = snap.val().key || '';
                let encryptedIV = snap.val().iv || '';

                // decrypt data key with a private key (defaults to RSAES PKCS#1 v1.5)
                let keyPair = JSON.parse(localStorage.getItem('keyPair'));
                let privateKey = forge.pki.privateKeyFromPem(keyPair.private);
                key = forge.util.decodeUtf8(privateKey.decrypt(encryptedKey));
                iv = forge.util.decodeUtf8(privateKey.decrypt(encryptedIV));
            }

            // Encrypt contents of comments
            encryptedText = EncryptionAPI.encrypt(text, key, iv)

            dispatch(globalActions.showTopLoading());

            // Get current user id
            let uid = getState().authorize.uid;

            // Write the new data simultaneously in the list
            let updates = {};
            let comment = getState().comment.postComments[postId][id];

            updates[`postComments/${postId}/${id}`] = {
                postId: postId,
                score: comment.score,
                text: encryptedText,
                creationDate: comment.creationDate,
                userDisplayName: comment.userDisplayName,
                userAvatar: comment.userAvatar,
                userId: uid,
            };

            return firebaseRef.update(updates).then((result) => {
                dispatch(updateComment({ id, postId, text, editorStatus: false }));
                dispatch(globalActions.hideTopLoading());
            }, (error) => {
                dispatch(globalActions.showErrorMessage(error.message));
                dispatch(globalActions.hideTopLoading());
            });
        });
    }

}

/**
 * Delete a comment from database
 * @param  {string} id of comment
 * @param {string} postId is the identifier of the post which comment belong to
 */
export const dbDeleteComment = (id, postId) => {
    return (dispatch, getState) => {
        dispatch(globalActions.showTopLoading());

        // Get current user id
        let uid = getState().authorize.uid;

        // Write the new data simultaneously in the list
        let updates = {};
        updates[`postComments/${postId}/${id}`] = null;

        return firebaseRef.update(updates).then((result) => {
            dispatch(deleteComment(id, postId));
            dispatch(globalActions.hideTopLoading());
        }, (error) => {
            dispatch(globalActions.showErrorMessage(error.message));
            dispatch(globalActions.hideTopLoading());
        });
    }
}

/* _____________ CRUD State _____________ */

/**
 * Add comment 
 * @param {object} data  
 */
export const addComment = (data) => {
    return {
        type: types.ADD_COMMENT,
        payload: data,
    };
}

/**
 * Update comment 
 * @param {object} data  
 */
export const updateComment = (data) => {
    return {
        type: types.UPDATE_COMMENT,
        payload: data,
    };
}

/**
 * Add comment list
 * @param {[object]} postComments an array of comments
 */
export const addCommentList = (postComments) => {
    return {
        type: types.ADD_COMMENT_LIST,
        payload: postComments,
    };
}

/**
 * Delete a comment
 * @param  {string} id of comment
 * @param {string} postId is the identifier of the post which comment belong to
 */
export const deleteComment = (id, postId) => {
    return { type: types.DELETE_COMMENT, payload: { id, postId } };
}

// Clear all data
export const clearAllData = () => {
    return {
        type: types.CLEAR_ALL_DATA_COMMENT,
    };
}

export const openCommentEditor = (comment) => {
    return {
        type: types.OPEN_COMMENT_EDITOR,
        payload: comment,
    };
}

export const closeCommentEditor = (comment) => {
    return {
        type: types.CLOSE_COMMENT_EDITOR,
        payload: comment,
    };
}