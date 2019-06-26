/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getActiveFormat } from '../get-active-format';
import { getActiveObject } from '../get-active-object';

/**
 * Set of all interactive content tags.
 *
 * @see https://html.spec.whatwg.org/multipage/dom.html#interactive-content
 */
const interactiveContentTags = new Set( [
	'a',
	'audio',
	'button',
	'details',
	'embed',
	'iframe',
	'input',
	'label',
	'select',
	'textarea',
	'video',
] );

/**
 * Formatting restrictions based on the HTML spec.
 */
const restrictions = {
	// https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element
	a: interactiveContentTags,
	// https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element
	button: interactiveContentTags,
	// https://html.spec.whatwg.org/multipage/forms.html#the-label-element
	label: new Set( [ 'label', 'button', 'input', 'meter', 'output', 'progress', 'select', 'textarea' ] ),
};

const FormatEdit = ( { formatTypes, onChange, value, tagName } ) => {
	return (
		<>
			{ formatTypes.map( ( {
				name,
				edit: Edit,
				tagName: formatTagName,
			} ) => {
				if ( ! Edit ) {
					return null;
				}

				if (
					restrictions[ tagName ] &&
					restrictions[ tagName ].has( formatTagName )
				) {
					return null;
				}

				const activeFormat = getActiveFormat( value, name );
				const isActive = activeFormat !== undefined;
				const activeObject = getActiveObject( value );
				const isObjectActive = activeObject !== undefined;

				return (
					<Edit
						key={ name }
						isActive={ isActive }
						activeAttributes={
							isActive ? activeFormat.attributes || {} : {}
						}
						isObjectActive={ isObjectActive }
						activeObjectAttributes={
							isObjectActive ? activeObject.attributes || {} : {}
						}
						value={ value }
						onChange={ onChange }
					/>
				);
			} ) }
		</>
	);
};

export default withSelect(
	( select ) => {
		const { getFormatTypes } = select( 'core/rich-text' );

		return {
			formatTypes: getFormatTypes(),
		};
	}
)( FormatEdit );
