function classify_distance(dst){
	// The theroy is that with a fixed set of vertices in a grid, or just a fixed set of vertices in general,
	// We can classify each set of vertices as one type of distance.

	// Return early for out of bounds.
	if (dst < 25){ return  ''}
	if (dst > 105){ return ''}

	if (dst < 41){               return 'A' }
	if (dst > 41 && dst < 50){   return 'B' }
	if (dst > 55 && dst < 70){   return 'C' }
	if (dst > 72 && dst < 89){  return 'D' }
	if (dst > 90 && dst < 105){ return 'E' }

	console.warn("Distance was not in any bound", dst);
	return ''
}