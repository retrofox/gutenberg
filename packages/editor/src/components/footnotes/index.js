/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import {
	withSelect,
	withDispatch,
} from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { getBlockType } from '@wordpress/blocks';

class BlockList extends Component {
	constructor() {
		super( ...arguments );
		this.updateList = this.updateList.bind( this );
		this.state = {
			order: [],
			selected: null,
		};
	}

	componentDidMount() {
		document.addEventListener( 'selectionchange', this.updateList );
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
		// This is much faster than having to serialize the blocks and search
		// the HTML. Perhaps this should also be debounced.
		const noteAnchors = document.querySelectorAll( '.note-anchor' );
		let selected;
		const order = Array.from( noteAnchors ).map( ( element ) => {
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

	render() {
		const { updateFootnotes } = this.props;
		const { order, selected } = this.state;

		if ( ! order.length ) {
			return null;
		}

		const { edit: BlockEdit } = getBlockType( 'core/footnotes' );
		const attributes = {
			footnotes: order.map( ( id ) => {
				const text = this.props.footnotes[ id ];
				const isSelected = selected === id;
				return { id, text, isSelected };
			} ),
		};
		const setAttributes = ( { footnotes } ) => {
			updateFootnotes( footnotes.reduce( ( acc, footnote ) => {
				return { ...acc, [ footnote.id ]: footnote.text };
			}, {} ) );
		};

		return (
			<BlockEdit
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const {
			getEditorBlocks,
			getFootnotes,
		} = select( 'core/editor' );

		return {
			contentRef: getEditorBlocks(),
			footnotes: getFootnotes(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			updateFootnotes,
		} = dispatch( 'core/editor' );

		return {
			updateFootnotes,
		};
	} ),
] )( BlockList );
