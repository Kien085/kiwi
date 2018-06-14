import firebase, { firebaseRef } from '../firebase/';

// - Import utility components
import moment from 'moment';

// - Import action types
import * as types from '../constants/actionTypes';

// - Import actions
import * as globalActions from './globalActions';

// - Import app API
import EncryptionAPI from '../api/EncryptionAPI';

import forge from 'node-forge';

/* _____________ CRUD DB _____________ */

/**
 * Add a normal post
 * @param {object} newPost 
 * @param {function} callBack 
 */
export var dbAddPost = (newPost, callBack) => {
    return (dispatch, getState) => {
        dispatch(globalActions.showTopLoading());

        let uid = getState().authorize.uid;
        let post = {
            postTypeId: 0,
            creationDate: moment().unix(),
            deletationDate: '',
            score: 0,
            viewCount: 0,
            body: newPost.body,
            ownerUserId: uid,
            ownerDisplayName: newPost.name,
            ownerAvatar: newPost.avatar,
            lastEditDate: '',
            tags: newPost.tags || [],
            commentCounter: 0,
            image: '',
            video: '',
            disableComments: newPost.disableComments,
            disableSharing: newPost.disableSharing,
            deleted: false,
        };

        // Deep copy
        let encryptedPost = JSON.parse(JSON.stringify(post));

        // Get own data key
        let key = localStorage.getItem('dataKey');
        let iv = localStorage.getItem('dataIV');
        let keysRef = firebaseRef.child(`keys/${uid}`);
        keysRef.once('value', (snap) => {
            if (snap.val() && (!key || !iv)) {
                let encryptedKey = snap.val().key || '';
                let encryptedIV = snap.val().iv || '';

                // decrypt data key with a private key (defaults to RSAES PKCS#1 v1.5)
                let keyPair = JSON.parse(localStorage.getItem('keyPair'));
                let privateKey = forge.pki.privateKeyFromPem(keyPair.private);
                key = privateKey.decrypt(encryptedKey);
                iv = privateKey.decrypt(encryptedIV);
            }

            // encrypt text of post
            if (key && iv) encryptedPost.body = EncryptionAPI.encrypt(post.body, key, iv);

            // Create post in firebase
            let postRef = firebaseRef.child(`userPosts/${uid}/posts`).push(encryptedPost);
            return postRef.then(() => {
                dispatch(addPost(uid, {
                    ...post,
                    id: postRef.key,
                }));
                callBack();
                dispatch(globalActions.hideTopLoading());
            }, (error) => dispatch(globalActions.showErrorMessage(error.message)));
        });
    }
}



/**
 * Add a post with image
 * @param {object} newPost 
 * @param {function} callBack 
 */
export const dbAddImagePost = (newPost, callBack) => {
    return (dispatch, getState) => {
        dispatch(globalActions.showTopLoading());

        let uid = getState().authorize.uid;
        let post = {
            postTypeId: 1,
            creationDate: moment().unix(),
            deletationDate: '',
            score: 0,
            viewCount: 0,
            body: newPost.body,
            ownerUserId: uid,
            ownerDisplayName: newPost.name,
            ownerAvatar: newPost.avatar,
            lastEditDate: '',
            tags: newPost.tags || [],
            commentCounter: 0,
            image: newPost.image || '',
            imageFullPath: newPost.imageFullPath || '',
            video: '',
            disableComments: newPost.disableComments ? newPost.disableComments : false,
            disableSharing: newPost.disableSharing ? newPost.disableSharing : false,
            deleted: false,
        };

        // Deep copy
        let encryptedPost = JSON.parse(JSON.stringify(post));

        // Get own data key
        let key = localStorage.getItem('dataKey');
        let iv = localStorage.getItem('dataIV');
        let keysRef = firebaseRef.child(`keys/${uid}`);
        keysRef.once('value', (snap) => {
            if (snap.val() && (!key || !iv)) {
                let encryptedKey = snap.val().key || '';
                let encryptedIV = snap.val().iv || '';

                // decrypt data key with a private key (defaults to RSAES PKCS#1 v1.5)
                let keyPair = JSON.parse(localStorage.getItem('keyPair'));
                let privateKey = forge.pki.privateKeyFromPem(keyPair.private);
                key = privateKey.decrypt(encryptedKey);
                iv = privateKey.decrypt(encryptedIV);
            }

            // encrypt text of post
            if (key && iv) encryptedPost.body = EncryptionAPI.encrypt(post.body, key, iv);

            // Create post in firebase
            let postRef = firebaseRef.child(`userPosts/${uid}/posts`).push(encryptedPost);
            return postRef.then(() => {
                dispatch(addPost(uid, {
                    ...post,
                    id: postRef.key,
                }));
                callBack();
                dispatch(globalActions.hideTopLoading());
            }, (error) => dispatch(globalActions.showErrorMessage(error.message)));
        });
    };
}

