class QuestionsController < ApplicationController
  load_and_authorize_resource except: [:usage]
  before_action :set_paper_trail_whodunnit

  def info_for_paper_trail
    comment = request.params[:comment] || ''
    association_changes = request.params[:association_changes] || {}
    { comment: comment, associations: association_changes }
  end

  # GET /questions.json
  def index
  end

  # GET /questions/1
  # GET /questions/1.json
  def show
  end

  def link_response_sets(params)
    @response_sets = ResponseSet.where(id: params[:linked_response_sets])
    @question.response_sets << @response_sets
  end

  def assign_author
    # Populating author field
    @question.created_by = current_user
    @question.updated_by = current_user
  end

  # POST /questions
  # POST /questions.json
  def create
    @question = Question.new(question_params)
    link_response_sets(params)

    if @question.all_versions.count >= 1
      if @question.not_owned_or_in_group?(current_user) || @question.prev_not_owned_or_in_group?(current_user)
        render(json: @question.errors, status: :unauthorized) && return
      elsif @question.all_versions.last.status == 'draft'
        render(json: @question.errors, status: :unprocessable_entity) && return
      end
      @question.version = @question.most_recent + 1
    end
    assign_author
    if @question.save
      render :show, status: :created, location: @question
    else
      # @categories = Category.all
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  def update_response_sets(params)
    @response_sets = ResponseSet.where(id: params[:linked_response_sets])
    @question.response_sets.destroy_all
    @question.response_sets << @response_sets
  end

  # PATCH/PUT /questions/1/publish
  def publish
    if @question.status == 'draft'
      if @current_user.publisher?
        @question.publish(@current_user)
        render :show, status: :ok, location: @question
      else
        render json: @question, status: :forbidden
      end
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /questions/1/retire
  def retire
    if @question.status == 'published'
      if @current_user.publisher?
        @question.retire
        render :show, status: :ok, location: @question
      else
        render json: @question, status: :forbidden
      end
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  def update_stage
    if ['Published', 'Draft', 'Comment Only', 'Trial Use'].include?(params[:stage])
      @question.update_stage(params[:stage])
      render :show
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  def add_to_group
    group = Group.find(params[:group])
    if current_user.groups.include?(group)
      @question.add_to_group(params[:group])
      render :show
    else
      render json: { msg: 'Error adding item - you do not have permissions in that group' }, status: :unprocessable_entity
    end
  end

  def remove_from_group
    group = Group.find(params[:group])
    if current_user.groups.include?(group)
      @question.remove_from_group(params[:group])
      render :show
    else
      render json: { msg: 'Error adding item - you do not have permissions in that group' }, status: :unprocessable_entity
    end
  end

  def mark_as_duplicate
    @question.mark_as_duplicate(Question.find(params[:replacement]))
    if @question.section_nested_items.count == 0
      q = Question.find(@question.id)
      q.destroy
      render json: Survey.find(params[:survey]).potential_duplicates(current_user), status: :ok
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  def link_to_duplicate
    @question.link_to_duplicate(params[:replacement])
    if @question.save!
      render json: Survey.find(params[:survey]).potential_duplicates(current_user), status: :ok
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  def mark_as_reviewed
    @question.curated_at = Time.current
    if @question.save!
      render json: Survey.find(params[:survey]).potential_duplicates(current_user), status: :ok
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  def all_dupes
    render json: @question.potential_duplicates(current_user, date_filter: true)
  rescue
    render json: @question.errors, status: :unprocessable_entity
  end

  def qrs_link
    rid = nil
    if params[:type] == 'survey'
      surv = Survey.find(params[:sid])
      surv.sections.each do |s|
        s.flatten_questions.each do |sni|
          rid = sni.response_set_id if sni.question_id == @question.id
          break if rid
        end
        break if rid
      end
    else
      sni = SectionNestedItem.where(section_id: params[:sid], question_id: @question.id)
      rid = sni[0].response_set_id if sni[0]
    end
    render json: rid
  end

  # PATCH/PUT /questions/1
  # PATCH/PUT /questions/1.json
  def update
    if @question.status == 'published' || @question.version_independent_id != question_params[:version_independent_id]
      render json: @question.errors, status: :unprocessable_entity
    else
      @question.minor_change_count += 1 if params[:unsaved_state]
      update_response_sets(params)
      @question.update_concepts('Question')
      @question.updated_by = current_user
      if @question.update(question_params)
        @question.groups.each do |group|
          @question.add_to_group(group.id)
        end
        render :show, status: :ok, location: @question
      else
        @categories = Category.all
        render json: @question.errors, status: :unprocessable_entity
      end
    end
  end

  def update_tags
    @question.tag_list = params['tag_list']
    if params['tag_list'] && @question.save!
      render :show, status: :ok, location: @question
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  def usage
    @question = Question.find(params[:id])
    if @question.status != 'published'
      render(json: { error: 'Only published Questions provide usage information' }, status: :bad_request)
    else
      response = { id: @question.id }
      response[:surveillance_programs] = @question.surveillance_programs.map(&:name)
      response[:surveillance_systems]  = @question.surveillance_systems.map(&:name)
      render json: response
    end
  end

  def parent_items
    response = { id: @question.id }
    response[:parent_items] = @question.parent_items
    render json: response
  rescue
    render json: [{ error: 'Error fetching parent items' }]
  end

  # DELETE /questions/1
  # DELETE /questions/1.json
  def destroy
    if @question.status == 'draft'
      if params[:cascade] == 'true'
        @question.cascading_action do |element|
          # Original item for deletion can be used elsewhere, children must not be reused
          element.destroy if element.status == 'draft' && (element.exclusive_use? || element == @question)
        end
      end
      @question.destroy
      render json: @question
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  private

  # Never trust parameters from the scary internet, only allow the white list through.
  def question_params
    params.require(:question).permit(:content, :response_type_id, :parent_id, :category_id, :groups,
                                     :version_independent_id, :description, :other_allowed, :subcategory_id,
                                     concepts_attributes: [:id, :value, :display_name, :code_system],
                                     data_collection_methods: [], tag_list: [])
  end
end
