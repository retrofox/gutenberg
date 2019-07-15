/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import {
	withSelect,
	withDispatch,
} from '@wordpress/data';
import { compose } from '@wordpress/compose';

class Edit extends Component {
	constructor() {
		super( ...arguments );
		this.updateList = this.updateList.bind( this );
		this.getAttributes = this.getAttributes.bind( this );
		this.setAttributes = this.setAttributes.bind( this );
		this.state = {
			order: [],
			selected: null,
		};
	}

	componentDidMount() {
		document.addEventListener( 'selectionchange', this.updateList );
		this.updateList();
	}

	componentWillUnmount() {
		document.removeEventListener( 'selectionchange', this.updateList );
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.contentRef === prevProps.contentRef ) {
			return;
		}

		this.updateList();
	}

	updateList() {
		const attributePart = this.props.blockType.name.replace( '/', '-' );
		const attribute = `data-${ attributePart }-id`;

		// This is much faster than having to serialize the blocks and search
		// the HTML. Perhaps this should also be debounced.
		const anchors = document.querySelectorAll( `[${ attribute }]` );
		let selected;
		const order = Array.from( anchors ).map( ( element ) => {
			const id = ( element.getAttribute( 'href' ) || '' ).slice( 1 );

			if (
				document.activeElement.isContentEditable &&
				document.activeElement.contains( element ) &&
				!! element.getAttribute( 'data-rich-text-format-boundary' )
			) {
				selected = id;
			}

			return id;
		} );

		this.setState( { order, selected } );
	}

	getAttributes() {
		const { footnotes } = this.props;
		const { order, selected } = this.state;
		return {
			footnotes: order.map( ( id ) => {
				const text = footnotes[ id ];
				const isSelected = selected === id;
				return { id, text, isSelected };
			} ),
		};
	}

	setAttributes( { footnotes } ) {
		const { updateFootnotes } = this.props;

		updateFootnotes( footnotes.reduce( ( acc, footnote ) => {
			return { ...acc, [ footnote.id ]: footnote.text };
		}, {} ) );
	}

	render() {
		if ( ! this.state.order.length ) {
			return null;
		}

		const { edit: BlockEdit } = this.props.blockType;
		return (
			<BlockEdit
				attributes={ this.getAttributes() }
				setAttributes={ this.setAttributes }
			/>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const { getEditorBlocks, getFootnotes } = select( 'core/editor' );
		return {
			contentRef: getEditorBlocks(),
			footnotes: getFootnotes(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { updateFootnotes } = dispatch( 'core/editor' );
		return { updateFootnotes };
	} ),
] )( Edit );
