import React, { Component } from 'react';
import { connect } from 'react-redux';

// - Import app components
import UserBox from './UserBox';

export class UserBoxList extends Component {
    userList = () => {
        const { users, uid } = this.props;

        if (users) {
            return Object.keys(users).map((key, index) => {
                if (uid !== key)
                    return <UserBox key={key} userId={key} user={users[key]} />
            });
        }
    }

    /**
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        return (
            <div>
                {this.userList()}
            </div>
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
    const { uid } = state.authorize
    return {
        uid
    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(UserBoxList)