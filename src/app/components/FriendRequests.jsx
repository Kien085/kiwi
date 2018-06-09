import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Button} from 'material-ui';

// - Import actions
import * as friendActions from 'friendActions';

export class FriendRequests extends Component {

    /**
     * Check if a friend request has already been sent to user
     * @return {boolean} true if friend request has been sent, false if not
     */
    hasSentRequest = () => {
        const { sentRequests, uid } = this.props;
        
        Object.keys(sentRequests).forEach((index) => {
            if (sentRequests[index].uid = uid) return true;
        });
        return false;
    }
    

    /**
     * Retrieve requestId of own sent request and and other user's received request 
     * @param {string} userFriendId user authenticator id of friend
     * @return {Array} returns array where first element is requestId of own sent request
     *                                     second element is requestId of other user's received request
     */
    getRequestIds = (userFriendId) => {
        const { sentRequests } = this.props;
        Object.keys(sentRequests).forEach((index) => {
            if(sentRequests[index].request.uid === userFriendId)
                return [sentRequests[index].myReqId, sentRequests[index].request.reqId]
        });
    }


    /**
     * Render component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        const { uid, avatar, fullName } = this.props;
        let user = { userId: uid, avatar, fullName };
        let hasSentReq = this.hasSentRequest();
        let myRequestId, theirRequestId;

        if (!hasSentReq) {
            return (
                <button onClick={() => this.props.addFriendRequest(user)}>Send Friend Request</button>
                // <Button variant="contained" size="medium" color="primary" onClick={() => addFriendRequest(user)}>
                //     Send Friend Request
                // </Button>
            )
        } else {
            myRequestId, theirRequestId = this.getRequestIds(uid);
            return (
                <button>Cancel Friend Request</button>
                // <Button variant="contained" size="medium" color="primary" onClick={() => cancelFriendRequest(user)}>
                //     Cancel Friend Request
                // </Button>
            )
        }
    }

}


/**
 * Map dispatch to props
 * @param  {func} dispatch is the function to dispatch action to reducers
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addFriendRequest: (userFriend) => dispatch(friendActions.dbAddFriendRequest(userFriend)),
        cancelFriendRequest: (userFriend, myRequestId, theirRequestId) => dispatch(friendActions.dbCancelFriendRequest(userFriend, myRequestId, theirRequestId)),
    }
}


/**
 * Map state to props
 * @param  {object} state is the object from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state, ownProps) => {
    let { uid, fullName, avatar } = ownProps;
    const sentRequests = state.sentFriendRequests;

    return {
        uid,
        fullName,
        avatar,
        sentRequests: state.sentFriendRequests ? state.sentFriendRequests : [],
    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps) (FriendRequests)