import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { push } from 'react-router-redux';
import moment from 'moment';
import Linkify from 'react-linkify';

// - Material UI
import { CardActions, CardHeader, CardMedia, CardText } from 'material-ui/Card';
import Snackbar from 'material-ui/Snackbar';
import SvgLink from 'material-ui/svg-icons/content/link';
import SvgFavorite from 'material-ui/svg-icons/action/favorite';
import SvgFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import Checkbox from 'material-ui/Checkbox';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import reactStringReplace from 'react-string-replace';

// - Import app components
import CommentGroup from 'CommentGroup';
import PostWrite from 'PostWrite';
import Img from 'Img';
import IconButtonElement from 'IconButtonElement';
import UserAvatar from 'UserAvatar';

// - Import actions
import * as voteActions from 'voteActions';
import * as postActions from 'postActions';
import * as globalActions from 'globalActions';

export class Post extends Component {
    /**
     * Component constructor
     * @param  {object} props is an object properties of component
     */
    constructor(props) {
        super(props);

        this.state = {
            // Post text
            text: this.props.body,

            // It's true if whole the text post is visible
            readMoreState: false,

            // Handle open comment from parent component
            openComments: false,

            // If it's true, share dialog will be open
            shareOpen: false,

            // If it's true comment will be disabled on post
            disableComments: this.props.disableComments,

            // If it's true share will be disabled on post
            disableSharing: this.props.disableSharing,

            // Title of share post
            shareTitle: 'Share On',

            // If it's true, post link will be visible in share post dialog
            openCopyLink: false,

            // If it's true, post write will be open
            openPostWrite: false
        };
    }


    /**
     * Toggle on show/hide comment
     * @param  {event} evt passed by clicking on comment slide show
     */
    handleOpenComments = (evt) => {
        this.setState({ openComments: !this.state.openComments });
    }

    /**
     * Open post write
     * 
     * @memberof Blog
     */
    handleOpenPostWrite = () => {
        this.setState({ openPostWrite: true });
    }

    /**
     * Close post write
     * 
     * @memberof Blog
     */
    handleClosePostWrite = () => {
        this.setState({ openPostWrite: false });
    }

    /**
     * Delete a post
     * 
     * @memberof Post
     */
    handleDelete = () => {
        this.props.delete(this.props.id);
    }

    /**
     * Show copy link 
     * 
     * @memberof Post
     */
    handleCopyLink = () => {
        this.setState({
            openCopyLink: true,
            shareTitle: 'Copy Link'
        });
    }

