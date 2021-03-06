json.extract! survey, :id, :name, :description, :created_at, :updated_at, :survey_sections, :content_stage, \
              :version_independent_id, :version, :all_versions, :most_recent, :most_recent_published, :concepts, \
              :control_number, :omb_approval_date, :created_by_id, :status, :published_by, :parent, :preferred
json.user_id survey.created_by.email if survey.created_by.present?
json.surveillance_system_id survey.surveillance_system.id if survey.surveillance_system.present?
json.surveillance_program_id survey.surveillance_program.id if survey.surveillance_program.present?
json.url survey_url(survey, format: :json)
