/**
 * External dependencies
 */
import { range } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { Toolbar } from '@wordpress/components';
import { AlignmentToolbar } from '@wordpress/block-editor';

class HeadingToolbar extends Component {
	createLevelControl( targetLevel, selectedLevel, onChange ) {
		return {
			icon: 'heading',
			// translators: %s: heading level e.g: "1", "2", "3"
			title: sprintf( __( 'Heading %d' ), targetLevel ),
			isActive: targetLevel === selectedLevel,
			onClick: () => onChange( targetLevel ),
			subscript: String( targetLevel ),
		};
	}

	render() {
		const { minLevel, maxLevel, selectedLevel, onChange, setAttributes, align } = this.props;
		return (
			<>
				<Toolbar controls={ range( minLevel, maxLevel ).map( ( index ) => this.createLevelControl( index, selectedLevel, onChange ) ) } />
				<AlignmentToolbar value={ align } onChange={ ( nextAlign ) => {
					setAttributes( { align: nextAlign } );
				} } />
			</>
		);
	}
}

export default HeadingToolbar;
