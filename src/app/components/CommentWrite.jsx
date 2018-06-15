import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'material-ui/FlatButton';

// - Import actions
import * as commentActions from '../actions/commentActions';

export class CommentWrite extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: ''
        };

        // Binding functions to `this`
        this.handleRef = this.handleRef.bind(this);
        this.focus = this.focus.bind(this);
    }

    handleOnChange = (evt) => {
        this.setState({ inputValue: evt.target.value });
    }

    handleRef = (ref) => {
        this.inputRef = ref;
    }

    focus = () => {
        this.inputRef.focus();
    };

    handleAddComment = (evt) => {
        this.props.send(this.state.inputValue, this.props.postId, this.props.close);
    };

    render() {
        return (
            <div>
                <textarea autoFocus defaultValue={this.props.commentText} onChange={this.handleOnChange} />
                <Button basic style={{marginTop: '5px'}} onClick={this.handleAddComment} color='teal'>Add Comment</Button>
            </div>
        );
    }
}

// - Map dispatch to props
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        send: (text, postId, callBack) => {
            dispatch(commentActions.dbAddComment({
                postId: postId,
                text: text
            }, callBack))

        }
    }
}

// - Map state to props
const mapStateToProps = (state) => {
    return {

    }
}

// - Connect component to store
export default connect(mapStateToProps, mapDispatchToProps)(CommentWrite)
