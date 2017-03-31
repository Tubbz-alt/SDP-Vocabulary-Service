include ActiveModel::Serialization

class ESResponseSetSerializer < ActiveModel::Serializer
  attribute :id
  attribute :name
  attribute :version_independent_id
  attribute :version
  attribute :status
  attribute :category
  attribute :description
  attribute :updated_at, key: :updatedAt
  attribute :created_at, key: :createdAt
  attribute :suggest
  attribute :updated_by, key: :updatedBy
  attribute :created_by, key: :createdBy
  attribute :questions
  attribute :codes

  def codes
    object.responses.collect { |c| CodeSerializer.new(c).as_json }
  end

  def updated_at
    object.updated_at.as_json if object.updated_at
  end

  def created_at
    object.created_at.as_json if object.created_at
  end

  def questions
    object.questions.collect do |q|
      { id: q.id, name: q.content }
    end
  end

  def suggest
    object.name
  end

  def category
  end

  def updated_by
    UserSerializer.new(object.updated_by).as_json if object.updated_by
  end

  def created_by
    UserSerializer.new(object.created_by).as_json if object.created_by
  end

  def surveillance_programs
    object.surveillance_programs.collect { |sp| { id: sp.id, name: sp.name } }
  end

  def surveillance_systems
    object.surveillance_systems.collect { |ss| { id: ss.id, name: ss.name } }
  end
end
