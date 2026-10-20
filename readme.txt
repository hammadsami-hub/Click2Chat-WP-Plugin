=== Click2Chat ===
Contributors: hammadsami
Tags: whatsapp, click to chat, chat button, floating button, contact
Requires at least: 5.6
Tested up to: 6.8
Requires PHP: 7.2
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Lightweight floating WhatsApp chat button with 5 designs, welcome popup, per-device responsive settings and a live-preview dashboard.

== Description ==

**Click2Chat** adds a fast, accessible, fully customizable WhatsApp button to your website so visitors can start a conversation with one tap. It uses no tracking, no external scripts and no jQuery on the front end: just a tiny stylesheet and ~2 KB of vanilla JavaScript.

= Features =

* **5 modern button designs:** Classic Circle, Pill with Text, Rounded Square, Outline Pill and Gradient Glow.
* **Custom colors, icons, sizes and text:** choose from built-in icons (WhatsApp, chat bubble, message, support, paper plane) or upload your own image.
* **Flexible positioning:** left, center or right combined with top, middle or bottom, plus horizontal and vertical offsets.
* **Separate settings for desktop, tablet and mobile:** visibility, position, size, offsets and text label per device.
* **Your WhatsApp number, welcome message and pre-filled chat message:** the pre-filled text supports the `{page_title}`, `{page_url}` and `{site_name}` placeholders.
* **Welcome popup:** a friendly chat card with your team name, a welcome bubble and a "Start chat" button. Optional auto-open once per visit.
* **Animations you control:** pulse ring, bounce, shake or float, plus a hover effect. Automatically disabled for visitors who prefer reduced motion.
* **Professional dashboard:** tabbed settings with a **live preview** (desktop / tablet / mobile) that updates as you type.
* **Display rules:** choose where the button appears, hide it on specific page IDs, hide it for logged-in users, or delay its appearance.
* **Shortcode:** `[click2chat text="Ask us on WhatsApp" message="Hi!"]` places an inline button anywhere.
* **Works with Elementor and popular themes:** high-specificity, prefixed CSS; hidden automatically inside the Elementor editor canvas.
* **Accessible:** keyboard operable, visible focus states, ARIA attributes, Escape key closes the popup.
* **Developer friendly:** filters `click2chat_should_display` and `click2chat_breakpoints`, and JavaScript events `click2chat:open`, `click2chat:close`, `click2chat:click`.

= External service =

When a visitor clicks the button (or the "Start chat" button in the popup), they are sent to WhatsApp using the official `https://wa.me/` link, which is a service provided by WhatsApp LLC / Meta Platforms, Inc.

* Nothing is sent to WhatsApp or anyone else until the visitor clicks.
* The data included in the link is the phone number and the pre-filled message you configured.
* WhatsApp Terms of Service: https://www.whatsapp.com/legal/terms-of-service
* WhatsApp Privacy Policy: https://www.whatsapp.com/legal/privacy-policy

Click2Chat is an independent plugin and is not affiliated with, endorsed by or sponsored by WhatsApp or Meta.

== Installation ==

1. Upload the `click2chat` folder to `/wp-content/plugins/`, or install the ZIP via **Plugins → Add New → Upload Plugin**.
2. Activate **Click2Chat** through the **Plugins** screen.
3. Go to **Click2Chat** in the admin menu.
4. Enter your WhatsApp number (country code first, digits only) and save.
5. Customize the design and position, then visit your website to test the button.

== Frequently Asked Questions ==

= What format should the WhatsApp number be in? =

Use the full international number with the country code, digits only: no plus sign, spaces, dashes or leading zeros. For example, `14155550123`.

= The button does not appear on my site. =

Check that the plugin is enabled and a number is saved, that the current page type is allowed in **Display Rules**, that the page ID is not excluded, and that the button is visible for the current device in **Position & Responsive**. If you use a caching plugin, clear the cache after saving.

= Why is the default button teal instead of WhatsApp green? =

The default colors were chosen to meet WCAG AA contrast for white text and icons. You can use WhatsApp's brand green (#25D366) in **Design → Colors**, but pair it with a dark icon/text color for readable contrast.

= Can I show different sizes or positions on mobile? =

Yes. The **Position & Responsive** tab has separate settings for desktop, tablet and mobile.

= Does it work with Elementor? =

Yes. The floating button is added to the page footer and works with any Elementor page or theme. You can also place an inline button using the `[click2chat]` shortcode inside an Elementor Shortcode widget.

= Can I add the pre-filled message with the page title or URL? =

Yes. Use `{page_title}`, `{page_url}` and `{site_name}` in the pre-filled message.

= Does it slow down my site? =

No. The front end loads one small CSS file and one small deferred vanilla JavaScript file, and nothing else. There are no external requests until a visitor clicks.

= Is the plugin GDPR friendly? =

Click2Chat does not set cookies, collect data or contact third parties on page load. Clicking the button opens WhatsApp, which has its own privacy policy.

= How do I remove all plugin data? =

Deleting the plugin from the **Plugins** screen removes its saved settings from the database.

== Screenshots ==

1. General settings with WhatsApp number, messages and welcome popup options.
2. Design tab with five button styles, icons, colors and animations.
3. Position & Responsive tab with separate desktop, tablet and mobile settings.
4. Live preview with device switcher and popup preview.

== Changelog ==

= 1.0.0 =
* Initial release.

== Upgrade Notice ==

= 1.0.0 =
First release of Click2Chat.
