/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export default function edit( { attributes, setAttributes } ) {
	const { footnotes } = attributes;

	if ( ! footnotes.length ) {
		return null;
	}

	return (
		<>
			<h2><small>Notes</small></h2>
			{ footnotes.map( ( { id, text, isSelected }, index ) =>
				<ol
					key={ id }
					start={ index + 1 }
					className={ classnames( 'note-list', {
						'is-selected': isSelected,
					} ) }
				>
					<li id={ id }>
						<a
							href={ `#${ id }-anchor` }
							aria-label={ __( 'Back to content' ) }
							onClick={ () => {
								// This is a hack to get the target to focus.
								// The attribute will later be removed when selection is set.
								document.getElementById( `${ id }-anchor` ).contentEditable = 'false';
							} }
						>
							↑
						</a>
						{ ' ' }
						<input
							aria-label={ __( 'Note' ) }
							value={ text || '' }
							onChange={ ( event ) => {
								setAttributes( {
									footnotes: footnotes.map( ( footnote, i ) => {
										if ( i !== index ) {
											return footnote;
										}

										return {
											...footnote,
											text: event.target.value,
										};
									} ),
								} );
							} }
							placeholder={ __( 'Note' ) }
						/>
					</li>
				</ol>
			) }
		</>
	);
}
