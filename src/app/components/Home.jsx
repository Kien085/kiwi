import React, { Component } from 'react';
import _ from 'lodash';
import { Route, Switch, withRouter, Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import SvgArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';

// - Import app components
import Sidebar from 'Sidebar';
import Blog from 'Blog';
import HomeHeader from 'HomeHeader';
import SidebarContent from 'SidebarContent';
import SidebarMain from 'SidebarMain';
import Profile from 'Profile';
import PostPage from 'PostPage';
import People from 'People';
import Messenger from 'Messenger';

// - Import API
import CircleAPI from 'CircleAPI';

// - Import actions
import * as globalActions from 'globalActions';

export class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sidebarOpen: () => _,
            sidebarStatus: true,
            sidebaOverlay: false
        };
    }

    // handle close sidebar
    handleCloseSidebar = () => {
        this.state.sidebarOpen(false, 'overlay');
    }

    /**
     * Change sidebar overlay status
     * @param  {boolean} status if is true, the sidebar is on overlay status
     */
    sidebarOverlay = (status) => {
        this.setState({ sidebarOverlay: status });
    }


    /**
     * Pass function to change sidebar status
     * @param  {boolean} open  is a function callback to change sidebar status out of sidebar component
     */
    sidebar = (open) => {
        this.setState({ sidebarOpen: open });
    }


    /**
     * Change sidebar status if is open or not
     * @param  {boolean} status is true, if the sidebar is open
     */
    sidebarStatus = (status) => {
        this.setState({ sidebarStatus: status });
    }

    /**
     * Render DOM component
     * 
     * @returns DOM
     * 
     * @memberof Home
     */
    render() {
        return (
            <div id="home">
                <HomeHeader sidebar={this.state.sidebarOpen} sidebarStatus={this.state.sidebarStatus} uid={this.props.uid} />
                <Sidebar overlay={this.sidebarOverlay} open={this.sidebar} status={this.sidebarStatus}>
                    {/* <SidebarContent>
                        <Menu style={{ color: "rgb(117, 117, 117)", width: '210px' }}>
                            {this.state.sidebarOverlay
                                ? <div><MenuItem onClick={this.handleCloseSidebar} primaryText={<span style={{ color: "rgb(117, 117, 117)" }} className="sidebar__title">Green</span>} rightIcon={<SvgArrowLeft viewBox="0 3 24 24" style={{ color: "#fff", marginLeft: "15px", width: "32px", height: "32px", cursor: "pointer" }} />} /><Divider /></div>
                                : ""
                            }
                        </Menu>
                    </SidebarContent> */}

                    <SidebarMain>
                        <Switch>
                            <Route path="/people/:tab?" render={() => {
                                return (
                                    this.props.authed
                                        ? <People />
                                        : <Redirect to="/login" />
                                )
                            }} />
                            <Route path="/tag/:tag" render={({ match }) => {

                                return (
                                    this.props.authed
                                        ? <div className="blog"><Blog displayWriting={false} homeTitle={`#${match.params.tag}`} posts={this.props.mergedPosts} adSky={true} adPost={true}/></div>
                                        : <Redirect to="/login" />
                                )
                            }} />
                            <Route path="/:userId/posts/:postId/:tag?" component={PostPage} />
                            <Route path="/:userId" component={Profile} />

                            <Route path="/" render={() => {

                                return (
                                    this.props.authed
                                        ? <div className="blog"><Blog homeTitle='Home' posts={this.props.mergedPosts} displayWriting={true} adSky={true} adPost={true}/></div>
                                        : <Redirect to="/login" />
                                )
                            }} />
                        </Switch>
                    </SidebarMain>
                </Sidebar>


                <Messenger uid={this.props.uid}/>
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

    let mergedPosts = {}
    const circles = state.circle ? (state.circle.userCircles[uid] || {}) : {}
    const followingUsers = CircleAPI.getFollowingUsers(circles)
    const posts = state.post.userPosts ? state.post.userPosts[state.authorize.uid] : {}
    Object.keys(followingUsers).forEach((userId) => {
        let newPosts = state.post.userPosts ? state.post.userPosts[userId] : {}
        _.merge(mergedPosts, newPosts)
    })
    _.merge(mergedPosts, posts)
    return {
        authed: state.authorize.authed,
        mainStyle: state.global.sidebarMainStyle,
        mergedPosts
    }
}

// - Connect component to redux store
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))
