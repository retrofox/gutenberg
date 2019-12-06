/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	title: __( 'WC Guatyaquil' ),
	description: __( 'WordCamp Guayaquil 2019 Announcement.' ),
	icon: 'admin-site',
	supports: {
		align: true,
	},
	keywords: [ __( 'wordcamp' ) ],
	edit,
	save,
};
