require 'test_helper'

class ApiResponseSetsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  include ActiveModelSerializers::Test::Schema
  include ActiveModelSerializers::Test::Serializer

  setup do
    @current_user = users(:admin)
    @response_set = response_sets(:one)
    sign_in @current_user
  end

  test 'api should get index' do
    get api_valueSets_url
    assert_response :success
    res = JSON.parse response.body
    current_user_id = @current_user ? @current_user.id : -1
    assert_equal ResponseSet.where("(status='published' OR created_by_id= ?)", current_user_id).count, res.count
    assert_json_schema_response('result_sets/show.json')
  end

  test 'api should show value set' do
    get api_valueSet_url(@response_set.version_independent_id)
    assert_response :success
    assert_serializer 'ValueSetsSerializer'
    assert_json_schema_response('result_sets/show.json')
  end

  test 'api should show value set of specific version' do
    get api_valueSet_url(@response_set.version_independent_id, version: 1)
    assert_response :success
    res = JSON.parse response.body
    assert_equal(res['version'], 1)
  end

  test 'api should 404 on value set that doesnt exist' do
    get api_valueSet_url(99)
    assert_response :not_found
    res = JSON.parse response.body
    assert_equal(res['message'], 'Resource Not Found')
  end

  test 'api should 404 on value set version that doesnt exist' do
    get api_valueSet_url(@response_set.version_independent_id, version: 99)
    assert_response :not_found
    res = JSON.parse response.body
    assert_equal(res['message'], 'Resource Not Found')
  end
end
