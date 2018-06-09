import React, { Component } from 'react';
import { connect } from 'react-redux';
import { grey400 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import EventListener, { withOptions } from 'react-event-listener';
import { Parallax, Background } from 'react-parallax';

// - Import app components
import ImgCover from './ImgCover';
import EditProfile from './EditProfile';
import UserAvatar from './UserAvatar';

// - Import actions
import * as globalActions from '../actions/globalActions';
import * as userActions from '../actions/userActions';

export class ProfileHead extends Component {

    /**
     * Component constructor
     * @param  {object} props is an object properties of component
     */
    constructor(props) {
        super(props);

        this.state = {
            // If it's true , the window is in small size
            isSmall: false
        };
    }

    /**
      * Handle resize event for window to change sidebar status
      * @param  {event} evt is the event is passed by winodw resize event
      */
    handleResize = (evt) => {
        const width = window.innerWidth;

        if (width > 900) {
            this.setState({ isSmall: false });
        }

        else {
            this.setState({ isSmall: true });
        }
    }

    componentDidMount = () => {
        this.handleResize();
    }

    /**
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        const styles = {
            avatar: {
                border: '2px solid rgb(255, 255, 255)'
            },
            iconButton: {
                fill: 'rgb(255, 255, 255)',
                height: '24px',
                width: '24px',
            },
            iconButtonSmall: {
                fill: 'rgb(0, 0, 0)',
                height: '24px',
                width: '24px',
            },
            editButton: {
                marginLeft: '20px'
            },
            editButtonSmall: {
                marginLeft: '20px',
                color: 'white',
                fill: 'blue'
            }
        };

        const iconButtonElement = (
            <IconButton style={this.state.isSmall ? styles.iconButtonSmall : styles.iconButton} iconStyle={this.state.isSmall ? styles.iconButtonSmall : styles.iconButton} touch={true}>
                <MoreVertIcon color={grey400} viewBox='10 0 24 24' />
            </IconButton>
        );

        const RightIconMenu = () => (
            <IconMenu iconButtonElement={iconButtonElement}>
                <MenuItem style={{ fontSize: "14px" }}>Reply</MenuItem>
                <MenuItem style={{ fontSize: "14px" }}>Edit</MenuItem>
                <MenuItem style={{ fontSize: "14px" }}>Delete</MenuItem>
            </IconMenu>
        );

        return (
            <div>
                <Parallax strength={500} className="profile__parallax" bgStyle={{ position: 'relative' }}>
                    <Background>
                        <ImgCover width='100%' height='510px' borderRadius='2px' 
                        fileName={this.props.banner || "https://firebasestorage.googleapis.com/v0/b/open-social-33d92.appspot.com/o/images%2F751145a1-9488-46fd-a97e-04018665a6d3.JPG?alt=media&token=1a1d5e21-5101-450e-9054-ea4a20e06c57"} />
                    </Background>

                </Parallax>
                <div className={this.state.isSmall ? 'profile__head-info-s' : 'profile__head-info'}>
                    <EventListener
                        target="window"
                        onResize={this.handleResize}
                    />
                    <div className='left'>
                        {/* User avatar*/}
                        <div style={{ display: 'flex', justifyContent: 'center' }}><UserAvatar fullName={this.props.fullName} fileName={this.props.avatar} size={60} style={styles.avatar} /></div>
                        <div className='info'>
                            <div className='fullName'>
                                {this.props.fullName}
                            </div>
                            {/*<div className='followers'>
                                {this.props.followerCount} Followers
                            </div>*/}
                        </div>
                    </div>
                    <div className='right'>
                        {this.props.isAuthedUser ? (<div style={this.state.isSmall ? styles.editButtonSmall : styles.editButton}><RaisedButton label="EDIT PROFILE" onClick={this.props.openEditor} /></div>) : ''}
                    </div>
                </div>
                {this.props.isAuthedUser ? (<EditProfile
                    onRequestClose={this.handleCloseEditor}
                    avatar={this.props.avatar}
                    banner={this.props.banner}
                    fullName={this.props.fullName}
                />): ''}
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
        openEditor: () => dispatch(userActions.openEditProfile())
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
export default connect(mapStateToProps, mapDispatchToProps)(ProfileHead)