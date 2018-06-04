import React, { Component } from 'react';
import { firebaseRef, firebaseAuth } from 'app/firebase/';
import moment from 'moment';
import uuid from 'uuid';

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
        console.log("Mounting messenger");
        // TODO fix 'user doesn't have permissions' when reading from db
        firebaseRef.child("userMessages/").once('value').then(function (snapshot) {
            console.log(snapshot.val());

            this.props = {
                messages: snapshot.val()
            };
        })

        console.log("Loading messages " + this.props.messages);

        if (this.props && this.props.messages) {
            for (let message in this.props.messages) {
                // TODO uncomment to load previous messages to widget
                //addResponseMessage(message);
                console.log(message);
            }
        }
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

        //TODO Refine how messages are written for ease of future reads

        console.log(`About to upload : ${toUploadMsg}`)
        // TODO Fix writing to db
        let convoRef = firebaseRef.child(`userMessages/`).push(toUploadMsg);
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
                    title = {`'s Chat`}
                    subtitle = {""}
                />
            </div>
        )
    }
}

// - Connect component to redux store
export default (Messenger)