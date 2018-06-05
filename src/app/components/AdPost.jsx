import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardText } from 'material-ui/Card';

export class AdPost extends Component {
    /**
     * Component constructor
     * @param  {object} props is an object properties of component
     */
    constructor(props) {
        super(props);
    }

    render() {
        const { image } = this.props;
        return (
            <div style={{ backgroundColor: '#fff', border: '1px solid #dddfe2', borderRadius: '7px' }}>
                <CardMedia>
                    <img src={image} />
                </CardMedia>
            </div>
        );
    }
}

export default AdPost