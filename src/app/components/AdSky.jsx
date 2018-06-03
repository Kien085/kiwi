import React, { Component } from 'react';
// import { withStyles } from '@material-ui/core/styles';
// import Card from '@material-ui/core/Card';
// import FlatButton from 'material-ui/Button';
// import Typography from '@material-ui/core/Typography';
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
            <div style={{position: "fixed", top: "55%", left: "0", transform: "translate(0,-50%)", width: "160px", height: "600px"}}>
                <img src={image} style={{width: "100%", height: "100%"}}/>
            </div>
            :
            <div style={{position: "fixed", top: "55%", left: "100%", transform: "translate(-100%, -50%)", width: "160px", height: "600px"}}>
                <img src={image} style={{width: "100%", height: "100%"}}/>
            </div>
        );
    }
}
// marginTop: "-50%", marginLeft: "-100%"
export default AdSky