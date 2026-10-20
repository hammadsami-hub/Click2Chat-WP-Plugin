<?php
/**
 * Plugin Name:       Click2Chat
 * Plugin URI:        https://hammadsami.com
 * Description:       A lightweight floating WhatsApp chat button with 5 modern designs, a welcome popup, per-device responsive settings and a live-preview admin dashboard.
 * Version:           1.0.0
 * Requires at least: 5.6
 * Requires PHP:      7.2
 * Author:            Hammad Sami
 * Author URI:        https://hammadsami.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       click2chat
 * Domain Path:       /languages
 *
 * @package Click2Chat
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'CLICK2CHAT_VERSION', '1.0.0' );
define( 'CLICK2CHAT_FILE', __FILE__ );
define( 'CLICK2CHAT_DIR', plugin_dir_path( __FILE__ ) );
define( 'CLICK2CHAT_URL', plugin_dir_url( __FILE__ ) );

require_once CLICK2CHAT_DIR . 'includes/class-click2chat-settings.php';
require_once CLICK2CHAT_DIR . 'includes/class-click2chat-frontend.php';

if ( is_admin() ) {
	require_once CLICK2CHAT_DIR . 'includes/class-click2chat-admin.php';
}

/**
 * Add default settings on activation (never overwrites existing settings).
 */
function click2chat_activate() {
	if ( false === get_option( Click2Chat_Settings::OPTION, false ) ) {
		add_option( Click2Chat_Settings::OPTION, Click2Chat_Settings::defaults() );
	}
}
register_activation_hook( __FILE__, 'click2chat_activate' );

/**
 * Boot the plugin.
 */
function click2chat_init() {
	Click2Chat_Settings::init();
	new Click2Chat_Frontend();

	if ( is_admin() ) {
		new Click2Chat_Admin();
	}
}
add_action( 'plugins_loaded', 'click2chat_init' );
