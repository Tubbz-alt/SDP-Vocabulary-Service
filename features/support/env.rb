# IMPORTANT: This file is generated by cucumber-rails - edit at your own peril.
# It is recommended to regenerate this file in the future when you upgrade to a
# newer version of cucumber-rails. Consider adding your own code to a new file
# instead of editing this one. Cucumber will automatically load all features/**/*.rb
# files.
require 'simplecov'
require 'cucumber/rails'

require 'capybara/cucumber'
require 'capybara/accessible'

require 'axe/cucumber/step_definitions'

require_relative '../../test/elastic_helpers'
FakeWeb.register_uri(:any, %r{http://example\.com:9200/}, body: '{}', content_type: 'application/json')

FakeWeb.register_uri(:any, %r{http://concept-manager\..*\.xip\.io}, body: '{}')

Capybara.register_driver :chrome do |app|
  driver =  Capybara::Selenium::Driver.new(app, browser: :chrome)
  adaptor = Capybara::Accessible::SeleniumDriverAdapter.new
  window = driver.browser.manage.window
  window.resize_to(1280, 800)
  Capybara::Accessible.setup(driver, adaptor)
end

Before do
  load File.dirname(__FILE__) + '/../../db/seeds.rb'
end

AfterStep do
  sleep(ENV['PAUSE'].to_i || 0)
end

# Print console.log messages if you are trying to figure out JS issues
if ENV['JS_DEBUG']
  class DriverJSError < StandardError; end
  AfterStep do
    errors = page.driver.console_messages
    if errors.present?
      message = errors.map { |m| m[:message] unless m[:message].include?('%c') }.select(&:present?).join("\n")
      puts message
    end
  end
end

Capybara.default_driver = :chrome
Capybara.javascript_driver = :chrome

if ENV['HEADLESS']
  require 'headless'
  require 'capybara/webkit'
  Capybara::Webkit.configure do |config|
    config.block_unknown_urls
    config.allow_url('fonts.googleapis.com')
    config.skip_image_loading
  end

  module Capybara
    module Accessible
      class WebkitDriverAdapter
        def modal_dialog_present?(_driver)
          # driver.alert_messages.any?
          false
        end
      end
    end
  end

  Capybara.register_driver :accessible_webkit2 do |app|
    driver = Capybara::Webkit::Driver.new(app, Capybara::Webkit::Configuration.to_hash)
    adaptor = Capybara::Accessible::WebkitDriverAdapter.new
    Capybara::Accessible.setup(driver, adaptor)
  end

  headless = Headless.new
  headless.start

  Capybara.default_driver = :accessible_webkit2
  Capybara.javascript_driver = :acessible_webkit2

end

Capybara.default_max_wait_time = 5

# By default, any exception happening in your Rails application will bubble up
# to Cucumber so that your scenario will fail. This is a different from how
# your application behaves in the production environment, where an error page will
# be rendered instead.
#
# Sometimes we want to override this default behaviour and allow Rails to rescue
# exceptions and display an error page (just like when the app is running in production).
# Typical scenarios where you want to do this is when you test your error pages.
# There are two ways to allow Rails to rescue exceptions:
#
# 1) Tag your scenario (or feature) with @allow-rescue
#
# 2) Set the value below to true. Beware that doing this globally is not
# recommended as it will mask a lot of errors for you!
#
ActionController::Base.allow_rescue = false

# Remove/comment out the lines below if your app doesn't have a database.
# For some databases (like MongoDB and CouchDB) you may need to use :truncation instead.
begin
  DatabaseCleaner.strategy = :truncation
rescue NameError
  raise 'You need to add database_cleaner to your Gemfile (in the :test group) if you wish to use it.'
end

# You may also want to configure DatabaseCleaner to use different strategies for certain features and scenarios.
# See the DatabaseCleaner documentation for details. Example:
#
#   Before('@no-txn,@selenium,@culerity,@celerity,@javascript') do
#     # { :except => [:widgets] } may not do what you expect here
#     # as Cucumber::Rails::Database.javascript_strategy overrides
#     # this setting.
#     DatabaseCleaner.strategy = :truncation
#   end
#
#   Before('~@no-txn', '~@selenium', '~@culerity', '~@celerity', '~@javascript') do
#     DatabaseCleaner.strategy = :transaction
#   end
#

# Possible values are :truncation and :transaction
# The :transaction strategy is faster, but might give you threading problems.
# See https://github.com/cucumber/cucumber-rails/blob/master/features/choose_javascript_database_strategy.feature
Cucumber::Rails::Database.javascript_strategy = :truncation

module CustomWorld
  def get_user(email)
    user = User.find_by(email: email)
    if user
      return user
    else
      return User.create_with(password: 'password').find_or_create_by(email: email)
    end
  end
end
World(CustomWorld)
