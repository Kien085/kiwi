import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { blue500 } from 'material-ui/styles/colors';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import SvgHome from 'material-ui/svg-icons/action/home';
import SvgPeople from 'material-ui/svg-icons/social/people';
import EventListener, { withOptions } from 'react-event-listener';

// - Import components
import UserAvatar from 'UserAvatar';
import Notify from 'Notify';

// - Import actions
import * as globalActions from 'globalActions';
import * as authorizeActions from 'authorizeActions';

export class HomeHeader extends Component {

    /**
     * Component constructor
     * @param  {object} props is an object properties of component
     */
    constructor(props) {
        super(props);

        this.state = {
            // User avatar popover is open if true
            openAvatarMenu: false,

            // Show header title or not (true/false)
            showTitle: true,
            
            // If true notification menu will be open
            openNotifyMenu: false
        };
    }

    /**
     * Handle close notification menu 
     * 
     * @memberof HomeHeader
     */
    handleCloseNotify = () => {
        this.setState({ openNotifyMenu: false });
    }


    // On click toggle sidebar
    onToggleSidebar = () => {
        if (this.props.sidebarStatus) {
            this.props.sidebar(false);
        } 
        
        else {
            this.props.sidebar(true);
        }
    }

    /**
     * Handle notification touch 
     * 
     * @memberof HomeHeader
     */
    handleNotifyTouchTap = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            openNotifyMenu: true,
            anchorEl: event.currentTarget
        });
    }

    /**
     * Handle touch on user avatar for popover
     * 
     * @memberof HomeHeader
     */
    handleAvatarTouchTap = (event) => {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            openAvatarMenu: true,
            anchorEl: event.currentTarget
        });
    }

    /**
     * Handle logout user
     * 
     * @memberof HomeHeader
     */
    handleLogout = () => {
        this.props.logout();
    }

    /**
     * Handle close popover
     * 
     * @memberof HomeHeader
     */
    handleRequestClose = () => {
        this.setState({ openAvatarMenu: false });
    };


    /**
     * Handle resize event for window to manipulate home header status
     * @param  {event} evt is the event is passed by winodw resize event
     */
    handleResize = (evt) => {
        const width = window.innerWidth;

        if (width >= 600 && !this.state.showTitle) {
            this.setState({ showTitle: true });
        }

        else if (width < 600 && this.state.showTitle) {
            this.setState({ showTitle: false });
        }
    }

    componentDidMount = () => {
        this.handleResize();
    }

    render() {
        const styles = {
            toolbarStyle: {
                background: 'linear-gradient(45deg, #090979, #00d4ff)',
                transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
                boxSizing: "border-box",
                fontFamily: "Roboto, sans-serif",
                position: "fixed",
                zIndex: "1101",
                width: "100%",
                top: "0px",
                boxShadow: '0 1px 8px rgba(0,0,0,.3)'
            },
            avatarStyle: {
                margin: 5,
                cursor: 'pointer'
            }
        };

        return (
            <Toolbar style={styles.toolbarStyle}>
                <EventListener
                    target="window"
                    onResize={this.handleResize}
                    onKeyUp={this.handleKeyUp}
                />

                {/* Left side */}
                <ToolbarGroup firstChild={true}>
                    <div style={{ marginLeft: '30px', marginRight: '30px' }}>
                        <FlatButton onClick={this.props.homePage}>
                            <svg style={{position: "absolute", top: "7px", left: "0px"}} width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M4.102 0h11.796c1.426 0 1.943.149 2.465.427.521.28.93.689 1.21 1.21.278.522.427 1.039.427 2.465v11.796c0 1.426-.149 1.943-.427 2.465-.28.521-.689.93-1.21 1.21-.522.278-1.039.427-2.465.427H4.102c-1.426 0-1.943-.149-2.465-.427a2.908 2.908 0 0 1-1.21-1.21C.15 17.841 0 17.324 0 15.898V4.102C0 2.676.149 2.16.427 1.637c.28-.521.689-.93 1.21-1.21C2.159.15 2.676 0 4.102 0zm-.518 2.813c-.428 0-.584.044-.74.128a.872.872 0 0 0-.363.363c-.084.156-.128.311-.128.74v1.913c0 .428.044.583.128.74.084.156.207.279.363.362.156.084.312.128.74.128H5.24c.428 0 .583-.044.74-.128a.872.872 0 0 0 .362-.363c.084-.156.129-.311.129-.74V4.044c0-.428-.045-.583-.129-.74a.872.872 0 0 0-.363-.362c-.156-.084-.311-.128-.74-.128H3.585zm4.767 2.5c-.142 0-.194.014-.246.042a.29.29 0 0 0-.121.121c-.028.052-.043.104-.043.247v.43c0 .142.015.194.043.246a.29.29 0 0 0 .12.12c.053.029.105.043.247.043h4.474c.143 0 .194-.014.247-.042a.29.29 0 0 0 .12-.121c.028-.052.043-.104.043-.247v-.43c0-.142-.015-.194-.042-.246a.29.29 0 0 0-.121-.12c-.053-.029-.104-.043-.247-.043H8.351zm0-2.188c-.142 0-.194.015-.246.043a.29.29 0 0 0-.121.12c-.028.053-.043.105-.043.247v.43c0 .142.015.194.043.246a.29.29 0 0 0 .12.121c.053.028.105.043.247.043h8.592c.142 0 .194-.015.246-.043a.29.29 0 0 0 .121-.12c.028-.053.043-.105.043-.247v-.43c0-.142-.015-.194-.043-.246a.29.29 0 0 0-.12-.121c-.053-.028-.105-.043-.247-.043H8.35zM3.584 9.063c-.428 0-.584.044-.74.128a.872.872 0 0 0-.363.363c-.084.156-.128.311-.128.74v6.288c0 .428.044.583.128.74.084.156.207.279.363.362.156.084.312.128.74.128h12.832c.428 0 .584-.044.74-.128a.872.872 0 0 0 .363-.363c.084-.156.128-.311.128-.74v-6.288c0-.428-.044-.583-.128-.74a.872.872 0 0 0-.363-.362c-.156-.084-.312-.129-.74-.129H3.584z" fill="#fff"/></svg>
                            <div style={{display: "inline-block", color: '#fff', fontWeight: "500", fontSize: "14px", paddingLeft: "12px"}}>Feed</div>
                        </FlatButton>
                    </div>
                    <div>
                        <FlatButton onClick={this.props.people}>
                            <SvgPeople  style={{color: "#fff", position: "absolute", top: "4px", left: "0px"}}/>
                            <div style={{display: "inline-block", color: '#fff', fontWeight: "500", fontSize: "14px", paddingLeft: "24px"}}>People</div>
                        </FlatButton>
                    </div>
                </ToolbarGroup>
                <ToolbarGroup lastChild={true}>
                    <div className="homeHeader__right">
                        <IconButton tooltip="Notifications" onTouchTap={this.handleNotifyTouchTap}>
                            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M8 20c1.1 0 2-.9 2-2H6a2 2 0 0 0 2 2zm6-6V9c0-3.07-1.64-5.64-4.5-6.32V2C9.5 1.17 8.83.5 8 .5S6.5 1.17 6.5 2v.68C3.63 3.36 2 5.92 2 9v5l-2 2v1h16v-1l-2-2z" fill="rgba(255, 255, 255, 0.87)"/>
                                {this.props.notifyCount > 0 && 
                                    <circle cx="14" cy="6" r="6" fill="red"></circle>
                                }
                            </svg>
                        </IconButton>

                        <Notify open={this.state.openNotifyMenu} anchorEl={this.state.anchorEl} onRequestClose={this.handleCloseNotify} />

                        {/* User avatar*/}
                        <UserAvatar
                            onTouchTap={this.handleAvatarTouchTap}
                            fullName={this.props.fullName}
                            fileName={this.props.avatar}
                            size={32}
                            style={styles.avatarStyle}
                        />
                        <Popover
                            open={this.state.openAvatarMenu}
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                            onRequestClose={this.handleRequestClose}
                        >
                            <Menu>
                                <NavLink to={`/${this.props.uid}`}><MenuItem primaryText="Profile" style={{ color: blue500 }} /></NavLink>
                                <NavLink to='/settings'><MenuItem primaryText="Settings" style={{ color: "rgb(117, 117, 117)" }} /></NavLink>
                                <MenuItem primaryText="Log Out" style={{ color: 'red' }} onClick={this.handleLogout.bind(this)} />
                            </Menu>
                        </Popover>
                    </div>
                </ToolbarGroup>
            </Toolbar>
        )
    }
}

// - Map dispatch to props
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        logout: () => {
            dispatch(authorizeActions.dbLogout());
        },
        homePage: () => {
            dispatch(push("/"));
        },
        people: () => {
            dispatch(push("/people"));
        }
    }
}

// - Map state to props
const mapStateToProps = (state, ownProps) => {

    let notifyCount = state.notify.userNotifies
        ? Object
            .keys(state.notify.userNotifies)
            .filter((key) => !state.notify.userNotifies[key].isSeen).length
        : 0
    return {
        avatar: state.user.info && state.user.info[state.authorize.uid] ? state.user.info[state.authorize.uid].avatar : '',
        fullName: state.user.info && state.user.info[state.authorize.uid] ? state.user.info[state.authorize.uid].fullName : '',
        title: state.global.headerTitle,
        notifyCount
    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
