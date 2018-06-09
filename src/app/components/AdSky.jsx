import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardText } from 'material-ui/Card';

export class AdSky extends Component {
    /**
     * Component constructor
     * @param  {object} props is an object properties of component
     */
    constructor(props) {
        super(props);
    }

    render() {
        const { left, image } = this.props;
        return (
            left ?
            <div className="adSky" style={{position: "fixed", top: "55%", left: "0", transform: "translate(0,-50%)", width: "160px", height: "600px"}}>
                <img className="adSky" src={image} style={{width: "100%", height: "100%"}}/>
            </div>
            :
            <div className="adSky" style={{position: "fixed", top: "55%", left: "100%", transform: "translate(-100%, -50%)", width: "160px", height: "600px"}}>
                <img className="adSky" src={image} style={{width: "100%", height: "100%"}}/>
            </div>
        );
    }
}
// marginTop: "-50%", marginLeft: "-100%"
export default AdSky