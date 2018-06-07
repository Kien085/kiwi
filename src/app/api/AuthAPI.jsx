import { firebaseAuth, firebaseRef } from '../firebase/';
import store from '../store/configureStore';

// - Check user if is authorized
export let isAuthorized = () => {
    let state = store.getState();
    return state.authorize.authed;
}

export var isAdmin = () => {
    return true;
}