<?php
/**
 * Removes all Click2Chat data when the plugin is deleted.
 *
 * @package Click2Chat
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

if ( is_multisite() ) {
	$click2chat_sites = get_sites(
		array(
			'fields' => 'ids',
			'number' => 0,
		)
	);
	foreach ( $click2chat_sites as $click2chat_site_id ) {
		switch_to_blog( $click2chat_site_id );
		delete_option( 'click2chat_settings' );
		restore_current_blog();
	}
} else {
	delete_option( 'click2chat_settings' );
}
