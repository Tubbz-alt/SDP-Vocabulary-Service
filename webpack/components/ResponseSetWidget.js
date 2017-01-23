import React, { Component, PropTypes } from 'react';

export default class ResponseSetWidget extends Component {
  render() {
    return (
      <div className="response-set-group" id={"response_set_id_"+this.props.responseSet.id}>
        <div className="response-set-name">
          <div className="response-set-container">
            <ul className="list-inline">
              <li>
                <a href={this.props.routes.responseSetPath(this.props.responseSet)}>{this.props.responseSet.name}</a>
              </li>
              <li className="pull-right"><a><span className="fa fa-question-circle-o"></span></a></li>
            </ul>
          </div>

          <div className="response-set-details">
            <ul className="list-inline response-set-items">
              <li className="reponse-set-id">{this.props.responseSet.description}</li>
              <li className="pull-right response-set-menu">
                <div className="dropdown">
                  <a id={"response_set_"+this.props.responseSet.id+"_menu"} className="dropdown-toggle" type="" data-toggle="dropdown" role="navigation">
                    <span className="fa fa-ellipsis-h"></span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-right" >
                    <li>
                      <a href={this.props.routes.reviseResponseSetPath(this.props.responseSet)}>Revise</a>
                    </li>
                    <li>
                      <a href={this.props.routes.extendResponseSetPath(this.props.responseSet)}>Extend</a>
                    </li>
                    <li>
                      <a href={this.props.routes.responseSetPath(this.props.responseSet)}>Details</a>
                    </li>
                    <li>
                      <a data-confirm="Are you sure?" rel="nofollow" data-method="delete" href={this.props.routes.responseSetPath(this.props.responseSet)}>Delete</a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    );
  }
}

ResponseSetWidget.propTypes = {
  responseSet: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string
  }),
  routes: PropTypes.shape({
    responseSetPath: PropTypes.func.isRequired,
    extendResponseSetPath: PropTypes.func.isRequired,
    reviseResponseSetPath: PropTypes.func.isRequired
  })
};