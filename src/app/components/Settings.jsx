import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import TextField from 'material-ui/TextField';

// - Import actions
import * as authorizeActions from '../actions/authorizeActions'

export class Settings extends Component {

    /**
     * Component constructor
     * @param  {object} props is an object properties of component
     */
    constructor(props) {
        super(props);

        this.state = {
            passwordInput: '',
            passwordInputError: '',
            confirmInput: '',
            confirmInputError: '',
        };
    }

    /**
     * Handle data on input change
     * @param  {event} evt is an event of inputs of element on change
     */
    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.setState({ [name]: target.value });

        if (name === 'passwordInput') {
            this.setState({ passwordInputError: '' });
        }

        else if (name === 'confirmInput') {
            this.setState({
                confirmInputError: '',
                passwordInputError: ''
            });
        }
    }

    handleForm = () => {
        if (this.state.passwordInput === '') {
            this.setState({ passwordInputError: 'This field is required' });
        }

        else if (this.state.confirmInput === '') {
            this.setState({ confirmInputError: 'This field is required' });
        }
        else if (this.state.confirmInput !== this.state.passwordInput) {
            this.setState({ confirmInputError: 'Password and confirm password should be equal!' });
        }

        else {
            this.props.login(
                this.state.passwordInput,
                this.state.confirmInput
            );
        }
    }


    /**
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        return (
            <form style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ backgroundColor: 'white', width: '450px', textAlign: 'center', borderRadius: '10px' }}>
                    <h1>Change Password</h1>
                    <TextField
                        onChange={this.handleInputChange}
                        errorText={this.state.passwordInputError}
                        name="passwordInput"
                        floatingLabelStyle={{ fontSize: "15px" }}
                        floatingLabelText="New password"
                        type="password"
                    />
                    <br />
                    <TextField
                        onChange={this.handleInputChange}
                        errorText={this.state.passwordInputError}
                        name="confirmInput"
                        floatingLabelStyle={{ fontSize: "15px" }}
                        floatingLabelText="Confirm password"
                        type="password"
                    />
                    <br />
                    <br />
                    <div className="settings__button-box" style={{ display: 'flex', width: '100%', flexDirection: 'row' }}>
                        <div style={{ display: 'flex', outline: 'none', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', height: '50px', width: '49%', backgroundColor: '#5574F7', color: 'white', borderRadius: '0 0 0 10px', padding: '0 15px 0 15px' }} label="Home" onClick={this.props.homePage}>Home</div>
                        <div style={{ display: 'flex', outline: 'none', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', height: '50px', width: '50%', backgroundColor: '#5574F7', color: 'white', borderRadius: '0 0 10px 0', padding: '0 15px 0 15px' }} label="Change password" onClick={this.handleForm}>Change password</div>
                    </div>
                </div>
            </form>
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
        login: (password) => {
            dispatch(authorizeActions.dbUpdatePassword(password))
        },
        homePage: () => {
            dispatch(push("/"))
        }
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

    }
}

// - Connect component to redux store
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings))
