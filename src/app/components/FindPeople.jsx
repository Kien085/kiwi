import React, { Component } from 'react';
import { connect } from 'react-redux';

// - Import app components
import UserBoxList from './UserBoxList';

// - Import actions
import * as userActions from '../actions/userActions';

export class FindPeople extends Component {
    componentWillMount() {
        this.props.loadPeople();
    }

    /**
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        return (
            <div>
                {this.props.peopleInfo && Object.keys(this.props.peopleInfo).length !== 0 ?  
                    (<div>
                        <div className='profile__title'>
                            Suggestions for you
                        </div>
                        <UserBoxList users={this.props.peopleInfo}/>
                        <div style={{ height: '24px' }}></div>
                    </div>) :
                    
                    (<div className='g__title-center'>
                        Nothing to show! :(
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
        loadPeople: () => dispatch(userActions.dbGetPeopleInfo())
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
        peopleInfo: state.user.info
    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(FindPeople)