import React, { Component } from 'react';
import { firebaseRef, firebaseAuth, storageRef } from 'app/firebase/';

// - Import app components
import { Widget, addResponseMessage} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

export class Messenger extends Component {
    /**
     * Handles outgoing messages from user
     * @param {String} string of message to send
     */
    handleNewUserMessage = (newMessage) => {
        //TODO send message to a specific conversation key
        let toUploadMsg = {
            message: newMessage,
        };

        //TODO Refine how messages are written for ease of future reads
        //let convoRef = firebaseRef.child(`userMessages/`).push(toUploadMsg);
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
                    title = {"User's chat"}
                    subtitle = {""}
                />
            </div>
        )
    }
}

// - Connect component to redux store
export default Messenger;
