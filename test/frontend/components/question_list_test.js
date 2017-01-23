import { expect, renderComponent } from '../test_helper';
import QuestionList from '../../../webpack/components/QuestionList';
import routes from '../mock_routes';

describe('QuestionList', () => {
  let component;

  beforeEach(() => {
    const questions = [{id: 1, content: "Is this a question?", questionType: ""},
                      {id: 2, content: "Whats your name", questionType: ""},
                      {id: 3, content: "What is a question?", questionType: ""}];
    component = renderComponent(QuestionList, {questions, routes});
  });

  it('should create list of questions', () => {
    expect(component.find("div[class='question-group']").length).to.equal(3);
  });

});