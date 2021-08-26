# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GroupShowSerializer do
  fab!(:user) { Fabricate(:user) }
  fab!(:group) { Fabricate(:group, messageable_level: Group::ALIAS_LEVELS[:everyone]) }
  fab!(:group_user) { Fabricate(:group_user, group: group, user: user) }
  fab!(:topic) { Fabricate(:topic) }
  fab!(:post) { Fabricate(:post, topic: topic) }
  fab!(:topic2) { Fabricate(:topic) }
  fab!(:post2) { Fabricate(:post, topic: topic2) }
  let(:guardian) { Guardian.new(user) }
  let(:serializer) { described_class.new(group, scope: guardian) }

  before do
    SiteSetting.assign_enabled = true
    SiteSetting.assign_allowed_on_groups = group.id.to_s
  end

  it "counts assigned users and groups" do
    TopicAssigner.new(topic, user).assign(user)
    expect(serializer.as_json[:group_show][:assignment_count]).to eq(1)

    TopicAssigner.new(topic2, user).assign(group)
    expect(serializer.as_json[:group_show][:assignment_count]).to eq(2)
  end
end
