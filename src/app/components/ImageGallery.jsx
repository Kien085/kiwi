import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GridList, GridTile } from 'material-ui/GridList';
import SvgAddImage from 'material-ui/svg-icons/image/add-a-photo';
import SvgDelete from 'material-ui/svg-icons/action/delete';
import { grey200 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import uuid from 'uuid';

// - Import actions
import * as imageGalleryActions from '../actions/imageGalleryActions';
import * as globalActions from '../actions/globalActions';

// - Import app components
import Img from './Img';

// - Import API
import FileAPI from '../api/FileAPI';

export class ImageGallery extends Component {

    /**
     * Handle set image
     * @param  {event} evt  passed by on click event on add image
     * @param  {string} name is the name of the image
     */
    handleSetImage(evt, URL, fullPath) {
        this.props.set(URL, fullPath);
        this.close();
    }

    /**
     * Handle delete image
     * @param  {event} evt  passed by on click event on delete image
     * @param  {integer} id is the image identifier which selected to delete
     */
    handleDeleteImage(evt, id) {
        this.props.deleteImage(id);
    }

    componentDidMount() {
        window.addEventListener("onSendResizedImage", this.handleSendResizedImage);
    }

    componentWillUnmount() {
        window.removeEventListener("onSendResizedImage", this.handleSendResizedImage);
    }

    /**
     * Handle send image resize event that pass the resized image
     * 
     * @memberof ImageGallery
     */
    handleSendResizedImage(event) {
        const { resizedImage, fileName } = event.detail;

        FileAPI.uploadImage(resizedImage, fileName, (percent, status) => {
            this.props.progressChange(percent, status);
        }).then((result) => {
            /* Add image to image gallery */
            this.props.saveImageGallery(result.downloadURL, result.metadata.fullPath);
        });
    }

    // Handle on change file upload
    onFileChange(evt) {
        const extension = FileAPI.getExtension(evt.target.files[0].name);
        const fileName = (`${uuid()}.${extension}`);
        const image = FileAPI.constraintImage(evt.target.files[0], fileName);
    }

    // Hide image gallery
    close() {
        this.props.close();
    }

    imageList() {
        return this.props.images.map((image, index) => {
            return (<GridTile
                style={{cursor: 'pointer'}}
                onClick={evt => this.handleSetImage(evt, image.URL, image.fullPath)}
                key={image.id}
                title={<SvgDelete hoverColor={grey200} color="white" color="white" style={{ marginLeft: "5px", cursor: "pointer" }} onClick={evt => this.handleDeleteImage(evt, image.id)} />}
            >
                <div>
                    <div style={{ overflowY: "hidden", overflowX: "auto" }}>
                        <ul style={{ whiteSpace: "nowrap", padding: "0 6px", margin: "8px 0 0 0", verticalAlign: "bottom", flexShrink: 0, listStyleType: "none" }}>
                            <div style={{ display: "block" }}>
                                <div style={{ display: "block", marginRight: "8px", transition: "transform .25s" }}>
                                    <li style={{ width: "100%", margin: 0, verticalAlign: "bottom", position: "static", display: "inline-block" }}>
                                        <Img fileName={image.URL} style={{ width: "100%", height: "auto" }} />
                                    </li>
                                </div>
                            </div>

                        </ul>
                    </div>
                </div>
            </GridTile>)
        })
    }

    /**
     * When the post text changed
     * @param  {event} evt is an event passed by change post text callback funciton
     * @param  {string} data is the post content which user writes
     */
    render() {
        /**
         * Component styles
         * @type {Object}
         */
        const styles = {
            root: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around'
            },
            gridList: {
                width: 500,
                height: 450,
                overflowY: 'auto'
            },
            uploadInput: {
                cursor: 'pointer',
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                width: '100%',
                opacity: 0
            }
        };

        return (
            <div style={styles.root}>
                <GridList cellHeight={180} style={styles.gridList}>
                    <GridTile >
                        <div style={{ display: "flex", backgroundColor: "rgba(222, 222, 222, 0.52)", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%" }}>
                            <FlatButton
                                label="Upload Photo"
                                labelPosition="before"
                                style={{verticalAlign: 'middle'}}
                                containerElement="label"
                            >
                                <input type="file" onChange={this.onFileChange} accept="image/*" style={styles.uploadInput} />
                            </FlatButton>
                        </div>
                    </GridTile>
                    {this.imageList()}
                </GridList>
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
        saveImageGallery: (imageURL, imageFullPath) => dispatch(imageGalleryActions.dbSaveImage(imageURL, imageFullPath)),
        deleteImage: (id) => dispatch(imageGalleryActions.dbDeleteImage(id)),
        progressChange: (percent, status) => dispatch(globalActions.progressChange(percent, status))
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
        images: state.imageGallery.images,
        avatar: state.user.info && state.user.info[state.authorize.uid] ? state.user.info[state.authorize.uid].avatar : ''

    }
}

// - Connect component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(ImageGallery)
