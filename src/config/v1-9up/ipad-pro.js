function classify_distance(dst){
	// The theroy is that with a fixed set of vertices in a grid, or just a fixed set of vertices in general,
	// We can classify each set of vertices as one type of distance.

	// Return early for out of bounds.
	if (dst < 30){ return  ''}
	if (dst > 120){ return ''}

	if (dst < 45){               return 'A' }
	if (dst > 50 && dst < 65){   return 'B' }
	if (dst > 70 && dst < 90){   return 'C' }
	if (dst > 90 && dst < 100){  return 'D' }
	if (dst > 110 && dst < 120){ return 'E' }

	console.warn("Distance was not in any bound", dst);
	return ''
}