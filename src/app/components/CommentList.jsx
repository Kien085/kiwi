import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List } from 'material-ui/List';

// - Import app components
import Comment from './Comment';
import * as PostAPI from '../api/PostAPI';

export class CommentList extends Component {

    /**
     * Get comments' DOM
     * @return {DOM} list of comments' DOM
     */
    commentList() {
        const comments = this.props.comments;

        if (comments) {
            let parsedComments = [];

            Object.keys(comments).forEach((commentId) => {
                parsedComments.push({
                    id: commentId,
                    ...comments[commentId]
                });
            });

            const sortedComments = PostAPI.sortObjectsDate(parsedComments);

            return sortedComments.map((comment, index, array) => {
                return <Comment key={comment.id} comment={comment} isPostOwner={this.props.isPostOwner} disableComments={this.props.disableComments} />
            });
        }
    }

    /**
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        return (
            <List style={{width: "100%", maxHeight: '450px', overflowY: 'auto'}}>
                {this.commentList()}
            </List>
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
const mapStateToProps = (state) => {
    return {

    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(CommentList)
