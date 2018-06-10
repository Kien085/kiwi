import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';

// - Import app components
import NotifyItem from './NotifyItem';

// - Import actions
import * as userActions from '../actions/userActions';

export class Notify extends Component {

    notifyItemList = () => {
        const { notifications, info, onRequestClose } = this.props;
        let parsedDOM = [];

        if (notifications) {
            Object.keys(notifications).forEach((key) => {
                const { notifierUserId } = notifications[key];

                parsedDOM.push(
                    <NotifyItem
                        key={key}
                        description={(notifications[key] ? notifications[key].description || '' : '')}
                        fullName={(info[notifierUserId] ? info[notifierUserId].fullName || '' : '')}
                        avatar={(info[notifierUserId] ? info[notifierUserId].avatar || '' : '')}
                        id={key}
                        isSeen={(notifications[key] ? notifications[key].isSeen || false : false)}
                        url={(notifications[key] ? notifications[key].url || '' : '')}
                        notifierUserId={notifierUserId}
                        closeNotify={onRequestClose}
                        isRequest={notifications[key].isRequest}
                    />
                );
            })
        }

        return parsedDOM;
    }

    /**
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        const { open, anchorEl, onRequestClose } = this.props;

        return (
            <Popover
                className='homeHeader__notify-menu'
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                onRequestClose={onRequestClose}
            >
                <div className='container'>
                    <div className='title'>Notifications</div>
                    <div className='content'>
                        {this.notifyItemList()}
                    </div>
                </div>
            </Popover>
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
        notifications: state.notify.userNotifies,
        info: state.user.info
    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(Notify)
