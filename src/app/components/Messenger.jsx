import React, { Component } from 'react';
import { firebaseRef, firebaseAuth } from 'app/firebase/';
import moment from 'moment';
import uuid from 'uuid';
import {connect} from "react-redux";

// - Import app components
import { Widget, addResponseMessage} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

export class Messenger extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * Loads previous messages in conversation from firebase
     */
    componentWillMount() {
        //TODO Switch to this line when conversation ids have been made
        firebaseRef.child(`userMessages/messageList`).once('value').then((snapshot) => {
                let message = snapshot.val() || {};

                if (message && message.message) {
                    addResponseMessage(message.message);
                }
            });
    }

    /**
     * Handles outgoing messages from user
     * @param {String} string of message to send
     */
    handleNewUserMessage = (newMessage) => {
        //TODO send message to a specific conversation key
        let toUploadMsg = {
            message: newMessage,
            sender: uuid,
            timeSent: moment.unix()
        }

        //TODO send message to a specific conversation key
        let convoRef = firebaseRef.child(`userMessages/messageList`).push(toUploadMsg);
    }

    /**
     * Render DOM component
     * 
     * @returns Messenger Widget
     */
    render() {
        return (
            <div id="messenger">
                <Widget
                    handleNewUserMessage = {this.handleNewUserMessage}
                    title = {`Chat Title`}
                    subtitle = {""}
                />
            </div>
        )
    }
}

/**
 * Map dispatch to props
 * @param  {func} dispatch is the function to dispatch action to reducers
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapDispatchToProps = (dispatch, ownProps) => {
    const { userId } = ownProps.uid

    return {
        loadUserInfo: () => dispatch(userActions.dbGetUserInfoByUserId(userId, 'header'))

    }
}

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state, ownProps) => {
    const { userId } = ownProps.uid
    const { uid } = state.authorize

    return {
        avatar: state.user.info && state.user.info[userId] ? state.user.info[userId].avatar || '' : '',
        name: state.user.info && state.user.info[userId] ? state.user.info[userId].fullName || '' : '',
        isAuthedUser: userId === uid,
        userId
    }
}
// - Connect component to redux store
export default (Messenger)