import { firebaseAuth, firebaseRef } from 'app/firebase/';
import store from 'configureStore';

// - Check user if is authorized
export let isAuthorized = () => {
    let state = store.getState();
    return state.authorize.authed;
}

export var isAdmin = () => {
    return true;
}