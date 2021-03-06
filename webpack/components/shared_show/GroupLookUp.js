import React, { Component } from 'react';
import PropTypes from 'prop-types';
import currentUserProps from '../../prop-types/current_user_props';

class GroupLookUp extends Component {
  render() {
    let groups = this.props.item.groups || [];
    return (
      <div className="btn-group">
        <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
           <span className="fa fa-users"></span> Groups <span className="caret"></span>
        </button>
        <ul className="group-dropdown-menu">
          <li key="header" className="dropdown-header">Current Groups:</li>
          {groups.length > 0 ? (
              groups.map((g) => {
                return (
                  <li className='current-group-menu-item' key={g.id}><span className="fa fa-check-square-o" aria-hidden="true"></span> {g.name}
                    <button id={`remove_${g.name}`} onClick={() => this.props.removeFunc(this.props.item.id, g.id)} className="btn btn-default pull-right">
                      <i className="fa fa-ban search-btn-icon" aria-hidden="true"></i><text className="sr-only">{`Click to remove content from ${g.name} group`}</text>
                    </button>
                  </li>
                );
              })
            ) : (
              <li className='current-group-menu-item'>None</li>
            )
          }
          <li key="add-header" className="dropdown-header">Add to Group:</li>
          {this.props.currentUser.groups.filter((group) => !groups.map(g => g.id).includes(group.id)).map((g) => {
            return (
              <li className='current-group-menu-item' key={g.id}>{g.name}
                <button id={`add_${g.name}`} onClick={() => this.props.addFunc(this.props.item.id, g.id)} className="btn btn-default pull-right">
                  <i className="fa fa-plus search-btn-icon" aria-hidden="true"></i><text className="sr-only">{`Click to add content to the ${g.name} group`}</text>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

GroupLookUp.propTypes = {
  addFunc: PropTypes.func,
  removeFunc: PropTypes.func,
  item: PropTypes.object,
  currentUser: currentUserProps
};

export default GroupLookUp;