/**
 * Update a post from database
 * @param  {object} newPost 
 * @param {func} callBack //TODO: anti pattern should change to parent state or move state to redux
 */
export const dbUpdatePost = (newPost, callBack) => {
    return (dispatch, getState) => {
        dispatch(globalActions.showTopLoading());

        // Get current user id
        let uid = getState().authorize.uid;

        // Write the new data simultaneously in the list
        let updates = {};
        let post = getState().post.userPosts[uid][newPost.id];
        let updatedPost = {
            postTypeId: post.postTypeId,
            creationDate: post.creationDate,
            deletationDate: '',
            score: post.score,
            viewCount: post.viewCount,
            body: newPost.body ? newPost.body : post.body || '',
            ownerUserId: uid,
            ownerDisplayName: post.ownerDisplayName,
            ownerAvatar: post.ownerAvatar,
            lastEditDate: moment().unix(),
            tags: newPost.tags ? newPost.tags : (post.tags || []),
            commentCounter: post.commentCounter,
            image: newPost.image ? newPost.image : post.image,
            video: '',
            disableComments: newPost.disableComments !== undefined ? newPost.disableComments : (post.disableComments ? post.disableComments : false),
            disableSharing: newPost.disableSharing !== undefined ? newPost.disableSharing : (post.disableSharing ? post.disableSharing : false),
            deleted: false,
        };

        // Deep copy
        let encryptedPost = JSON.parse(JSON.stringify(updatedPost));

        // Get own data key
        let key = localStorage.getItem('dataKey');
        let iv = localStorage.getItem('dataIV');
        let keysRef = firebaseRef.child(`keys/${uid}`);
        keysRef.once('value', (snap) => {
            if (snap.val() && (!key || !iv)) {
                let encryptedKey = snap.val().key || '';
                let encryptedIV = snap.val().iv || '';

                // decrypt data key with a private key (defaults to RSAES PKCS#1 v1.5)
                let keyPair = JSON.parse(localStorage.getItem('keyPair'));
                let privateKey = forge.pki.privateKeyFromPem(keyPair.private);
                key = privateKey.decrypt(encryptedKey);
                iv = privateKey.decrypt(encryptedIV);
            }

            // encrypt text of post
            if (key && iv) encryptedPost.body = EncryptionAPI.encrypt(updatedPost.body, key, iv);

            updates[`userPosts/${uid}/posts/${newPost.id}`] = encryptedPost;
            return firebaseRef.update(updates).then((result) => {
                dispatch(updatePost(uid, { id: newPost.id, ...updatedPost }));
                callBack();
                dispatch(globalActions.hideTopLoading());
            }, (error) => {
                dispatch(globalActions.showErrorMessage(error.message));
                dispatch(globalActions.hideTopLoading());
            });
        });
    };
}

/**
 * Delete a post from database
 * @param  {string} id is post identifier
 */
export const dbDeletePost = (id) => {
    return (dispatch, getState) => {
        dispatch(globalActions.showTopLoading());

        // Get current user id
        let uid = getState().authorize.uid;

        // Write the new data simultaneously in the list
        let updates = {};
        updates[`userPosts/${uid}/posts/${id}`] = null;

        return firebaseRef.update(updates).then((result) => {
            dispatch(deletePost(uid, id));
            dispatch(globalActions.hideTopLoading());
        }, (error) => {
            dispatch(globalActions.showErrorMessage(error.message));
            dispatch(globalActions.hideTopLoading());
        });
    };
}

//  Get all user posts from data base (self posts)
export const dbGetPosts = () => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;

        // Look up key and iv to decipher post
        let key = localStorage.getItem('dataKey');
        let iv = localStorage.getItem('dataIV');
        let keysRef = firebaseRef.child(`keys/${uid}`);
        keysRef.once('value', (snap) => {
            if (snap.val() && (!key || !iv)) {
                let encryptedKey = snap.val().key || '';
                let encryptedIV = snap.val().iv || '';

                // decrypt data key with a private key (defaults to RSAES PKCS#1 v1.5)
                let keyPair = JSON.parse(localStorage.getItem('keyPair'));
                let privateKey = forge.pki.privateKeyFromPem(keyPair.private);
                key = privateKey.decrypt(encryptedKey);
                iv = privateKey.decrypt(encryptedIV);
            }
            if (uid) {
                let postsRef = firebaseRef.child(`userPosts/${uid}/posts`);

                // Decrypt body of post look up all of own's posts
                return postsRef.once('value', (snapshot) => {
                    let posts = snapshot.val() || {};
                    let parsedPosts = {};
                    Object.keys(posts).forEach((postId) => {
                        parsedPosts[postId] = {
                            id: postId,
                            ...posts[postId]
                        };

                        // Decrypt body of post
                        if (key && iv) parsedPosts[postId].body = EncryptionAPI.decrypt(parsedPosts[postId].body, key, iv);
                    });

                    dispatch(addPosts(uid, parsedPosts));
                });
            }
        });
    };
}

