import React, { Component } from 'react';
import { connect } from 'react-redux';
import Avatar from 'material-ui/Avatar';

// - Import actions
import * as imageGalleryActions from '../actions/imageGalleryActions'

export class UserAvatar extends Component {
    /**
     * Render component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        const { fileName, fullName, style, size, onTouchTap } = this.props

        return (
            <div style={{ display: 'inherit' }}>
                {(fileName && fileName !== '' && fileName !== 'noImage')
                    ? (<Avatar backgroundColor='#ffffff' src={fileName} size={size || 36} style={style} onTouchTap={onTouchTap} />)
                    : (<Avatar backgroundColor='rgb(0, 0, 0, 0)' size={size || 36} style={style} onTouchTap={onTouchTap}>
                            <svg width="19" height="19" xmlns="http://www.w3.org/2000/svg"><path d="M9.393 9.914a4.957 4.957 0 1 1 0-9.914 4.957 4.957 0 0 1 0 9.914zm9.413 9.012H.203c-1.344-4.034 4.233-7.21 9.19-7.21s10.745 3.2 9.413 7.21z" fill="rgba(255, 255, 255, 0.87)"/></svg>
                        </Avatar>)}
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
    return {
        avatarURL: state.imageGallery.imageURLList,
        imageRequests: state.imageGallery.imageRequests

    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(UserAvatar)
