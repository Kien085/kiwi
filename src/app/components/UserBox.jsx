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
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
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
        deleteFriend: (followingId) => dispatch(friendActions.dbDeleteFriend(followingId)),
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

    return {
        friends: friends,
        avatar: state.user.info && state.user.info[ownProps.userId] ? state.user.info[ownProps.userId].avatar || '' : '',
        fullName: state.user.info && state.user.info[ownProps.userId] ? state.user.info[ownProps.userId].fullName || '' : ''
    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(UserBox)