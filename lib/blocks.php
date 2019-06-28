<?php
/**
 * Block and style registration functions.
 *
 * @package gutenberg
 */

/**
 * Substitutes the implementation of a core-registered block type, if exists,
 * with the built result from the plugin.
 */
function gutenberg_reregister_core_block_types() {
	// Blocks directory may not exist if working from a fresh clone.
	$blocks_dir = dirname( __FILE__ ) . '/../build/block-library/blocks/';
	if ( ! file_exists( $blocks_dir ) ) {
		return;
	}

	$block_names = array(
		'archives.php'        => 'core/archives',
		'block.php'           => 'core/block',
		'calendar.php'        => 'core/calendar',
		'categories.php'      => 'core/categories',
		'latest-comments.php' => 'core/latest-comments',
		'latest-posts.php'    => 'core/latest-posts',
		'legacy-widget.php'   => 'core/legacy-widget',
		'rss.php'             => 'core/rss',
		'shortcode.php'       => 'core/shortcode',
		'search.php'          => 'core/search',
		'tag-cloud.php'       => 'core/tag-cloud',
	);

	$registry = WP_Block_Type_Registry::get_instance();

	foreach ( $block_names as $file => $block_name ) {
		if ( ! file_exists( $blocks_dir . $file ) ) {
			return;
		}

		if ( $registry->is_registered( $block_name ) ) {
			$registry->unregister( $block_name );
		}

		require $blocks_dir . $file;
	}
}
add_action( 'init', 'gutenberg_reregister_core_block_types' );

/**
 * Registers a new block style.
 *
 * @param string $block_name       Block type name including namespace.
 * @param array  $style_properties Array containing the properties of the style name, label, style (name of the stylesheet to be enqueued), inline_style (string containing the CSS to be added).
 */
function register_block_style( $block_name, $style_properties ) {
	if ( isset( $style_properties['style'] ) ) {
		$style_handle = $style_properties['style'];
		unset( $style_properties['style'] );
		/** This action is documented in wp-admin/admin-footer.php */
		// phpcs:ignore WordPress.NamingConventions.ValidHookName.UseUnderscores
		add_action(
			'enqueue_block_assets',
			function() use ( $style_handle ) {
				wp_enqueue_style( $style_handle );
			},
			30
		);
	}

	if ( isset( $style_properties['inline_style'] ) ) {
		$inline_style = $style_properties['inline_style'];
		unset( $style_properties['inline_style'] );
		add_action(
			'enqueue_block_assets',
			function() use ( $inline_style ) {
				wp_add_inline_style( 'wp-block-library', $inline_style );
			}
		);
	}

	add_action(
		'enqueue_block_assets',
		function() use ( $block_name, $style_properties ) {
			wp_add_inline_script(
				'wp-blocks',
				sprintf(
					implode(
						"\n",
						array(
							'( function() {',
							'	wp.blocks.registerBlockStyle( \'%s\', %s );',
							'} )();',
						)
					),
					$block_name,
					wp_json_encode( $style_properties )
				),
				'after'
			);
		}
	);

}

