require 'test_helper'

class FormsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveModelSerializers::Test::Schema
  include ActiveModelSerializers::Test::Serializer

  setup do
    @form = forms(:one)
    sign_in users(:admin)
  end

  test 'api should show form' do
    get api_form_url(@form)
    assert_response :success
    assert_serializer 'FormSerializer'
    assert_response_schema('forms/show.json')
  end
end