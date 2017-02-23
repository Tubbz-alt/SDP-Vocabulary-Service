import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Link } from 'react-router';

export default class VersionInfo extends Component {

  render() {
    const {versionable} = this.props;
    if(!versionable.allVersions || versionable.allVersions.length < 1){
      return null;
    }
    return (
      <div>
        <ul className="nav nav-pills nav-stacked">
          {versionable.allVersions && versionable.allVersions.map((v)=>{
            if(versionable.version == v.version){
              return (
                <li key={v.id} role="presentation" className="active">Version {versionable.version} - Created {moment(v.createdAt,'').fromNow()} </li>
              );
            }else{
              return (
                <li key={v.id} role="presentation"><Link to={`/${this.props.versionableType}s/${v.id}`}>Version {v.version} - Created {moment(v.createdAt,'').fromNow()}</Link></li>
              );
            }
          })}
        </ul>
      </div>
    );
  }
}

VersionInfo.propTypes = {
  versionable:  PropTypes.object,
  versionableType:  PropTypes.string
};
