import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import { firebaseRef, firebaseAuth } from 'app/firebase/';
import moment from 'moment';
import {push} from "react-router-redux";
import {connect} from "react-redux";

// - Import app components
import { Widget, addResponseMessage} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';


// - Import actions
import * as voteActions from 'voteActions';
import * as postActions from 'postActions';
import * as globalActions from 'globalActions';
import {addImageList} from "../actions/imageGalleryActions";

export class Messenger extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * Loads previous messages in conversation from firebase
     */
    componentWillMount() {
        console.log("Mounting messenger");

        //TODO Switch to this line when conversation ids have been made
        //firebaseRef.child(`userMessages/${this.props.convoID}`).once('value').then((snapshot) => {
        firebaseRef.child(`userMessages/messageList`).once('value').then((snapshot) => {
                let message = snapshot.val() || {};

                if (message && message.message) {
                    addResponseMessage(message.message);
                }
            });


        // firebaseRef.child("userMessages/").once('value').then(function (snapshot) {
        //     console.log(snapshot.val());
        //
        //     this.props = {
        //         messages: snapshot.val()
        //     };
        // })
    }

    /**
     * Handles outgoing messages from user
     * @param {String} string of message to send
     */
    handleNewUserMessage = (newMessage) => {

        let toUploadMsg = {
            message: newMessage,
            sender: this.props.uid,
            timeStamp: moment().unix()
        }

        console.log(toUploadMsg);

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
                    title = {`${this.props.name}'s Chat`}
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
    console.log("mapDispatch");
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

    console.log(state);

    return {
        avatar: state.user.info && state.user.info[userId] ? state.user.info[userId].avatar || '' : '',
        name: state.user.info && state.user.info[userId] ? state.user.info[userId].fullName || '' : '',
        isAuthedUser: userId === uid,
        userId
    }
}
// - Connect component to redux store
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Messenger))
