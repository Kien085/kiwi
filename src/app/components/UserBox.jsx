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
        const styles = {
            paper: {
                height: 254,
                width: 243,
                margin: 10,
                textAlign: 'center',
                maxWidth: '257px'
            },
            followButton: {
                position: 'absolute',
                bottom: '8px',
                left: 0,
                right: 0
            }
        };

        return (
            <Paper style={styles.paper} zDepth={1} className='grid-cell'>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    height: '100%',
                    position: 'relative',
                    padding: '30px'

                }}>
                    <div onClick={() => this.props.goTo(`/${this.props.userId}`)} style={{ cursor: 'pointer' }}>
                        <UserAvatar
                            fullName={this.props.fullName}
                            fileName={this.props.avatar}
                            size={90}
                        />
                    </div>
                    <div onClick={() => this.props.goTo(`/${this.props.userId}`)} className='people__name' style={{ cursor: 'pointer' }}>
                        <div>
                            {this.props.user.fullName}
                        </div>
                    </div>
                    <div style={styles.followButton}>
                        <FlatButton
                            label={'Add Friend'}
                            primary={true}
                            onTouchTap={this.handleFriendUser}
                        />
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