import { firebaseRef, firebaseAuth } from 'app/firebase/';
import moment from 'moment';
import { push } from 'react-router-redux';

// - Import action types
import * as types from 'actionTypes';

// - Import actions
import * as globalActions from 'globalActions';
import * as friendActions from 'friendActions';
import EncryptionAPI from '../api/EncryptionAPI';

/* _____________ CRUD DB _____________ */

/**
 * Log in user in server
 * @param {string} email 
 * @param {string} password 
 */
export var dbLogin = (email, password) => {
    return (dispatch, getState) => {
        dispatch(globalActions.showNotificationRequest());
     
        // Log in user if input matches credentials in db
        return firebaseAuth().signInWithEmailAndPassword(email, password).then((result) => {
            dispatch(globalActions.showNotificationSuccess());
            dispatch(login(result.uid));
            dispatch(push('/'));
            dispatch(friendActions.dbHandleFriendRequests()); // Listener to own request branch
        }, (error) => dispatch(globalActions.showErrorMessage(error.code)))
    }
}

/**
 * Login user with OAuth
 * @param {string} type 
 */
export var dbLoginWithOAuth = (provider) => {
    return (dispatch, getState) => {
      dispatch(globalActions.showNotificationRequest());
  
    //   return authorizeService.loginWithOAuth(type).then((result) => {
      return firebaseAuth().signInWithPopup(provider).then((result) => {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        // var token = result.credential.accessToken;
        // The signed-in user info.
        // var user = result.user;
        dispatch(globalActions.showNotificationSuccess());
        dispatch(login(result.uid));
        dispatch(push('/'));
        })
    //   }, (error) => dispatch(globalActions.showErrorMessage(error.code)))
        .catch((error) => {
          // An error happened.
          dispatch(globalActions.showErrorMessage(error.code));
  
        })
    }
  }

// Log out user in server
export var dbLogout = () => {
    return (dispatch, getState) => {
        return firebaseAuth().signOut().then((result) => {
            dispatch(logout());
            dispatch(push('/login'));

        }, (error) => dispatch(globalActions.showErrorMessage(error.code)));
    }
}

/**
 * Register user in database
 * @param {object} user 
 */
export var dbSignup = (user) => {
    return (dispatch, getState) => {
        dispatch(globalActions.showNotificationRequest());
        return firebaseAuth().createUserWithEmailAndPassword(user.email, user.password).then((signupResult) => {
            // Generate keys for encryption
            EncryptionAPI.generateKeys(signupResult.uid);

            // Prevent password from being stored
            delete user.password;
            firebaseRef.child(`users/${signupResult.uid}/info`).set({
                ...user,
                avatar: 'noImage'
            }).then((result) => {
                dispatch(globalActions.showNotificationSuccess())
            }, (error) => dispatch(globalActions.showErrorMessage(error.code)));
            
            dispatch(signup({
                uid: signupResult.uid,
                ...user
            }));
            
            dispatch(push('/'));
        }, (error) => dispatch(globalActions.showErrorMessage(error.code)))
    }

}

/**
 * Change user's password
 * @param {string} newPassword 
 */
export const dbUpdatePassword = (newPassword) => {
    return (dispatch, getState) => {
        dispatch(globalActions.showNotificationRequest());
        firebaseAuth().onAuthStateChanged((user) => {
            if (user) {
                user.updatePassword(newPassword).then(() => {
                    // Update successful.
                    dispatch(globalActions.showNotificationSuccess());
                    dispatch(updatePassword());
                    dispatch(push('/'));
                }, (error) => {
                    // An error happened.
                    switch (error.code) {
                        case 'auth/requires-recent-login':
                            dispatch(globalActions.showErrorMessage(error.code));
                            dispatch(dbLogout());
                            break;
                        default:
                    }
                })
            }

        })
    }
}

/**
 * Reset user's password
 * @param {string} newPassword
 */
export const dbResetPassword = (email) => {
    return (dispatch, getState) => {
      dispatch(globalActions.showNotificationRequest())
  
      return firebaseAuth().sendPasswordResetEmail(email).then(() => {
  
        // Reset password successful.
        dispatch(globalActions.showNotificationSuccess())
        dispatch(push('/login'))
      })
        .catch((error) => {
          // An error happened.
          dispatch(globalActions.showMessage(error.code))
  
        })
    }
  }

/* _____________ CRUD State _____________ */

/**
 * Login user
 * @param {string} uid 
 */
export var login = (uid) => {
    return { type: types.LOGIN, authed: true, uid };
}

/**
 * Logout user
 */
export var logout = () => {
    return { type: types.LOGOUT };
}

/**
 *  Register user
 * @param {object} user 
 */
export var signup = (user) => {
    return {
        type: types.SIGNUP,
        ...user
    };
}

/**
 * Update user's password
 */
export const updatePassword = () => {
    return { type: types.UPDATE_PASSWORD };
}