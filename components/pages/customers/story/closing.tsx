import { TheCrmBehindThousands } from "../08-the-crm-behind-thousands";

// Closing block of every customer story: the avatar wall and "The CRM behind
// thousands of companies." call to action, the same one the customers index ends
// with, set under a top rule.
export function StoryClosing() {
  return (
    <div className="border-subtle-stroke border-t">
      <TheCrmBehindThousands />
    </div>
  );
}
