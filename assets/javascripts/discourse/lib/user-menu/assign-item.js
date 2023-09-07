import UserMenuBaseItem from "discourse/lib/user-menu/base-item";
import { postUrl } from "discourse/lib/utilities";
import { htmlSafe } from "@ember/template";
import { emojiUnescape } from "discourse/lib/text";
import I18n from "I18n";

const ICON = "user-plus";
const GROUP_ICON = "group-plus";

export default class UserMenuAssignItem extends UserMenuBaseItem {
  constructor({ assign }) {
    super(...arguments);
    this.assign = assign;
    this.indirectlyAssignedTo = Object.values(
      this.assign.indirectly_assigned_to || {}
    )[0]?.assigned_to;
    this.assignedToGroup =
      this.assign.assigned_to_group ||
      this.indirectlyAssignedTo?.assign_icon === GROUP_ICON;
    this.postOrTopic = this.indirectlyAssignedTo ? "post" : "topic";
  }

  get className() {
    return "assign";
  }

  get linkHref() {
    return postUrl(
      this.assign.slug,
      this.assign.id,
      (this.assign.last_read_post_number || 0) + 1
    );
  }

  get linkTitle() {
    if (this.assignedToGroup) {
      return I18n.t(`user.assigned_to_group.${this.postOrTopic}`, {
        group_name:
          this.indirectlyAssignedTo?.name ||
          this.assign.assigned_to_group.full_name ||
          this.assign.assigned_to_group.name,
      });
    }
    return I18n.t(`user.assigned_to_you.${this.postOrTopic}`);
  }

  get icon() {
    if (this.assignedToGroup) {
      return GROUP_ICON;
    }
    return ICON;
  }

  get label() {
    return null;
  }

  get description() {
    return htmlSafe(emojiUnescape(this.assign.fancy_title));
  }

  get topicId() {
    return this.assign.id;
  }
}
