import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import { grey400, grey800, darkBlack, lightBlack } from 'material-ui/styles/colors';
import SvgCamera from 'material-ui/svg-icons/image/photo-camera';
import { List, ListItem } from 'material-ui/List';

// - Import app components
import Post from 'Post';
import PostWrite from 'PostWrite';
import UserAvatar from 'UserAvatar';

// - Import API
import * as AuthAPI from 'AuthAPI';
import * as PostAPI from 'PostAPI';

// - Import actions
import * as globalActions from 'globalActions';
import * as userActions from 'userActions';
import { AdPost } from 'AdPost';
import { AdSky } from 'AdSky';

export class Blog extends Component {
    /**
     * Component constructor
     * @param  {object} props is an object properties of component
     */
    constructor(props) {
        super(props);

        this.state = {
            // It's true if we want to have two column of posts.
            divided: false,

            // If it's true comment will be disabled on post.
            disableComments: this.props.disableComments,

            // If it's true share will be disabled on post.
            disableSharing: this.props.disableSharing,

            // If it's true, post write will be open.
            openPostWrite: false,

            // The title of home header.
            homeTitle: '',

            // adSky: true,

            // adPost: true,

            // displaySelfAd: true,

            // Which ads to display
            rand : Math.floor(Math.random() * 4),
            rand2 : Math.floor(Math.random() * 4),
            rand3 : Math.floor(Math.random() * 4)
        };
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
     * Create a list of posts
     * @return {DOM} posts
     */
    postLoad = () => {
        const { posts, match } = this.props;
        let { tag } = match.params;

        if (posts === undefined || !Object.keys(posts).length > 0) {
            return (
                <h1>
                    'Nothing has shared.'
                </h1>
            );
        }

        else {
            let postBack = { oddPostList: [], evenPostList: [] };
            let parsedPosts = [];

            Object.keys(posts).forEach((postId) => {
                if (tag) {
                    let regex = new RegExp("#" + tag, 'g')
                    let postMatch = posts[postId].body.match(regex)
                    if (postMatch !== null)
                        parsedPosts.push({ ...posts[postId] })
                } else {
                    parsedPosts.push({ ...posts[postId] })

                }
            })

            const sortedPosts = PostAPI.sortObjectsDate(parsedPosts);

            if (sortedPosts.length > 6) {
                // postBack.divided = true;

            }

            else {
                postBack.divided = false;
            }

            sortedPosts.forEach((post, index) => {
                let newPost = (
                    <div key={post.id}>

                        {index > 1 || (!postBack.divided && index > 0) ? <div style={{ height: "16px" }}></div> : ''}
                        <Post
                            body={post.body}
                            commentCounter={post.commentCounter}
                            creationDate={post.creationDate}
                            id={post.id}
                            image={post.image}
                            lastEditDate={post.lastEditDate}
                            ownerDisplayName={post.ownerDisplayName}
                            ownerUserId={post.ownerUserId}
                            ownerAvatar={post.ownerAvatar}
                            postTypeId={post.postTypeId}
                            score={post.score}
                            tags={post.tags}
                            video={post.video}
                            disableComments={post.disableComments}
                            disableSharing={post.disableSharing}
                            viewCount={posts.viewCount}
                            pictureState={true} />
                    </div>
                )

                if ((index % 2) === 1 && postBack.divided) {
                    postBack.oddPostList.push(newPost);
                }

                else {
                    postBack.evenPostList.push(newPost);
                }
            });

            if (postBack.evenPostList.length > 10) {
                for (var i = 10; i < postBack.evenPostList.length; i = i + 10) {
                    let img = "";
                    switch (this.state.rand) {
                        case 0:
                            img = "images/postAds/yourAdHere.jpg";
                            break;
                        case 1:
                            img = "images/postAds/chase.jpg";
                            break;
                        case 2:
                            img = "images/postAds/Allstate.png";
                            break;
                        case 3:
                            img = "images/postAds/AT&T.png";
                            break;
                    }
                    let ad = (
                        <div key={i}>
                            {i !== 0 ? <div style={{ height: "16px" }}></div>: ''}
                            <AdPost image={img} />
                            {i === 0 ? <div style={{ height: "16px" }}></div>: ''}
                        </div>
                    );
                    this.state.adPost ? postBack.evenPostList.splice(i, 0, ad) : '';
                }
            } else {
                let halfway = Math.floor(postBack.evenPostList.length / 2);
                console.log(halfway);
                let img = "";
                
                switch (this.state.rand) {
                    case 0:
                        img = "images/postAds/yourAdHere.jpg";
                        break;
                    case 1:
                        img = "images/postAds/chase.jpg";
                        break;
                    case 2:
                        img = "images/postAds/Allstate.png";
                        break;
                    case 3:
                        img = "images/postAds/AT&T.png";
                        break;
                }
                let ad = (
                    <div key={halfway}>
                        {halfway !== 0 ? <div style={{ height: "16px" }}></div>: ''}
                        <AdPost image={img} />
                        {halfway === 0 ? <div style={{ height: "16px" }}></div>: ''}
                    </div>
                );
                this.state.adPost ? postBack.evenPostList.splice(halfway, 0, ad) : '';
            }

            return postBack;
        }
    }

    componentWillMount() {
        this.props.setHomeTitle();
        this.props.loadPeople();
    }

    /**
     * Render component DOM
     * @return {react element} return the DOM which is rendered by component
     */
    render() {
        const { tag, displayWriting } = this.props;
        const postList = this.postLoad();

        let img = "";
        let img2 = "";

        if (this.state.displaySelfAd) {
            img = "images/skyAds/oasis.png";
            img2 = "images/skyAds/oasis.png";
        }

        else {
            switch (this.state.rand2) {
                case 0:
                    img = "images/skyAds/toyota.png";
                    break;
                case 1:
                    img = "images/skyAds/coupon.jpg";
                    break;
                case 2:
                    img = "images/skyAds/tide.jpg";
                    break;
                case 3:
                    img = "images/skyAds/advertise.jpg";
                    break;
            }
            
            switch (this.state.rand3) {
                case 0:
                    img2 = "images/skyAds/toyota.png";
                    break;
                case 1:
                    img2 = "images/skyAds/coupon.jpg";
                    break;
                case 2:
                    img2 = "images/skyAds/tide.jpg";
                    break;
                case 3:
                    img2 = "images/skyAds/advertise.jpg";
                    break;
            }
        }

        return (
            <div >
                {/* {this.state.adSky ? <AdSky left={false} image={img}/> : ''} */}
                {this.state.adSky ? <AdSky left={true} image={img2} /> : ''}
                <div className='grid grid__gutters grid__1of2 grid__space-around animate-top'>
                    <div className='grid-cell animate-top' style={{ maxWidth: '530px', minWidth: '280px' }}>
                        {displayWriting && !tag
                            ? (<PostWrite open={this.state.openPostWrite} onRequestClose={this.handleClosePostWrite} edit={false}>
                                <div style={{ height: "68px", width: "100%", backgroundColor: 'white', border: '1px solid #dddfe2', borderRadius: '7px' }}>
                                    <ListItem
                                        primaryText={<span style={{ color: grey400, cursor: "text" }}>What's new with you?</span>}
                                        leftAvatar={<UserAvatar fullName={this.props.fullName} fileName={this.props.avatar} size={36} />}
                                        rightIcon={<svg width="24" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M10.133 15.239H3.84L8.533 9.92l2.995 3.393 3.939-5.438 5.226 7.364h-10.56zM1.742 0h20.516c.606 0 .826.063 1.047.181.221.119.395.293.514.514.118.221.181.441.181 1.047v14.516c0 .606-.063.826-.181 1.047a1.234 1.234 0 0 1-.514.514c-.221.118-.441.181-1.047.181H1.742c-.606 0-.826-.063-1.047-.181a1.234 1.234 0 0 1-.514-.514C.063 17.084 0 16.864 0 16.258V1.742C0 1.136.063.916.181.695.3.474.474.3.695.181.916.063 1.136 0 1.742 0zm.391 2.25v13.5h19.734V2.25H2.133zM6.72 7.875c-1.084 0-1.92-.801-1.92-1.739 0-1.04.836-1.84 1.92-1.84.978 0 1.813.8 1.813 1.84 0 .938-.835 1.739-1.813 1.739z" fill="#7ED321" /></svg>}
                                        style={{ padding: "7px 0px" }}
                                        onTouchTap={this.handleOpenPostWrite}
                                    />
                                </div>
                                <div style={{ height: "20px" }}></div>
                            </PostWrite>)
                            : ''}

                        <List>
                            <ListItem>Hello World!</ListItem>
                            {Object.keys(this.props.allUsers ? this.props.allUsers : {}).map( userKey => {
                                let user = this.props.allUsers[userKey];
                                console.log("Printing this user");
                                console.log(user.fullName);
                                // return (<div style={{backgroundColor: 'black', height: '100px', width: '100px'}}>{}</div>);
                                return (<ListItem style={{backgroundColor: 'black', height: '100px', weight: '100px'}}>{user.fullName}</ListItem>);
                                // (<ListItem primaryText={user.fullName}
                                //                 leftAvatar={<UserAvatar fullName={user.fullName} fileName={user.avatar} size={36} />}
                                //                 style={{ backgroundColor: 'black',padding: "7px 0px", height: "100px", width: "100px" }}/>)
                            })}
                        </List>


                        {postList.evenPostList}
                        <div style={{ height: "16px" }}></div>
                    </div>
                    {postList.divided
                        ? (<div className='grid-cell animate-top' style={{ maxWidth: '530px', minWidth: '280px' }}>
                            <div className="blog__right-list">
                                {postList.oddPostList}
                                <div style={{ height: "16px" }}></div>
                            </div>
                        </div>)
                        : ''}
                </div>
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
        setHomeTitle: () => dispatch(globalActions.setHeaderTitle(ownProps.homeTitle || '')),
        showTopLoading: () => dispatch(globalActions.showTopLoading()),
        hideTopLoading: () => dispatch(globalActions.hideTopLoading()),
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
        avatar: state.user.info && state.user.info[state.authorize.uid] ? state.user.info[state.authorize.uid].avatar : '',
        fullName: state.user.info && state.user.info[state.authorize.uid] ? state.user.info[state.authorize.uid].fullName : '',
        allUsers: state.user.info
    }
}

// - Connect component to redux store
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Blog))
