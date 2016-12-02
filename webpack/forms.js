import React from 'react';
import ReactDOM from 'react-dom';

import FormsQuestionList from './components/FormsQuestionList';
import QuestionSearch from './components/QuestionSearch';

import { observe } from './FormBuild';

// const unadded = document.getElementById('search-results-div');
const added   = document.getElementById('added-questions');

const all_qs = JSON.parse(document.getElementById('all_qs-json').innerHTML);
const form_qs = JSON.parse(document.getElementById('formqs-json').innerHTML);
const all_rs = JSON.parse(document.getElementById('all_rs-json').innerHTML);

//ReactDOM.render(<FormsQuestionList questions={all_qs} response_sets={all_rs} />, unadded );

ReactDOM.render(<QuestionSearch all_qs={all_qs} all_rs={all_rs} />, document.getElementById('search-results-div'));

observe(questions => 
  ReactDOM.render(
    <FormsQuestionList questions={questions} response_sets={all_rs} btn_type={'remove'} />,
    added 
  )
);
