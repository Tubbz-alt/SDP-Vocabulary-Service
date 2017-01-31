import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchResponseSets } from '../actions/response_set_actions';
import ResponseSetList from '../components/ResponseSetList';
import ResponseSetListSearch from '../components/ResponseSetListSearch';
import Routes from '../routes';
import { responseSetProps } from '../prop-types/response_set_props';

class ResponseSetsContainer extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
  }

  componentWillMount() {
    this.props.fetchResponseSets();
  }

  search(searchTerms){
    this.props.fetchResponseSets(searchTerms);
  }

  render() {
    if(!this.props.responseSets){
      return (
        <div>Loading..</div>
      );
    }
    return (
      <div className='row basic-bg'>
        <div className='col-md-12'>
          <ResponseSetListSearch search={this.search} />
          <ResponseSetList responseSets={this.props.responseSets} routes={Routes} />
          <a className='btn btn-default' href={Routes.newResponseSetPath()}>New Response Set</a>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    responseSets: state.responseSets
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchResponseSets}, dispatch);
}

ResponseSetsContainer.propTypes = {
  responseSets: PropTypes.objectOf(responseSetProps),
  fetchResponseSets: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseSetsContainer);
