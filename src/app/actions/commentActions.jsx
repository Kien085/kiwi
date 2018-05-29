import moment from 'moment';
import { firebaseRef } from 'app/firebase/';

// - Import action types
import * as types from 'actionTypes';

// - Import actions
import * as globalActions from 'globalActions';
import * as notifyActions from 'notifyActions';

import forge from 'node-forge';
/* _____________ CRUD DB _____________ */

/**
 *  Add comment to database
 * @param  {object} newComment user comment
 * @param  {function} callBack  will be fired when server responsed
 */
export const dbAddComment = (newComment, callBack) => {
    console.log("OUTPUT: In function dbAddComment() in commentActions");
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
            userId: uid
        };

         // Deep copy of comments
         let encryptedComment = JSON.parse(JSON.stringify(comment));

         // Get own public key
         let key = localStorage.getItem('PUBkey');
         let iv = localStorage.getItem('PUBiv');
         let privateKey, publicKey;
        
         // Encrypt contents of comments
         let cipher = forge.cipher.createCipher('AES-CBC', key);
         cipher.start({iv: iv});
         cipher.update(forge.util.createBuffer(comment.text));
         cipher.finish();
         encryptedComment.text = forge.util.encode64(cipher.output.getBytes()); 

        // Save encrypted comment to firebase
        let commentRef = firebaseRef.child(`postComments/${newComment.postId}`).push(encryptedComment);
        dispatch(addComment(
            {
                comment,
                postId: newComment.postId,
                id: commentRef.key,
                editorStatus: false
            }));
        return commentRef.then(() => {
            callBack();
            dispatch(globalActions.hideTopLoading());

            if (newComment.ownerPostUserId !== uid)
                dispatch(notifyActions.dbAddNotify(
                    {
                        description: 'Add comment on your post.',
                        url: `/${newComment.ownerPostUserId}/posts/${newComment.postId}`,
                        notifyRecieverUserId: newComment.ownerPostUserId, notifierUserId: uid
                    }));
        }, (error) => {
            dispatch(globalActions.showErrorMessage(error.message));
            dispatch(globalActions.hideTopLoading());
        })

    }
}

// Get all comments from database
export const dbGetComments = () => {
    console.log("OUTPUT: In function dbGetComments() in commentActions");
    return (dispatch, getState) => {
        // let key, iv, decipher;
        let uid = getState().authorize.uid;
        if (uid) {
            let commentsRef = firebaseRef.child(`postComments`);
            let comments;
            return commentsRef.on('value', (snapshot) => {
                comments = snapshot.val() || {};
                
                // Decrypt comments 
                Object.keys(comments).forEach((postId) => {
                    let singleComment = [];
                    // For each post, decrypt its comments
                    Object.keys(comments[postId]).forEach((commentId) => {
                        // Look up key and iv to decipher post
                        let key, iv, decipher;
                        let postUid = comments[postId][commentId].userId;
                        let keysRef = firebaseRef.child(`keys/${postUid}`);
                        keysRef.once('value').then((snap) => {
                            if(snap.val()) {
                                key = snap.val().key || {};
                                iv = snap.val().iv || {};
                                decipher = forge.cipher.createDecipher('AES-CBC', key);
                                decipher.start({iv: iv});
                                decipher.update(forge.util.createBuffer(forge.util.decode64(comments[postId][commentId].text)));
                                decipher.finish();
                                let decipheredText = decipher.output.toString();
                                comments[postId][commentId].text = decipheredText;
                            }
                        });
                    });
                })
                dispatch(addCommentList(comments));
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
    console.log("OUTPUT: In function dbUpdateComment() in commentActions");

    return (dispatch, getState) => {

        dispatch(globalActions.showTopLoading());

        // Get current user id
        let uid = getState().authorize.uid;

        // Write the new data simultaneously in the list
        let updates = {};
        let comment = getState().comment.postComments[postId][id];

        updates[`postComments/${postId}/${id}`] = {
            postId: postId,
            score: comment.score,
            text: text,
            creationDate: comment.creationDate,
            userDisplayName: comment.userDisplayName,
            userAvatar: comment.userAvatar,
            userId: uid
        };

        return firebaseRef.update(updates).then((result) => {
            dispatch(updateComment({ id, postId, text, editorStatus: false }));
            dispatch(globalActions.hideTopLoading());
        }, (error) => {
            dispatch(globalActions.showErrorMessage(error.message));
            dispatch(globalActions.hideTopLoading());
        });
    }

}

/**
 * Delete a comment from database
 * @param  {string} id of comment
 * @param {string} postId is the identifier of the post which comment belong to
 */
export const dbDeleteComment = (id, postId) => {
    console.log("OUTPUT: In function dbDeleteComments() in commentActions");
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
    console.log(data);
    return {
        type: types.ADD_COMMENT,
        payload: data
    };
}

/**
 * Update comment 
 * @param {object} data  
 */
export const updateComment = (data) => {
    return {
        type: types.UPDATE_COMMENT,
        payload: data
    };
}

/**
 * Add comment list
 * @param {[object]} postComments an array of comments
 */
export const addCommentList = (postComments) => {
    return {
        type: types.ADD_COMMENT_LIST,
        payload: postComments
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
        type: types.CLEAR_ALL_DATA_COMMENT
    };
}

export const openCommentEditor = (comment) => {
    return {
        type: types.OPEN_COMMENT_EDITOR,
        payload: comment
    };
}

export const closeCommentEditor = (comment) => {
    return {
        type: types.CLOSE_COMMENT_EDITOR,
        payload: comment
    };
}