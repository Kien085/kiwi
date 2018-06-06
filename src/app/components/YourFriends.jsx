import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, ListItemText } from 'material-ui/List';

export class YourFriends extends Component {

    // Get list of friends
    friendList = () => {
        // TODO: Retrieve all friends
        const { friends, uid } = this.props;
        let parsedFriends = [];

        if (friends) {
            Object.keys(friends).map((key, index) => {
                parsedFriends.push(
                    <ListItem button>
                        <ListItemText inset primary={friends[key].fullName} />
                    </ListItem>)
            })
        }
        return parsedFriends;
    }

    /**
     * Render component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        const friendItems = this.friendList();

        return (
            <div style={{maxWidth: '800px', margin: '40px auto'}}>
                {(friendItems && friendItems.length !== 0) ? 
                    (<div>
                        <div className='profile__title'>
                            Your friends
                        </div>
                        <List>
                            {friendItems}
                        </List>
                        <div style={{ height: '24px' }}></div>
                    </div>) : ''}
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
    };
}

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state, ownProps) => {
    const { uid } = state.authorize;

    return {
        uid,
        friends: state.friends ? state.friends : {},
    };
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(YourFriends)