export default function save( { attributes } ) {
	const { footnotes } = attributes;

	if ( ! footnotes.length ) {
		return null;
	}

	return (
		<ol>
			{ footnotes.map( ( { id, text } ) =>
				<li key={ id }>
					<a id={ id } href={ `#${ id }-anchor` }>^</a>
					{ text }
				</li>
			) }
		</ol>
	);
}
