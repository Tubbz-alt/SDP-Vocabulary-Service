import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import values from 'lodash/values';
import filter from 'lodash/filter';
import clone from 'lodash/clone';

import Errors from '../Errors.js';
import NestedSearchBar from '../NestedSearchBar';

import { surveillanceSystemsProps }from '../../prop-types/surveillance_system_props';
import { surveillanceProgramsProps } from '../../prop-types/surveillance_program_props';
import currentUserProps from '../../prop-types/current_user_props';

// This is an abstract class that is never intended to
// be used directly.
export default class ProfileEditor extends Component {
  constructor(props) {
    super(props);
    this.programSearch = this.programSearch.bind(this);
    this.systemSearch  = this.systemSearch.bind(this);
  }

  componentWillReceiveProps(nextProps){
    var surveillanceSystems  =  values(nextProps.surveillanceSystems);
    var surveillancePrograms =  values(nextProps.surveillancePrograms);
    this.setState({surveillanceSystems:  surveillanceSystems,
      surveillancePrograms: surveillancePrograms,
      defaultProgramId: (surveillancePrograms[0] && surveillancePrograms[0].id) || -1,
      defaultSystemId:  (surveillanceSystems[0] && surveillanceSystems[0].id) || -1
    });
  }

  render() {
    return (
      <Modal animation={false} show={this.props.show} onHide={this.props.closer} aria-label={this.title()}>
        <Modal.Header closeButton>
          <Modal.Title componentClass="h1">{this.title()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <Errors errors={this.state.errors} />
            {this.userInfo() }
            {this.extraContent()}
            <div className="field">
              {this.surveillanceProgramsField()}
            </div><br/>
            <div className="field">
              {this.surveillanceSystemsField()}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-default" onClick={this.props.closer}>Close</button>
          {this.actionButton()}
        </Modal.Footer>
      </Modal>
    );
  }

  userInfo(){
    if(this.props.disableUserUpdate == 'true'){
      return("");
    }else{
      return this.renderUserInfo();
    }
  }

  renderUserInfo(){
    return(
    <div>
      <div className="form-group">
        <label className="control-label" htmlFor="email">E-mail</label>
          <input autoFocus="autofocus" placeholder="" className="form-control" type="email"
                 value={this.state.email} name="email" id="email" onChange={this.handleChange('email')} />
          <span className="help-block">Please provide your E-mail</span>
      </div>
      <div className="row">
        <div className="form-group col-sm-6">
          <label className="control-label" htmlFor="firstName">First name</label>
          <input className="form-control" type="text" name="firstName" id="firstName"
                 value={this.state.firstName} onChange={this.handleChange('firstName')}/>
        </div>
        <div className="form-group col-sm-6">
          <label className="control-label" htmlFor="lastName">Last name</label>
          <input className="form-control" type="text" name="lastName" id="lastName"
                 value={this.state.lastName} onChange={this.handleChange('lastName')}/>
        </div>
      </div>
      <div className="form-group">
        <label className="control-label">Roles</label><br/>
        { this.props.currentUser && this.props.currentUser.admin && <text>Admin, </text>}
        { this.props.currentUser && this.props.currentUser.publisher && <text>Publisher, </text>}
        { this.props.currentUser && this.props.currentUser.author ? (
          <text>Author</text>
        ) : (
          <text>Collaborator</text>
        )}
      </div>
      <div className="form-group">
        <label className="control-label">Groups</label>
        <p>{this.state.groups.length > 0 ? (this.state.groups.map((group, i) => {
          if (i+1 < this.state.groups.length) {
            return (<text key={group.id}>{group.name}, </text>);
          } else {
            return (<text key={group.id}>{group.name}</text>);
          }
        })) : (
          <text>No groups, contact admin to be added to a group.</text>
        )}</p>
      </div>
    </div>);
  }

  programSearch(programSearchTerm){
    var surveillancePrograms = values(this.props.surveillancePrograms);
    if(programSearchTerm && programSearchTerm.length > 1){
      surveillancePrograms = filter(surveillancePrograms, (sp) => sp.name.toLowerCase().includes(programSearchTerm.toLowerCase()) || sp.id === this.state.lastProgramId || sp.id.toString() === this.state.lastProgramId);
    }
    this.setState({surveillancePrograms: surveillancePrograms, defaultProgramId: (surveillancePrograms[0] && surveillancePrograms[0].id) || -1});
  }

  systemSearch(systemSearchTerm){
    var surveillanceSystems = values(this.props.surveillanceSystems);
    if(systemSearchTerm && systemSearchTerm.length > 1){
      surveillanceSystems = filter(surveillanceSystems, (ss) => ss.name.toLowerCase().includes(systemSearchTerm.toLowerCase()) || ss.id === this.state.lastSystemId || ss.id.toString() === this.state.lastSystemId);
    }
    this.setState({surveillanceSystems: surveillanceSystems, defaultSystemId:(surveillanceSystems[0] && surveillanceSystems[0].id) || -1});
  }

  surveillanceProgramsField() {
    return (<div id="search-programs">
        <label className="control-label" htmlFor="lastProgramId">Default Surveillance Program</label>
        <NestedSearchBar onSearchTermChange={this.programSearch} modelName="Program" />
        <select size='5' className="form-control" name="lastProgramId" id="lastProgramId" value={this.state.lastProgramId} onChange={this.handleChange('lastProgramId')} >
          {this.state.surveillancePrograms && this.state.surveillancePrograms.map((sp) => {
            return <option key={sp.id} value={sp.id}>{sp.name}</option>;
          })}
        </select>
      </div>);
  }

  surveillanceSystemsField() {
    return (<div id="search-systems">
        <label className="control-label" htmlFor="lastSystemId">Default Surveillance System</label>
        <NestedSearchBar onSearchTermChange={this.systemSearch} modelName="System" />
        <select size='5' className="form-control" name="lastSystemId" id="lastSystemId" value={this.state.lastSystemId} onChange={this.handleChange('lastSystemId')} >
          {this.state.surveillanceSystems && this.state.surveillanceSystems.map((ss) => {
            return <option key={ss.id} value={ss.id}>{ss.name}</option>;
          })}
        </select>
      </div>);
  }

  profileInformation() {
    let profileInformation = clone(this.state);
    delete profileInformation.errors;
    if (profileInformation.lastSystemId === -1) {
      if (profileInformation.defaultSystemId !== -1){
        profileInformation.lastSystemId = profileInformation.defaultSystemId;
      } else {
        delete profileInformation.lastSystemId;
      }
    }
    if (profileInformation.lastProgramId === -1) {
      if (profileInformation.defaultProgramId !== -1){
        profileInformation.lastProgramId = profileInformation.defaultProgramId;
      } else {
        delete profileInformation.lastProgramId;
      }
    }
    return profileInformation;
  }

  handleChange(field) {
    return (event) => {
      let newState = {};
      newState[field] = event.target.value;
      this.setState(newState);
    };
  }
}

ProfileEditor.propTypes = {
  closer: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  disableUserUpdate:PropTypes.string,
  surveillanceSystems: surveillanceSystemsProps,
  surveillancePrograms: surveillanceProgramsProps,
  currentUser: currentUserProps
};
