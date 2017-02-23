import React, { Component, PropTypes } from 'react';
import { Modal } from 'react-bootstrap';
import Errors from '../Errors.js';

export default class SignUpModal extends Component {
  constructor(props) {
    super(props);
    this.state = {email: '', firstName: '', lastName: '', password: '',
      passwordConfirmation: '', errors: {}};
  }

  render() {
    return (
      <Modal show={this.props.show}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <Errors errors={this.state.errors} />
            <div className="control-group">
              <label className="control-label" htmlFor="email">E-mail</label>
              <div className="controls">
                <input autoFocus="autofocus" placeholder="" className="form-control input-lg" type="email"
                       value={this.state.email} name="email" id="email" onChange={this.handleChange('email')} />
                <p className="help-block">Please provide your E-mail</p>
              </div>
            </div>
            <div className="field">
              <label className="control-label" htmlFor="firstName">First name</label>
              <input className="form-control input-lg" type="text" name="firstName" id="firstName" onChange={this.handleChange('firstName')}/>
            </div>

            <div className="field">
              <label className="control-label" htmlFor="lastName">Last name</label>
              <input className="form-control input-lg" type="text" name="lastName" id="lastName" onChange={this.handleChange('lastName')}/>
            </div>

            <div className="control-group">
              <label className="control-label" htmlFor="password">Password</label>
              <div className="controls">
                <input autoComplete="off" placeholder="" className="form-control input-lg" type="password" name="password" id="password" onChange={this.handleChange('password')}/>
                <p className="help-block">Password should be at least
                  6
                  characters</p>
              </div>
            </div>

            <div className="control-group">
              <label className="control-label" htmlFor="passwordConfirmation">Password (Confirm)</label>
              <div className="controls">
                <input autoComplete="off" placeholder="" className="form-control input-lg" type="password"
                       name="passwordConfirmation" id="passwordConfirmation" onChange={this.handleChange('passwordConfirmation')}/>
                <p className="help-block">Please confirm password</p>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-default" onClick={this.props.closer}>Close</button>
          <button type="button" className="btn btn-primary" onClick={() => this.attemptSignUp() }>Sign Up</button>
        </Modal.Footer>
      </Modal>
    );
  }

  attemptSignUp() {
    const successHandler = () => this.props.closer();
    const failureHandler = (failureResponse) => this.setState({errors: failureResponse.response.data.errors});
    this.props.signUp(this.state, successHandler, failureHandler);
  }

  handleChange(field) {
    return (event) => {
      let newState = {};
      newState[field] = event.target.value;
      this.setState(newState);
    };
  }
}

SignUpModal.propTypes = {
  signUp: PropTypes.func.isRequired,
  closer: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};