    /**
     * Open share post
     * 
     * @memberof Post
     */
    handleOpenShare = (event) => {
        this.setState({ shareOpen: true });

        const text = `${location.origin}/${this.props.ownerUserId}/posts/${this.props.id}`;

        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);
        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }

    /**
     * Close share post
     * 
     * @memberof Post
     */
    handleCloseShare = () => {
        this.setState({
            shareOpen: false,
            shareTitle: 'Share On',
            openCopyLink: false
        });
    }

    /**
     * Handle vote on a post
     * 
     * @memberof Post
     */
    handleVote = () => {
        if (this.props.userVoteStatus) {
            this.props.unvote();
        }

        else {
            this.props.vote();
        }
    }

    /**
     * Set open comment group function on state which passed by CommentGroup component
     * @param  {function} open the function to open comment list
     */
    getOpenCommentGroup = (open) => {
        this.setState({ openCommentGroup: open });
    }

    /**
     * Handle read more event
     * @param  {event} evt  is the event passed by click on read more
     */
    handleReadMore(evt) {
        this.setState({ readMoreState: !this.state.readMoreState });
    }

    /**
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        /**
         * DOM styles
         *
         * @memberof Post
         */
        const styles = {
            counter: {
                lineHeight: '36px',
                color: '#757575',
                fontSize: '12px'
            },
            postBody: {
                wordWrap: "break-word"
            },
            dialog: {
                width: '',
                maxWidth: '530px',
                borderRadius: "4px"
            },
            rightIconMenu: {
                position: 'absolute',
                right: 18,
                top: 8
            }
        };

        const RightIconMenu = () => (
            <IconMenu iconButtonElement={IconButtonElement} style={{ display: "block", position: "absolute", top: "0px", right: "4px", MsTransform: 'rotate(90deg)', WebkitTransform: 'rotate(90deg)', MozTransform: 'rotate(90deg)', OTransform: 'rotate(90deg)', transform: 'rotate(90deg)' }}>
                <MenuItem primaryText="Edit" onClick={this.handleOpenPostWrite} />
                <MenuItem primaryText="Delete" onClick={this.handleDelete} />
                <MenuItem primaryText={this.props.disableComments ? "Enable comments" : "Disable comments"} onClick={() => this.props.toggleDisableComments(!this.props.disableComments)} />
                <MenuItem primaryText={this.props.disableSharing ? "Enable sharing" : "Disable sharing"} onClick={() => this.props.toggleSharingComments(!this.props.disableSharing)} />
            </IconMenu>
        );

        const { ownerUserId, setHomeTitle, goTo, ownerDisplayName, creationDate, avatar, fullName, isPostOwner, image, body } = this.props;

        return (
            <div style={{ backgroundColor: '#fff', border: '1px solid #dddfe2', borderRadius: '7px' }}>
                <CardHeader
                    title={
                        <NavLink title="User is secure :)" style={{display: 'flex'}} to={`/${ownerUserId}`}>
                            <div>{ownerDisplayName}</div>
                            <svg style={{marginLeft: '7px', marginTop: '1px'}} width="11" height="15" xmlns="http://www.w3.org/2000/svg"><path d="M9.323 6.705h.99c.38 0 .687.32.687.715v6.866a.701.701 0 0 1-.688.714H.688A.701.701 0 0 1 0 14.286V7.42c0-.395.308-.715.688-.715h.989V3.86h1.475v2.845h4.696V3.86h1.475v2.845zm0-2.845H1.677C1.677 1.728 3.389 0 5.5 0c2.111 0 3.823 1.728 3.823 3.86zm-1.475 0A2.359 2.359 0 0 0 5.5 1.49a2.359 2.359 0 0 0-2.348 2.37h4.696z" fill="#7ED321"/></svg>
                        </NavLink>}
                    subtitle={moment.unix(creationDate).fromNow()}
                    avatar={<NavLink to={`/${ownerUserId}`}><UserAvatar fullName={fullName} fileName={avatar} size={36} /></NavLink>}
                >
                    {isPostOwner ? (<div style={styles.rightIconMenu}><RightIconMenu /></div>) : ''}
                </CardHeader>

                {body ?
                    <CardText style={styles.postBody}>
                        <Linkify properties={{ target: '_blank', style: { color: 'blue' } }}>
                            {reactStringReplace(body, /#(\w+)/g, (match, i) => (
                                <NavLink
                                    style={{ color: '#3072f6', backgroundColor: '#f1f8ff', borderRadius: '5px', padding: '4px' }}
                                    key={match + i}
                                    to={`/tag/${match}`}
                                    onClick={evt => {
                                        evt.preventDefault()
                                        goTo(`/tag/${match}`)
                                        setHomeTitle(`#${match}`)
                                    }}
                                >
                                    #{match}
                                </NavLink>
                            ))}
                        </Linkify>
                    </CardText> : ''
                }

                {image ? (
                    <CardMedia>
                        <Img fileName={image} />
                    </CardMedia>) : ''}

                <CardActions>
                    <div style={{ margin: "16px 8px", border: '0px', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex' }}>
                            <div className='g__circle' onClick={this.handleVote}>
                                <Checkbox
                                    checkedIcon={<SvgFavorite style={{ fill: '#EC425C' }} />}
                                    uncheckedIcon={<SvgFavoriteBorder style={{ fill: '#757575' }} />}
                                    defaultChecked={this.props.userVoteStatus}
                                    style={{ transform: 'translate(6px, 6px)' }}
                                />
                            </div>
                            <div style={styles.counter}> {this.props.voteCount > 0 ? 
                                this.props.voteCount > 1 ? 
                                    this.props.voteCount + " people likes this" : this.props.voteCount + " person likes this" : ''} </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            {!this.props.disableComments ? (<div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={styles.counter}>
                                    {this.props.commentCount > 1 ? this.props.commentCount + " comments" : 
                                        this.props.commentCount === 1 ? 
                                            this.props.commentCount + " comment" : ''}
                                </div>
                                <div className='g__circle' onClick={this.handleOpenComments} style={{ display: 'flex'}}>
                                    <Checkbox
                                        checkedIcon={
                                            <svg style={{ marginTop: '2px', marginLeft: "2px" }} width="20" height="21" xmlns="http://www.w3.org/2000/svg"><path d="M11.87 16l-7.435 4.415A.288.288 0 0 1 4 20.168V16h-.493c-1.22 0-1.661-.127-2.107-.365A2.486 2.486 0 0 1 .365 14.6C.127 14.154 0 13.712 0 12.493V3.507C0 2.287.127 1.846.365 1.4A2.486 2.486 0 0 1 1.4.365C1.846.127 2.288 0 3.507 0h12.986c1.22 0 1.661.127 2.107.365.446.239.796.589 1.035 1.035.238.446.365.888.365 2.107v8.986c0 1.22-.127 1.661-.365 2.107a2.486 2.486 0 0 1-1.035 1.035c-.446.238-.888.365-2.107.365h-4.624zM3.753 2c-.61 0-.831.063-1.054.183-.223.119-.398.294-.517.517-.12.223-.183.444-.183 1.054v8.492c0 .61.063.831.183 1.054.119.223.294.398.517.517.223.12.444.183 1.054.183h12.492c.61 0 .831-.063 1.054-.183.223-.119.398-.294.517-.517.12-.223.183-.444.183-1.054V3.754c0-.61-.063-.831-.183-1.054a1.243 1.243 0 0 0-.517-.517c-.223-.12-.444-.183-1.054-.183H3.754zm6.97 12H6v3.104L10.724 14z" fill={(this.props.commentCount > 0) ? '#4E7FF7' : '#757575'}/>
                                                {(this.props.commentCount > 0) && <rect x="4" y="4" width="12" height="2" fill='#4E7FF7'></rect>}
                                                {(this.props.commentCount > 0) && <rect x="4" y="7" width="12" height="2" fill='#4E7FF7'></rect>}
                                                {(this.props.commentCount > 0) && <rect x="4" y="10" width="12" height="2" fill='#4E7FF7'></rect>}
                                            </svg>
                                        }
                                        uncheckedIcon={
                                            <svg style={{ marginTop: '2px', marginLeft: "2px" }} width="20" height="21" xmlns="http://www.w3.org/2000/svg"><path d="M11.87 16l-7.435 4.415A.288.288 0 0 1 4 20.168V16h-.493c-1.22 0-1.661-.127-2.107-.365A2.486 2.486 0 0 1 .365 14.6C.127 14.154 0 13.712 0 12.493V3.507C0 2.287.127 1.846.365 1.4A2.486 2.486 0 0 1 1.4.365C1.846.127 2.288 0 3.507 0h12.986c1.22 0 1.661.127 2.107.365.446.239.796.589 1.035 1.035.238.446.365.888.365 2.107v8.986c0 1.22-.127 1.661-.365 2.107a2.486 2.486 0 0 1-1.035 1.035c-.446.238-.888.365-2.107.365h-4.624zM3.753 2c-.61 0-.831.063-1.054.183-.223.119-.398.294-.517.517-.12.223-.183.444-.183 1.054v8.492c0 .61.063.831.183 1.054.119.223.294.398.517.517.223.12.444.183 1.054.183h12.492c.61 0 .831-.063 1.054-.183.223-.119.398-.294.517-.517.12-.223.183-.444.183-1.054V3.754c0-.61-.063-.831-.183-1.054a1.243 1.243 0 0 0-.517-.517c-.223-.12-.444-.183-1.054-.183H3.754zm6.97 12H6v3.104L10.724 14z" fill={(this.props.commentCount > 0) ? '#4E7FF7' : '#757575'}/>
                                                {(this.props.commentCount > 0) && <rect x="4" y="4" width="12" height="2" fill='#4E7FF7'></rect>}
                                                {(this.props.commentCount > 0) && <rect x="4" y="7" width="12" height="2" fill='#4E7FF7'></rect>}
                                                {(this.props.commentCount > 0) && <rect x="4" y="10" width="12" height="2" fill='#4E7FF7'></rect>}
                                            </svg>
                                        }
                                        defaultChecked={this.props.commentCount > 0}
                                        style={{ transform: 'translate(6px, 6px)' }}
                                    />
                                </div>
                            </div>) : ''}
                            {!this.props.disableSharing ?
                                <div className='g__circle' onClick={this.handleOpenShare} style={{ display: 'flex' }}>
                                    <Checkbox
                                        checkedIcon={<svg style={{marginTop: '2px', marginLeft: '1px'}} width="20" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M19.7 6.2l-6.6-6c-.5-.5-1.1 0-1.1.8v3C7.3 4 3.3 6.9 1.4 10.8.7 12.1.3 13.5 0 14.9c-.2 1 1.3 1.5 1.9.6C4.1 12 7.8 9.7 12 9.7V13c0 .8.6 1.3 1.1.8l6.6-6c.4-.4.4-1.2 0-1.6z" fill="#757575"/></svg>}
                                        uncheckedIcon={<svg style={{marginTop: '2px', marginLeft: '1px'}} width="20" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M19.7 6.2l-6.6-6c-.5-.5-1.1 0-1.1.8v3C7.3 4 3.3 6.9 1.4 10.8.7 12.1.3 13.5 0 14.9c-.2 1 1.3 1.5 1.9.6C4.1 12 7.8 9.7 12 9.7V13c0 .8.6 1.3 1.1.8l6.6-6c.4-.4.4-1.2 0-1.6z" fill="#757575"/></svg>}
                                        style={{ transform: 'translate(6px, 6px)' }}
                                    />
                                </div>
                                : ''}
                        </div>
                    </div>
                </CardActions>

                <CommentGroup open={this.state.openComments} ownerPostUserId={this.props.ownerUserId} onToggleRequest={this.handleOpenComments} isPostOwner={this.props.isPostOwner} disableComments={this.props.disableComments} postId={this.props.id} />

                <Snackbar
                    open={this.state.shareOpen}
                    message={"Link to Post copied!"}
                    autoHideDuration={1000}
                    style={{ left: '1%', transform: 'none' }}
                />

                <PostWrite
                    open={this.state.openPostWrite}
                    onRequestClose={this.handleClosePostWrite}
                    edit={true}
                    text={this.props.body}
                    image={this.props.image ? this.props.image : ''}
                    id={this.props.id}
                    disableComments={this.props.disableComments}
                    disableSharing={this.props.disableSharing}
                />
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
        vote: () => dispatch(voteActions.dbAddVote(ownProps.id, ownProps.ownerUserId)),
        unvote: () => dispatch(voteActions.dbDeleteVote(ownProps.id)),
        delete: (id) => dispatch(postActions.dbDeletePost(id)),
        toggleDisableComments: (status) => dispatch(postActions.dbUpdatePost({ id: ownProps.id, disableComments: status }, _ => _)),
        toggleSharingComments: (status) => dispatch(postActions.dbUpdatePost({ id: ownProps.id, disableSharing: status }, _ => _)),
        goTo: (url) => dispatch(push(url)),
        setHomeTitle: (title) => dispatch(globalActions.setHeaderTitle(title || ''))


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
    let votes = state.vote.postVotes[ownProps.id]
    const post = (state.post.userPosts[uid] ? Object.keys(state.post.userPosts[uid]).filter((key) => { return ownProps.id === key }).length : 0)

    return {
        avatar: state.user.info && state.user.info[ownProps.ownerUserId] ? state.user.info[ownProps.ownerUserId].avatar || '' : '',
        fullName: state.user.info && state.user.info[ownProps.ownerUserId] ? state.user.info[ownProps.ownerUserId].fullName || '' : '',
        commentCount: state.comment.postComments[ownProps.id] ? Object.keys(state.comment.postComments[ownProps.id]).length : 0,
        voteCount: state.vote.postVotes[ownProps.id] ? Object.keys(state.vote.postVotes[ownProps.id]).length : 0,
        userVoteStatus: votes && Object.keys(votes).filter((key) => votes[key].userId === state.authorize.uid)[0] ? true : false,
        isPostOwner: post > 0
    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(Post)
