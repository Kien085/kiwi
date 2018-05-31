import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { NavLink, withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';

// - Import actions
import *  as authorizeActions from 'authorizeActions';
import * as globalActions from 'globalActions';

// - Import app API
import StringAPI from 'StringAPI';

import forge from 'node-forge';

export class Signup extends Component {

    /**
     * Component constructor
     * @param  {object} props is an object properties of component
     */
    constructor(props) {
        super(props);

        this.state = {
            fullNameInput: '',
            fullNameInputError: '',
            emailInput: '',
            emailInputError: '',
            passwordInput: '',
            passwordInputError: '',
            confirmInput: '',
            confirmInputError: ''
        };
    }

    /**
     * Handle data on input change
     * @param  {event} event is an event of inputs of element on change
     */
    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.setState({ [name]: target.value });

        if (name === 'fullNameInput') {
            this.setState({ fullNameInputError: '' });
        }

        else if (name === 'emailInput') {
            this.setState({ emailInputError: '' });
        }

        else if (name === 'passwordInput') {
            this.setState({
                confirmInputError: '',
                passwordInputError: ''
            });
        }

        else if (name === 'confirmInput') {
            this.setState({
                confirmInputError: '',
                passwordInputError: ''
            });
        }

        else if (name === 'checkInput') {
            this.setState({ checkInputError: '' });
        }
    }

    handleForm = () => {
        const { fullNameInput, emailInput, passwordInput, confirmInput } = this.state;

        // Validate full name
        const fullNameCheck = fullNameInput.trim().toLowerCase();

        if (fullNameCheck.length < 2) {
            this.setState({ fullNameInputError: 'Please enter a valid name.' });
        }

        /* Validate email*/
        if (!StringAPI.isValidEmail(emailInput)) {
            this.setState({ emailInputError: 'Please enter a valid email.'});
        }

        /* Check password */
        if (passwordInput === '') {
            this.setState({ passwordInputError: 'This field is required.' });
        }

        if (confirmInput === '') {
            this.setState({ confirmInputError: 'This field is required.' });
        }

        else if (confirmInput !== passwordInput) {
            this.setState({
                passwordInputError: 'This field should be equal to confirm password.',
                confirmInputError: 'This field should be equal to password.'
            });
        }

        else {
            // Encryption of password
            let bcrypt = require('bcryptjs');
            let salt = bcrypt.genSaltSync(12);
            let hash = bcrypt.hashSync(passwordInput, salt);

            this.props.register({
                email: emailInput,
                password: hash,
                fullName: fullNameInput
            });
        }
    }

    /**
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {
        return (
            <div style={{height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{backgroundColor: 'white', width: '450px', textAlign: 'center', borderRadius: '10px'}}>
                    <h1>Sign up</h1>

                    <TextField
                        onChange={this.handleInputChange}
                        errorText={this.state.fullNameInputError}
                        name="fullNameInput"
                        floatingLabelStyle={{ fontSize: "15px" }}
                        floatingLabelText="Full Name"
                        type="text"
                    />
                    
                    <br />

                    <TextField
                        onChange={this.handleInputChange}
                        errorText={this.state.emailInputError}
                        name="emailInput"
                        floatingLabelStyle={{ fontSize: "15px" }}
                        floatingLabelText="Email"
                        type="email"
                    />

                    <br />

                    <TextField
                        onChange={this.handleInputChange}
                        errorText={this.state.passwordInputError}
                        name="passwordInput"
                        floatingLabelStyle={{ fontSize: "15px" }}
                        floatingLabelText="Password"
                        type="password"
                    />
                    
                    <br />

                    <TextField
                        onChange={this.handleInputChange}
                        errorText={this.state.confirmInputError}
                        name="confirmInput"
                        floatingLabelStyle={{ fontSize: "15px" }}
                        floatingLabelText="Confirm Password"
                        type="password"
                    />

                    <br />
                    <br />

                    <div style={{display: 'flex', width: '100%', flexDirection: 'column'}}>
                        <div style={{display: 'flex', outline: 'none', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', height: '50px', backgroundColor: 'white', color: 'black', marginRight: '31px'}} label="Return to Login screen" onClick={this.props.loginPage}>
                            <svg style={{marginRight: '10px'}} width="21" height="17" xmlns="http://www.w3.org/2000/svg"><path d="M7.723.67A.966.966 0 0 1 9.09 2.039L3.644 7.484l16.087.04a.978.978 0 0 1 .973.975.966.966 0 0 1-.968.97L3.56 9.426l5.489 5.488a.973.973 0 0 1 .004 1.375.973.973 0 0 1-1.375-.005L.583 9.19A.973.973 0 0 1 .58 7.815L7.723.67z" fill="#A2A2A2"/></svg>
                            Return to login page
                        </div>
                        <div style={{display: 'flex', outline: 'none', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', height: '50px', backgroundColor: '#9013FE', color: 'white', borderRadius: '0 0 10px 10px'}} label="Create Account" onClick={this.handleForm}>Create</div>
                    </div>
                </div>
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
        showError: (message) => {
            dispatch(action(types.SHOW_ERROR_MESSAGE_GLOBAL)(error.message))
        },
        register: (data) => {
            dispatch(authorizeActions.dbSignup(data))
        },
        loginPage: () => {
            dispatch(push("/login"))
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signup))