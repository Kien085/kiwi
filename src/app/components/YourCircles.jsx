import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'material-ui/List';

// - Import app components
import Circle from './Circle';

export class YourCircles extends Component {

    circleList = () => {
        const { circles, uid } = this.props;
        let parsedCircles = []

        if (circles) {
            Object.keys(circles).map((key, index) => {
                if (key.trim() !== '-Followers')
                    parsedCircles.push(<Circle key={key} circle={circles[key]} id={key} uid={uid} />)
            })
        }

        return parsedCircles;
    }

    /**
     * Render component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        const circleItems = this.circleList();

        return (
            <div style={{maxWidth: '800px', margin: '40px auto'}}>
                {(circleItems && circleItems.length !== 0) ? 
                    (<div>
                        <div className='profile__title'>
                            Your circles
                        </div>
                        <List>
                            {circleItems}
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
    return {}
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
        uid,
        circles: state.circle ? state.circle.userCircles[uid] : {},
    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(YourCircles)