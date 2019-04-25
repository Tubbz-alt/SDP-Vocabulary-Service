module Api
  class MetricsController < Api::ApplicationController
    respond_to :json

    def index
      metrics_json = {}
      count_q = 0
      # Question.all.map do |q|
      #   if q.sections.count > 1 || (q.sections.count == 1 && ((SectionNestedItem.where(nested_section_id: q.sections.first.id).count + SurveySection.where(section_id: q.sections.first.id).count) > 1))
      #     count_q += 1
      #   end
      # end

      count_rs = 0
      # ResponseSet.all.map do |rs|
      #   if rs.sections.count > 1 || (rs.sections.count == 1 && ((SectionNestedItem.where(nested_section_id: rs.sections.first.id).count + SurveySection.where(section_id: rs.sections.first.id).count) > 1))
      #     count_rs += 1
      #   end
      # end

      count_s = 0
      # Section.all.map do |s|
      #   if s.surveys.count > 1 || ((SectionNestedItem.where(nested_section_id: s.id).count + SurveySection.where(section_id: s.id).count) > 1)
      #     count_s += 1
      #   end
      # end

      user_info = User.all.map { |u| " #{u.email}, Program: #{u.last_program ? u.last_program.name : 'None'}, Sign in Count: #{u.sign_in_count} " }

      sp_count = 0
      sp_names = SurveillanceProgram.all.map do |sp|
        if sp.surveys.count > 0
          sp_count += 1
          sp.name
        end
      end
      sp_names = sp_names.compact

      # Total number of objects in the system
      metrics_json['response_set_count'] = ResponseSet.all.count
      metrics_json['question_count'] = Question.all.count
      metrics_json['section_count'] = Section.all.count
      metrics_json['survey_count'] = Survey.all.count

      # Private objects in the system
      metrics_json['response_set_count_draft'] = ResponseSet.where(status: 'draft').count
      metrics_json['question_count_draft'] = Question.where(status: 'draft').count
      metrics_json['section_count_draft'] = Section.where(status: 'draft').count
      metrics_json['survey_count_draft'] = Survey.where(status: 'draft').count

      # Public objects in the system
      metrics_json['response_set_count_published'] = ResponseSet.where(status: 'published').count
      metrics_json['question_count_published'] = Question.where(status: 'published').count
      metrics_json['section_count_published'] = Section.where(status: 'published').count
      metrics_json['survey_count_published'] = Survey.where(status: 'published').count

      # Number of objects being reused (i.e. if the same question is used on 5 surveys it counts as 1 question being reused)
      metrics_json['response_set_count_reused'] = count_rs
      metrics_json['question_count_reused'] = count_q
      metrics_json['survey_count_reused'] = count_s

      # Extensions
      metrics_json['response_set_count_extensions'] = ResponseSet.where.not(parent_id: nil).count
      metrics_json['question_count_extensions'] = Question.where.not(parent_id: nil).count
      metrics_json['section_count_extensions'] = Section.where.not(parent_id: nil).count
      metrics_json['survey_count_extensions'] = Survey.where.not(parent_id: nil).count

      # Preferred
      metrics_json['response_set_count_extensions'] = ResponseSet.where(preferred: true).count
      metrics_json['question_count_preferred'] = Question.where(preferred: true).count

      # OMB Approved Survey Count
      metrics_json['omb_approved_survey_count'] = Survey.all.select { |s| s.control_number.present? }.compact.count

      # Number of groups
      metrics_json['group_all_count'] = Group.all.count

      # Duplicates Replaced
      rs_sum = 0
      q_sum = 0
      ResponseSet.where.not(duplicates_replaced_count: 0).each { |rs| rs_sum += rs.duplicates_replaced_count }
      Question.where.not(duplicates_replaced_count: 0).each { |q| q_sum += q.duplicates_replaced_count }
      # metrics << "\nResponse Sets: #{rs_sum}"
      metrics_json['response_set_all_count'] = rs_sum
      # metrics << "\nQuestions: #{q_sum}"
      metrics_json['question_all_count'] = q_sum

      render json: metrics_json
    end
  end
end
