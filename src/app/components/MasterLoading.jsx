import React from 'react';
import Dialog from 'material-ui/Dialog';

const MasterLoading = ({activeLoading}) => (
    <Dialog
        modal={true}
        open={activeLoading}
        autoDetectWindowHeight={true}
        contentStyle={{width: '250px'}}
    >
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <div id="wave">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
            <h1>Loading</h1>
        </div>
    </Dialog>
);

export default MasterLoading;