import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchStats } from '../actions/landing';
import { fetchSearchResults } from '../actions/search_results_actions';
import DashboardSearch from '../components/DashboardSearch';
import SearchResultList from '../components/SearchResultList';
import currentUserProps from '../prop-types/current_user_props';

class DashboardContainer extends Component {
  constructor(props){
    super(props);
    this.search = this.search.bind(this);
    this.selectType = this.selectType.bind(this);
    this.state = {
      searchType: '',
      searchTerms: ''
    };
  }

  componentWillMount() {
    this.props.fetchStats();
    this.search('');
  }

  render() {
    return (
      <div className="container">
        <div className="row dashboard">
          <div className="col-md-8">
            <div className="dashboard-details">
              <DashboardSearch search={this.search} />
              <div className="row">
                <div className="col-md-12">
                  {this.analyticsGroup(this.state.searchType)}
                </div>
              </div>
              <SearchResultList searchResults={this.props.searchResults} currentUser={this.props.currentUser} />
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-activity">
              {this.recentItems()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  search(searchTerms) {
    let searchType = null;
    if(this.state.searchType === '') {
      searchType = null;
    } else {
      searchType = this.state.searchType;
    }
    if(searchTerms === ''){
      searchTerms = null;
    }
    this.setState({searchTerms: searchTerms});
    this.props.fetchSearchResults(searchTerms, searchType);
  }

  selectType(searchType) {
    let searchTerms = null;
    if(this.state.searchTerms === '') {
      searchTerms = null;
    } else {
      searchTerms = this.state.searchTerms;
    }
    if(this.state.searchType === searchType) {
      this.setState({searchType: ''});
      searchType = null;
    } else {
      this.setState({searchType: searchType});
    }
    this.props.fetchSearchResults(searchTerms, searchType);
  }

  analyticsGroup(searchType) {
    return (
    <div className="analytics-group">
      <ul className="analytics-list-group">
        <li className={"analytics-list-item btn" + (searchType === 'question' ? " analytics-active-item" : "")} onClick={() => this.selectType('question')}>
          <div>
            <i className="fa fa-question-circle fa-3x item-icon" aria-hidden="true"></i>
            <p className="item-value">{this.props.questionCount}</p>
            <h2 className="item-title">Questions</h2>
          </div>
        </li>
        <li className={"analytics-list-item btn" + (searchType === 'response_set' ? " analytics-active-item" : "")} onClick={() => this.selectType('response_set')}>
          <div>
            <i className="fa fa-list fa-3x item-icon" aria-hidden="true"></i>
            <p className="item-value">{this.props.responseSetCount}</p>
            <h2 className="item-title">Response Sets</h2>
          </div>
          </li>
        <li className={"analytics-list-item btn" + (searchType === 'form' ? " analytics-active-item" : "")} onClick={() => this.selectType('form')}>
          <div>
            <i className="fa fa-clipboard fa-3x item-icon" aria-hidden="true"></i>
            <p className="item-value">{this.props.formCount}</p>
            <h2 className="item-title">Forms</h2>
          </div>
          </li>
      </ul>
      {searchType != '' && <div>Search Filter: {searchType}</div>}
    </div>);
  }

  recentItems() {
    return (
      <div className="recent-items-panel">
        <div className="recent-items-heading">Recent Items</div>
        <div className="recent-items-body">
          <ul className="list-group">
            <li className="recent-item-list">
              <div className="recent-items-icon"><i className="fa fa-list recent-items-icon" aria-hidden="true"></i></div>
              <div className="recent-items-value">{this.props.responseSetCount} Response Sets</div>
            </li>

            <li className="recent-item-list">
              <div className="recent-items-icon"><i className="fa fa-question-circle recent-items-icon" aria-hidden="true"></i></div>
              <div className="recent-items-value">{this.props.questionCount} Questions</div>
            </li>

            <li className="recent-item-list">
              <div className="recent-items-icon"><i className="fa fa-clipboard recent-items-icon" aria-hidden="true"></i></div>
              <div className="recent-items-value">{this.props.formCount} Forms</div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    formCount: state.stats.formCount,
    questionCount: state.stats.questionCount,
    responseSetCount: state.stats.responseSetCount,
    searchResults: state.searchResults,
    currentUser: state.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchStats, fetchSearchResults}, dispatch);
}

DashboardContainer.propTypes = {
  formCount: PropTypes.number,
  questionCount: PropTypes.number,
  responseSetCount: PropTypes.number,
  fetchStats: PropTypes.func,
  fetchSearchResults: PropTypes.func,
  currentUser: currentUserProps,
  searchResults: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
