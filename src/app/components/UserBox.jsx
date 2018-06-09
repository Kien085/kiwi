import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';

// - Import app components
import UserAvatar from 'UserAvatar';

// - Import API
import CircleAPI from 'CircleAPI';

// - Import actions
import * as friendActions from 'friendActions';

export class UserBox extends Component {

    /**
     * Component constructor
     * @param  {object} props is an object properties of component
     */
    constructor(props) {
        super(props);

        this.state = {
            // It will be true if user follow popover is open
            open: false,

            // It will be true if the two users are friends
            isFriend: false,

        };
    }


    handleFriendUser = (evt) => {
        // This prevents ghost click.
        event.preventDefault();
        const { userId, user } = this.props;
        const { avatar, fullName } = user;

        this.props.addFriendRequest({ avatar, userId, fullName });
    }

   


    /**
     * Handle touch tab on follow popover
     * 
     * @memberof UserBox
     */
    handleTouchTap = (evt) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: evt.currentTarget,
        });
    }

    /**
     * Handle close follow popover
     * 
     * @memberof UserBox
     */
    handleRequestClose = () => {
        this.setState({ open: false });
    }

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
        let retVal = null;
        Object.keys(sentRequests).forEach((index) => {
            if(sentRequests[index].request.uid === userFriendId) {
                retVal = [sentRequests[index].myReqId, sentRequests[index].request]
            }
        });
        return retVal;
    }

    /**
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        let userId = this.props.friendId;
        let avatar = this.props.friendAvatar;
        let fullName = this.props.friendFullName;
        let userFriend = {userId, avatar, fullName};
        let requestIds =  this.getRequestIds(userId);
        let myRequestId =  undefined;
        let friendRequest = null;
        if(requestIds !== null) {
            myRequestId = requestIds[0];
            friendRequest = requestIds[1];
        }
        return (
            <Paper style={{height: '100px', width: '100%', margin: '10', textAlign: 'center'}} zDepth={1} className='grid-cell'>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: '100%', position: 'relative', padding: '30px'}}>
                    <div onClick={() => this.props.goTo(`/${this.props.userId}`)} style={{ cursor: 'pointer' }}>
                        <UserAvatar fullName={this.props.fullName} fileName={this.props.avatar} size={60}/>
                    </div>
                    <div onClick={() => this.props.goTo(`/${this.props.userId}`)} style={{cursor: 'pointer', wordBreak: 'break-word', padding: '10px'}}>
                        <div style={{color: 'black', fontSize: '20px', lineHeight: '20px', marginLeft: '20px', overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                            {this.props.user.fullName}
                        </div>
                    </div>
                    <div>
                        <FlatButton onClick={ () => this.props.addFriendRequest(userFriend)}>Add friend</FlatButton>
                        <FlatButton onClick={ () => this.props.cancelFriendRequest(userFriend, myRequestId, friendRequest === null ? friendRequest: friendRequest.reqId)}>Cancel request</FlatButton>
                        <FlatButton onClick={ () => this.props.acceptFriend(myRequestId, friendRequest)}>Approve</FlatButton>
                        <FlatButton onClick={ () => this.props.denyFriend(myRequestId, friendRequest)}>Deny</FlatButton>
                        <FlatButton onClick={ () => this.props.deleteFriend(userId)}>Unfriend</FlatButton>
                    </div>
                </div>
            </Paper>
        );
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
        addFriendRequest: (user) => dispatch(friendActions.dbAddFriendRequest(user)),
        cancelFriendRequest: (userFriend, myRequestId, theirRequestId) => dispatch(friendActions.dbCancelFriendRequest(userFriend, myRequestId, theirRequestId)),
        acceptFriend: (myRequestId, request) => dispatch(friendActions.dbAcceptFriendRequests(myReqId, request)),
        denyFriend: (myRequestId, request) => dispatch(friendActions.dbDenyFriendRequest(myRequestId, request)),
        deleteFriend: (friendId) => dispatch(friendActions.dbDeleteFriends(friendId)),
        goTo: (url) => dispatch(push(url))

    }
}

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state, ownProps) => {
    const { uid } = state.authorize;
    const friends = state.friends;
    const sentRequests = state.sentFriendRequests;
    const { userId } = ownProps;
    const { avatar, fullName } = ownProps.user;

    return {
        friendId: userId,
        friendAvatar: avatar,
        friendFullName: fullName,
        friends: friends,
        avatar: state.user.info && state.user.info[ownProps.userId] ? state.user.info[ownProps.userId].avatar || '' : '',
        fullName: state.user.info && state.user.info[ownProps.userId] ? state.user.info[ownProps.userId].fullName || '' : '',
        sentRequests: state.sentFriendRequests ? state.sentFriendRequests : [],
    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(UserBox)