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
import UserAvatar from './UserAvatar';

// - Import API
import CircleAPI from '../api/CircleAPI';

// - Import actions
import * as circleActions from '../actions/circleActions';

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

            // The value of circle input
            circleName: '',

            // It will be true if the text field for adding group is empty
            disabledAddCircle: true
        };
    }

    handleFollowUser = (checked, cid) => {
        const { userId, user } = this.props;
        const { avatar, fullName } = user;

        if (checked) {
            this.props.addFollowingUser(cid, { avatar, userId, fullName });
        } else {
            this.props.deleteFollowingUser(cid, userId);
        }
    }

    /**
     * Handle create circle
     * 
     * @memberof UserBox
     */
    handleCreateCricle = () => {
        const { circleName } = this.state;

        if (circleName && circleName.trim() !== '') {
            this.props.createCircle(circleName);

            this.setState({
                circleName: '',
                disabledAddCircle: true
            });
        }
    }

    /**
     * Handle change group name input to the state
     * 
     * @memberof UserBox
     */
    handleChangeName = (evt) => {
        this.setState({
            circleName: evt.target.value,
            disabledAddCircle: (evt.target.value === undefined || evt.target.value.trim() === '')
        });
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

    circleList = () => {
        const { circles, _, userBelongCircles } = this.props;

        if (circles) {
            return Object.keys(circles).map((key, index) => {
                if (key.trim() !== '-Followers') {
                    const isBelong = userBelongCircles.indexOf(key) > -1;

                    return (<Checkbox
                        key={key}
                        style={{ padding: '10px' }}
                        label={circles[key].name}
                        labelStyle={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%'
                        }}
                        onCheck={(evt, checked) => this.handleFollowUser(checked, key)}
                        checked={isBelong}
                    />);
                }
            });
        }
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
                    <div>
                        <FlatButton>Add friend</FlatButton>
                        <FlatButton>Cancel request</FlatButton>
                        <FlatButton>Approve</FlatButton>
                        <FlatButton>Deny</FlatButton>
                        <FlatButton>Unfriend</FlatButton>
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
        createCircle: (name) => dispatch(circleActions.dbAddCircle(name)),
        addFollowingUser: (cid, user) => dispatch(circleActions.dbAddFollowingUser(cid, user)),
        deleteFollowingUser: (cid, followingId) => dispatch(circleActions.dbDeleteFollowingUser(cid, followingId)),
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
    const { uid } = state.authorize
    const circles = state.circle ? (state.circle.userCircles[uid] || {}) : {}
    const userBelongCircles = CircleAPI.getUserBelongCircles(circles, ownProps.userId)

    return {
        circles: circles,
        userBelongCircles: userBelongCircles || [],
        belongCirclesCount: userBelongCircles.length || 0,
        firstBelongCircle: userBelongCircles ? (circles ? circles[userBelongCircles[0]] : {}) : {},
        avatar: state.user.info && state.user.info[ownProps.userId] ? state.user.info[ownProps.userId].avatar || '' : '',
        fullName: state.user.info && state.user.info[ownProps.userId] ? state.user.info[ownProps.userId].fullName || '' : ''
    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(UserBox)