import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { push } from 'react-router-redux';
import SvgClose from 'material-ui/svg-icons/navigation/close';
import { grey400 } from 'material-ui/styles/colors';

// - Import app components
import UserAvatar from 'UserAvatar';

// - Import actions
import * as notifyActions from 'notifyActions';
import * as friendActions from 'friendActions';

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
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        const { description, fullName, avatar, isSeen, id, goTo, closeNotify, notifierUserId, url, deleteNotify, isRequest, acceptRequest, rejectRequest} = this.props;
        if( isRequest ) {
            return (
                <div className='item' style={isSeen ? { opacity: 0.6 } : {}} key={id}>
                    <div className='avatar'>
                        <NavLink
                            to={`/${notifierUserId}`}
                            onClick={(evt) => {
                                evt.preventDefault()
                                closeNotify()
                                goTo(`/${notifierUserId}`)
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
                    <div>
                        <button onClick={() => {acceptRequest({userId: notifierUserId, fullName, avatar}); deleteNotify(notifierUserId)}}>Confirm</button>
                        <button onClick={() => {rejectRequest({userId: notifierUserId, fullName, avatar}); deleteNotify(notifierUserId)}}>Reject</button>
                    </div>
                </div>
            )   
        }
        
        return (
            <div className='item' style={isSeen ? { opacity: 0.6 } : {}} key={id}>
                <div className='avatar'>
                    <NavLink
                        to={`/${notifierUserId}`}
                        onClick={(evt) => {
                            evt.preventDefault()
                            closeNotify()
                            goTo(`/${notifierUserId}`)
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
                <div className='close' onClick={() => deleteNotify(notifierUserId)}>
                    <SvgClose hoverColor={grey400} style={{ cursor: 'pointer' }} />
                </div>
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
        acceptRequest: (user) => dispatch(friendActions.dbAcceptFriendRequest(user)),
        rejectRequest: (user) => dispatch(friendActions.dbCancelFriendRequest(user)),
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

    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(NotifyItem)
