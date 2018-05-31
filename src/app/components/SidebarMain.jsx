import React, { Component } from 'react';

export default class SidebarMain extends Component {
    static qcName = 'SidebarMain';

    /**
     * Render component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        return (
            <div className="home__main" style={this.props.cstyle}>
                <div style={{ height: "64px", width: "100%" }}></div>
                {this.props.children}
            </div>
        )
    }
}