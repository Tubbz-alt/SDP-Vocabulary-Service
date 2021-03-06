import axios from 'axios';
import { normalize } from 'normalizr';
import { searchResultsSchema } from '../schema';
import values from 'lodash/values';
import forEach from 'lodash/forEach';
import routes from '../routes';
import store from '../store/configure_store';
import {
  FETCH_SEARCH_RESULTS,
  FETCH_MORE_SEARCH_RESULTS,
  SET_LAST_SEARCH,
  FETCH_LAST_SEARCH,
  FETCH_SUGGESTIONS,
  ADD_ENTITIES_FULFILLED,
  EXPORT_SEARCH
} from './types';

const VALID_PARAMETERS = ['searchTerms', 'type', 'programFilter', 'systemFilter', 'nsFilter', 'ombFilter',
  'rtFilter', 'sourceFilter', 'categoryFilter', 'preferredFilter', 'statusFilter', 'methodsFilter', 'stageFilter',
  'myStuffFilter', 'mostRecentFilter', 'contentSince', 'page', 'sort', 'groupFilterId', 'ombDate', 'retiredFilter'];

export class SearchParameters {
  constructor(params) {
    VALID_PARAMETERS.forEach((p) => {
      if (params[p] !== undefined) {
        this[p] = params[p];
      }
    });
    this.toSearchParameters = this.toSearchParameters.bind(this);
  }

  toSearchParameters() {
    const simpleMapping = {'searchTerms': 'search', 'type': 'type', 'programFilter': 'programs', 'sort': 'sort', 'groupFilterId': 'groups',
      'rtFilter': 'rt', 'sourceFilter': 'source', 'categoryFilter': 'category', 'preferredFilter': 'preferred', 'statusFilter': 'status',
      'systemFilter': 'systems', 'myStuffFilter': 'mystuff', 'mostRecentFilter': 'mostrecent', 'page': 'page', 'nsFilter': 'nsfilter',
      'methodsFilter': 'methods', 'ombFilter': 'omb', 'retiredFilter': 'retired', 'stageFilter': 'stage'};
    const params = {};
    forEach(simpleMapping, (value, key) => {
      if (this[key]) {
        params[value] = this[key];
      }
    });
    if (this.contentSince) {
      if (this.contentSince.format) {
        params.contentSince = this.contentSince.format('YYYY-MM-DD');
      } else {
        params.contentSince = this.contentSince;
      }
    }
    if (this.ombDate) {
      if (this.ombDate.format) {
        params.ombDate = this.ombDate.format('YYYY-MM-DD');
      } else {
        params.ombDate = this.ombDate;
      }
    }
    return params;
  }
}

export function fetchSearchResults(context, searchParameters) {
  return {
    type: FETCH_SEARCH_RESULTS,
    meta: {context: context},
    payload: axios.get(routes.elasticsearchPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: searchParameters.toSearchParameters()
    }).then((response) => {
      let normalizedData = normalize(response.data.hits.hits, searchResultsSchema);
      unelasticsearchResults(normalizedData.entities);
      // On section edit RS searches shouldn't overwrite questions in redux store
      if(window.location.href.includes('sections/new') && searchParameters.type == 'response_set') {
        delete normalizedData.entities.questions;
      }
      store.dispatch({type: ADD_ENTITIES_FULFILLED, payload: normalizedData.entities});
      return response;
    })
  };
}

export function exportSearch(searchParameters) {
  return {
    type: EXPORT_SEARCH,
    payload: axios.get(routes.elasticsearchExportPath(), {
      headers: {'Accept': 'application/vnd.ms-excel'},
      responseType: 'blob',
      params: searchParameters.toSearchParameters()
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'search_report.xlsx');
      document.body.appendChild(link);
      link.click();
    })};
}

export function fetchLastSearch(context, searchParameters) {
  let params = searchParameters.toSearchParameters();
  params.size = params.page*10;
  delete params.page;
  return {
    type: FETCH_LAST_SEARCH,
    meta: {context: context},
    payload: axios.get(routes.elasticsearchPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params
    }).then((response) => {
      const normalizedData = normalize(response.data.hits.hits, searchResultsSchema);
      unelasticsearchResults(normalizedData.entities);
      store.dispatch({type: ADD_ENTITIES_FULFILLED, payload: normalizedData.entities});
      return response;
    })
  };
}

export function fetchMoreSearchResults(context, searchParameters) {
  return {
    type: FETCH_MORE_SEARCH_RESULTS,
    meta: {context: context},
    payload: axios.get(routes.elasticsearchPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: searchParameters.toSearchParameters()
    }).then((response) => {
      const normalizedData = normalize(response.data.hits.hits, searchResultsSchema);
      unelasticsearchResults(normalizedData.entities);
      store.dispatch({type: ADD_ENTITIES_FULFILLED, payload: normalizedData.entities});
      return response;
    })
  };
}

export function setLastSearch(searchParameters) {
  return {
    type: SET_LAST_SEARCH,
    payload: searchParameters
  };
}

export function fetchPotentialDuplicateQuestions(context, content, description) {
  return {
    type: FETCH_SEARCH_RESULTS,
    meta: {context: context},
    payload: axios.get(routes.elasticsearchDuplicateQuestionsPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { content, description }
    }).then((response) => {
      const normalizedData = normalize(response.data.hits.hits, searchResultsSchema);
      unelasticsearchResults(normalizedData.entities);
      store.dispatch({type: ADD_ENTITIES_FULFILLED, payload: normalizedData.entities});
      return response;
    })
  };
}

export function fetchSuggestions(prefix) {
  return {
    type: FETCH_SUGGESTIONS,
    payload: axios.get(routes.elasticsearchSuggestionsPath(), {
      headers: {'Accept': 'application/json', 'X-Key-Inflection': 'camel'},
      params: { prefix }
    })
  };
}

// Everything in elasticsearch has codes, with code and codeSystem. The models
// expect their own thing ResponseSet.responses, Question.concepts with value
// and codeSystem. This function will transform the elasticsearch results into
// the structure expected by the rest of the react application.
function transformConcepts(items) {
  values(items).forEach((i) => {
    if(i.codes) {
      i.concepts = i.codes;
      delete i.codes;
      i.concepts.forEach((c) => {
        c.value = c.code;
        delete c.code;
      });
    }
  });
}

function unelasticsearchResults(results) {
  if (results.responseSets) {
    values(results.responseSets).forEach((rs) => {
      if(rs.codes) {
        rs.responses = rs.codes;
        delete rs.codes;
        rs.responses.forEach((r) => {
          r.value = r.code;
          delete r.code;
        });
      }
    });
  }
  if (results.questions) {
    transformConcepts(results.questions);
  }
  if (results.sections) {
    transformConcepts(results.sections);
  }
  if (results.surveys) {
    transformConcepts(results.questions);
  }
}
