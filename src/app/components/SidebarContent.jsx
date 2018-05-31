import React, { Component } from 'react';

export default class SidebarContent extends Component {
    static qcName = 'SidebarContent'

    /**
     * Handle click on cover of sidebar
     * @param  {event} evt is a click event passed to funciton
     */
    handleClickCover = (evt) => {
        this.props.sidebar(false, 'overlay');
    }

    /**
   * Reneder component DOM
   * @return {react element} return the DOM which rendered by component
   */
    render() {
        const showCoverStyle = { position: "fixed", height: "100%", width: "100%", top: "0px", left: "0px", opacity: "1", backgroundColor: "rgba(255, 255, 255, 0.54)", WebkitTapHighlightColor: "rgba(0, 0, 0, 0)", willChange: "opacity", transform: "translateZ(0px)", transition: "left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms", zIndex: "1111", pointerEvents: "auto" };
        const hideCoverStyle = { position: "fixed", height: "100%", width: "100%", top: "0px", left: "-100%", opacity: "0", backgroundColor: "rgba(255, 255, 255, 0.54)", WebkitTapHighlightColor: "rgba(0, 0, 0, 0)", willChange: "opacity", transform: "translateZ(0px)", transition: "left 0ms cubic-bezier(0.23, 1, 0.32, 1) 400ms, opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms", zIndex: "1111", pointerEvents: "none" };
        
        return (
            <div id='sidebar-content'>
                <div style={this.props.overlay ? showCoverStyle : hideCoverStyle} style={{ overflow: 'hidden' }} onClick={this.handleClickCover}></div>
                <div className={this.props.className} style={this.props.cstyle}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
