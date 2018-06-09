import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { push } from 'react-router-redux'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import * as authorizeActions from '../actions/authorizeActions'



/**
 * Create component class
 *
 * @export
 * @class ResetPasswordComponent
 * @extends {Component}
 */
export class ResetPassword extends Component {

    /**
     * Component constructor
     * @param  {object} props is an object properties of component
     */
    constructor(props) {
        super(props)

        this.state = {
            emailInput: '',
            emailInputError: ''

        }
        // Binding function to `this`
        this.handleForm = this.handleForm.bind(this)

        this.styles = {
            textField: {
                minWidth: 280,
                marginTop: 20
            },
            caption: {
                marginTop: 30,
                color: "rgba(0, 0, 0, 0.54)",
                fontSize: "0.75rem",
                fontWeight: 400,
                fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                lineHeight: "1.375em"
            },
            contain: {
                margin: '0 auto'
            },
            paper: {
                minHeight: 370,
                maxWidth: 450,
                minWidth: 337,
                textAlign: 'center',
                display: 'block',
                margin: 'auto',
                borderRadius: '10px'
            }
        }
    }

    /**
     * Handle data on input change
     * @param  {event} evt is an event of inputs of element on change
     */
    handleInputChange = (event) => {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        this.setState({
            [name]: value
        })

    }

    /**
     * Handle register form
     */
    handleForm = () => {
        const { translate } = this.props
        let error = false
        if (this.state.emailInput === '') {
            this.setState({
                emailInputError: 'This field is required'
            })

            return
        }

        this.props.resetPassword(this.state.emailInput)
    }

    /**
     * Render component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {

        const { classes, translate } = this.props

        return (
            <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                <div className='animate-bottom'>
                    <Paper style={this.styles.paper} elevation={1}>
                        <div style={{ padding: '48px 40px 36px' }}>
                            <div style={{
                                paddingLeft: '40px',
                                paddingRight: '40px'
                            }}>

                                <h1 className='zoomOutLCorner animated g__paper-title'>Reset Password</h1>
                            </div>

                            <TextField
                                onChange={this.handleInputChange}
                                errorText={this.state.emailInputError}
                                name="emailInput"
                                floatingLabelStyle={{ fontSize: "15px" }}
                                floatingLabelText="Email"
                                type="email"
                            />
                            <br />
                            <br />
                            <br />
                            <div className='settings__button-box'>
                                <div>
                                    <FlatButton onClick={this.props.loginPage} label={"Back"}></FlatButton>
                                </div>
                                <div>
                                    <RaisedButton onClick={this.handleForm} className="reset" label={"Reset Password"}></RaisedButton>
                                </div>
                            </div>
                            <p style={this.styles.caption}>
                                Please enter your email and click on `Reset Password`. We will send you an email that contains a link to reset your password.
                            </p>
                        </div>
                    </Paper>
                </div>
            </div>
            // </Grid>
            //   </Grid>
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
        loginPage: () => {
            dispatch(push('/login'))
        },
        resetPassword: (emailAddress) => {
            dispatch(authorizeActions.dbResetPassword(emailAddress))
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
        // translate: getTranslate(state.get('locale')),
    }
}

// - Connect component to redux store
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPassword))
