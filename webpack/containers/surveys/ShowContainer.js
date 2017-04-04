import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchSurvey, publishSurvey, deleteSurvey } from '../../actions/survey_actions';
import { fetchForms } from '../../actions/form_actions';
import { fetchQuestions } from '../../actions/questions_actions';
import SurveyShow from '../../components/surveys/Show';
import { surveyProps } from '../../prop-types/survey_props';
import { formProps } from '../../prop-types/form_props';
// import CommentList from '../../containers/CommentList';
import currentUserProps from '../../prop-types/current_user_props';

class SurveyShowContainer extends Component {
  componentWillMount() {
    // Only grabbing forms the first time this loads.
    // If we create a new form it'll already be in store.
    this.props.fetchForms();
    this.props.fetchQuestions();
    this.props.fetchSurvey(this.props.params.surveyId);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.params.surveyId != this.props.params.surveyId){
      this.props.fetchSurvey(this.props.params.surveyId);
    }
  }

  render() {
    if(!this.props.survey){
      return (
        <div>Loading..</div>
      );
    }
    return (
      <div className="container">
        <div className="row basic-bg">
          <div className="col-md-12">
            <SurveyShow currentUser={this.props.currentUser}
                        publishSurvey={this.props.publishSurvey}
                        router={this.props.router}
                        survey={this.props.survey}
                        forms ={this.props.forms}
                        deleteSurvey={this.props.deleteSurvey} />
            <div className="col-md-12 showpage-comments-title">Public Comments:</div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {};
  props.currentUser = state.currentUser;
  props.survey = state.surveys[ownProps.params.surveyId];
  if (props.survey) {
    props.forms = props.survey.surveyForms.map((form) => state.forms[form.formId]);
    props.forms = props.forms.filter((f) => f !== undefined);
    if (props.survey.surveillanceSystemId) {
      props.survey.surveillanceSystem = state.surveillanceSystems[props.survey.surveillanceSystemId];
    }
    if (props.survey.surveillanceProgramId) {
      props.survey.surveillanceProgram = state.surveillancePrograms[props.survey.surveillanceProgramId];
    }
  }
  return props;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({publishSurvey, fetchSurvey, deleteSurvey, fetchForms, fetchQuestions}, dispatch);
}

SurveyShowContainer.propTypes = {
  survey: surveyProps,
  forms: PropTypes.arrayOf(formProps),
  currentUser: currentUserProps,
  fetchSurvey: PropTypes.func,
  publishSurvey: PropTypes.func,
  deleteSurvey: PropTypes.func,
  fetchQuestions: PropTypes.func,
  fetchForms: PropTypes.func,
  params: PropTypes.object,
  router: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyShowContainer);
