require "test_helper"

class HelloControllerTest < ActionDispatch::IntegrationTest
  test "should get react" do
    get hello_react_url
    assert_response :success
  end
end