/**
 *   Get single post from database by its id
 * @param  {string} uid is id of user whose posts we want to get
 * @param  {string} postId is id of post we want to get
 * */
export const dbGetPostById = (userId, postId) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;

        // Look up key and iv to decipher post
        let key, iv;
        let keysRef = firebaseRef.child(`keys/${uid}/${userId}`);
        keysRef.once('value', (snap) => {
            if (snap.val() && (!key || !iv)) {
                let encryptedKey = snap.val().key || '';
                let encryptedIV = snap.val().iv || '';

                // decrypt data key with a private key (defaults to RSAES PKCS#1 v1.5)
                let keyPair = JSON.parse(localStorage.getItem('keyPair'));
                let privateKey = forge.pki.privateKeyFromPem(keyPair.private);
                key = privateKey.decrypt(encryptedKey);
                iv = privateKey.decrypt(encryptedIV);
            }
            if (userId) {
                let postsRef = firebaseRef.child(`userPosts/${userId}/posts/${postId}`);

                return postsRef.once('value').then((snapshot) => {
                    const newPost = snapshot.val() || {};
                    const post = {
                        id: postId,
                        ...newPost
                    };

                    // Decrypt body of post
                    if (key && iv) post.body = EncryptionAPI.decrypt(post.body, key, iv);

                    dispatch(addPost(userId, post));
                });
            }
        });
    };
}

/**
 * Get all user post from database by user id
 * @param  {string} userId is id of user whose posts we want to get
 */
export const dbGetPostsByUserId = (userId) => {
    return (dispatch, getState) => {
        let uid = getState().authorize.uid;

        // Look up key and iv to decipher post
        let key, iv;
        let keysRef = firebaseRef.child(`keys/${uid}/${userId}`);
        keysRef.once('value', (snap) => {
            if (snap.val() && (!key || !iv)) {
                let encryptedKey = snap.val().key || '';
                let encryptedIV = snap.val().iv || '';

                // decrypt data key with a private key (defaults to RSAES PKCS#1 v1.5)
                let keyPair = JSON.parse(localStorage.getItem('keyPair'));
                let privateKey = forge.pki.privateKeyFromPem(keyPair.private);
                key = privateKey.decrypt(encryptedKey);
                iv = privateKey.decrypt(encryptedIV);
            }
            if (userId) {
                let postsRef = firebaseRef.child(`userPosts/${userId}/posts`);

                // Look up all posts of user with this id
                return postsRef.once('value', (snapshot) => {
                    let posts = snapshot.val() || {};
                    let parsedPosts = {};

                    Object.keys(posts).forEach((postId) => {
                        parsedPosts[postId] = {
                            id: postId,
                            ...posts[postId]
                        };

                        // Decrypt body of post
                        if (key && iv) parsedPosts[postId].body = EncryptionAPI.decrypt(parsedPosts[postId].body, key, iv);
                    });
                    dispatch(addPosts(userId, parsedPosts));
                });
            }
        });
    };
}

/* _____________ CRUD State _____________ */

/**
 * Add a normal post
 * @param {string} uid is user identifier
 * @param {object} post 
 */
export const addPost = (uid, post) => {
    return {
        type: types.ADD_POST,
        payload: { uid, post },
    };
}

/**
 * Update a post
 * @param {string} uid is user identifier
 * @param {object} post 
 */
export const updatePost = (uid, post) => {
    return {
        type: types.UPDATE_POST,
        payload: { uid, post },
    };
}

/**
 * Delete a post
 * @param {string} uid is user identifier
 * @param {string} id is post identifier
 */
export const deletePost = (uid, id) => {
    return {
        type: types.DELETE_POST,
        payload: { uid, id },
    };
}


/**
 * Add a list of post
 * @param {string} uid 
 * @param {[object]} posts 
 */
export const addPosts = (uid, posts) => {
    return {
        type: types.ADD_LIST_POST,
        payload: { uid, posts },
    };
}

/**
 * Clea all data in post store
 */
export const clearAllData = () => {
    return {
        type: types.CLEAR_ALL_DATA_POST,
    };
}

/**
 * Add a post with image
 * @param {object} post 
 */
export const addImagePost = (uid, post) => {
    return {
        type: types.ADD_IMAGE_POST,
        payload: { uid, post },
    };
}