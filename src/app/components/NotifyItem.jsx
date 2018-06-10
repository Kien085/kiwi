import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { push } from 'react-router-redux';
import SvgClose from 'material-ui/svg-icons/navigation/close';
import { grey400 } from 'material-ui/styles/colors';

// - Import app components
import UserAvatar from './UserAvatar';

// - Import actions
import * as notifyActions from '../actions/notifyActions';
import * as friendActions from '../actions/friendActions';

export class NotifyItem extends Component {

    handleSeenNotify = (evt) => {
        evt.preventDefault();
        const { seenNotify, id, url, goTo, isSeen, closeNotify } = this.props;

        if (id) {
            if (!isSeen) {
                seenNotify(id);
            }

            closeNotify();
            goTo(url);
        }
    }

    /**
     * Retrieve requestId of own sent request and and other user's received request 
     * @param {string} userFriendId user authenticator id of friend
     * @return {Array} returns array where first element is requestId of own sent request
     *                                     second element is request object corresponding to requestId
     */
    getReceivedRequestIds = (userFriendId) => {
        const { receivedRequests } = this.props;
        let retVal = null;
        Object.keys(receivedRequests).forEach((index) => {
            if(receivedRequests[index].request.uid === userFriendId) {
                retVal = [receivedRequests[index].myReqId, receivedRequests[index].request]
            }
        });
        return retVal;
    }

    /**
     * Render component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        const { description, fullName, avatar, isSeen, id, notifierUserId, url, isRequest} = this.props;
        let myReceivedRequestId, receivedFriendRequest;
        if (isRequest) {
            let receivedRequestIds =  this.getReceivedRequestIds(notifierUserId);
            if (receivedRequestIds !== null) {
                myReceivedRequestId = receivedRequestIds[0];
                receivedFriendRequest = receivedRequestIds[1];
            }
        }
        return (
            <div className='item' style={isSeen ? { opacity: 0.6 } : {}} key={id}>
                <div className='avatar'>
                    <NavLink
                        to={`/${notifierUserId}`}
                        onClick={(evt) => {
                            evt.preventDefault()
                            this.props.closeNotify()
                            this.props.goTo(`/${notifierUserId}`)
                        }}
                    >
                        <UserAvatar fullName={fullName} fileName={avatar} />
                    </NavLink>
                </div>
                <div className='info'>
                    <NavLink to={url} onClick={this.handleSeenNotify}>
                        <div className='user-name'>
                            {fullName}
                        </div>
                        <div className='description'>
                            {description}
                        </div>
                    </NavLink>
                </div>
                { isRequest ? 
                (<div>
                    <button onClick={() => {this.props.acceptFriend(myReceivedRequestId, receivedFriendRequest); this.props.deleteNotify(id);}}>Confirm</button>
                    <button onClick={() => {this.props.denyFriend(myReceivedRequestId, receivedFriendRequest); this.props.deleteNotify(id);}}>Delete</button>
                </div>)  
                : (<div className='close' onClick={() => this.props.deleteNotify(id)}>
                    <SvgClose hoverColor={grey400} style={{ cursor: 'pointer' }} />
                </div>)
                }
            
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
    return {
        goTo: (url) => dispatch(push(url)),
        seenNotify: (id) => dispatch(notifyActions.dbSeenNotify(id)),
        deleteNotify: (id) => dispatch(notifyActions.dbDeleteNotify(id)),
        acceptFriend: (myRequestId, request) => dispatch(friendActions.dbAcceptFriendRequest(myRequestId, request)),
        denyFriend: (myRequestId, request) => dispatch(friendActions.dbDenyFriendRequest(myRequestId, request)),
    }
}

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state, ownProps) => {
    return {
        receivedRequests: state.receivedFriendRequests ? state.receivedFriendRequests : [],
    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(NotifyItem)
