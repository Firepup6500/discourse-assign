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
    this.indirectly_assigned_to = Object.values(
      this.assign.indirectly_assigned_to || {}
    )[0]?.assigned_to;
    this.assigned_to_group =
      this.assign.assigned_to_group ||
      this.indirectly_assigned_to?.assign_icon === GROUP_ICON;
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
    if (this.assigned_to_group) {
      return I18n.t("user.assigned_to_group", {
        group_name:
          this.indirectly_assigned_to?.name ||
          this.assign.assigned_to_group.full_name ||
          this.assign.assigned_to_group.name,
      });
    } else {
      return I18n.t("user.assigned_to_you");
    }
  }

  get icon() {
    if (this.assigned_to_group) {
      return GROUP_ICON;
    } else {
      return ICON;
    }
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
