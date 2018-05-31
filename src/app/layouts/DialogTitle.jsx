import React, { Component } from 'react';
import { grey400 } from 'material-ui/styles/colors';
import SvgClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';

export default class DialogTitle extends Component {

    /**
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        const styles = {
            contain: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: "space-between"
            },
            title: {
                color: 'rgba(0,0,0,0.87)',
                flex: '1 1',
                font: '500 20px Roboto,RobotoDraft,Helvetica,Arial,sans-serif'
            }
        };

        const { buttonLabel, disabledButton, onClickButton, onRequestClose, title } = this.props;

        return (
            <div className='g__dialog-title'>
                <div style={styles.contain}>
                    <div style={{ paddingRight: '10px' }}>
                        <SvgClose onClick={onRequestClose} hoverColor={grey400} style={{ cursor: 'pointer' }} />
                    </div>
                    <div style={styles.title}>
                        {title || ''}
                    </div>
                    {buttonLabel ? (<div style={{ marginTop: '-9px' }}>
                        <FlatButton label={buttonLabel || ''} primary={true} disabled={disabledButton ? disabledButton : false} onClick={onClickButton || (() => _)} />
                    </div>) : ''}
                </div>
                <Divider />
            </div>
        );
    }
}

