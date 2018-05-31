import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab } from 'material-ui/Tabs';
import { grey50 } from 'material-ui/styles/colors';
import { push } from 'react-router-redux';

// - Import app components
import FindPeople from 'FindPeople';
import Following from 'Following';
import Followers from 'Followers';
import YourCircles from 'YourCircles';

// - Import actions
import * as circleActions from 'circleActions';
import * as globalActions from 'globalActions';

export class People extends Component {

    componentWillMount() {
        // Tab
        switch (this.props.match.params) {
            case undefined:
            case '':
                this.props.setHeaderTitle('People')
                break;
            case 'circles':
                this.props.setHeaderTitle('Circles')
                break;
            case 'followers':
                this.props.setHeaderTitle('Followers')
                break;
            default:
                break;
        }
    }

    /**
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        const styles = {
            people: {
                margin: '0 auto',
                width: '90%'
            },
            headline: {
                fontSize: 24,
                paddingTop: 16,
                marginBottom: 12,
                fontWeight: 400
            },
            slide: {
                padding: 10
            }
        };

        const { circlesLoaded } = this.props;
        let tabIndex = 0;

        // Tab.
        switch (this.props.match.params) {
            case undefined:
            case '':
                tabIndex = 0
                break;
            case 'circles':
                tabIndex = 1
                break;
            case 'followers':
                tabIndex = 2
                break;
            default:
                break;
        }

        return (
            <div style={styles.people}>
                <Tabs inkBarStyle={{ backgroundColor: grey50 }} initialSelectedIndex={tabIndex} >
                    <Tab label="Find People" onActive={() => {
                        this.props.goTo('/people')
                        this.props.setHeaderTitle('People')
                    }} >
                        {circlesLoaded ? <FindPeople /> : ''}
                    </Tab>
                    <Tab label="Following" onActive={() => {
                        this.props.goTo('/people/circles')
                        this.props.setHeaderTitle('Circles')
                    }} >
                        {circlesLoaded ? <Following /> : ''}
                        {circlesLoaded ? <YourCircles /> : ''}
                    </Tab>
                    <Tab label="Followers" onActive={() => {
                        this.props.goTo('/people/followers')
                        this.props.setHeaderTitle('Followers')
                    }}>
                        {circlesLoaded ? <Followers /> : ''}
                    </Tab>
                </Tabs>
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
        setHeaderTitle: (title) => dispatch(globalActions.setHeaderTitle(title))


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
        uid: state.authorize.uid,
        circlesLoaded: state.circle.loaded



    }
}

// - Connect component to redux store
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(People))