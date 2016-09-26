// get the (flawed) screenPixel To MillimeterX value.
var calibration = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
calibration.style.position = 'absolute';
calibration.style.top = -1;
calibration.style.height = 1;
calibration.style.width = 1;
document.body.appendChild(calibration);
const RATIO = calibration.screenPixelToMillimeterX ? (calibration.screenPixelToMillimeterX) : 0.2645833194255829;
//document.body.removeChild(calibration);

//Default distance classification
function _classify_distance(dst){
	// The theroy is that with a fixed set of vertices in a grid, or just a fixed set of vertices in general,
	// We can classify each set of vertices as one type of distance.

	if (A_DISTANCE == null) {
		A_DISTANCE = 37;
		console.log("You're using an undefined A_DISTANCE, we set it to ", A_DISTANCE, " but you probably don't want that.")
	}

	const b_distance = A_DISTANCE * Math.sqrt(2);
	const c_distance = 2 * A_DISTANCE;
	const d_distance = A_DISTANCE * Math.sqrt(5);
	const e_distance = 2 * b_distance;

	if (MARGIN == null){
		MARGIN = 7;
		console.log("You're using an undefined A_DISTANCE, we set it to ", A_DISTANCE, " but you probably don't want that.")
	}

	// Return early for out of bounds.
	if (dst < (A_DISTANCE - MARGIN)){ return  ''}
	if (dst > (e_distance + MARGIN)){ return ''}

	if (dst < (A_DISTANCE + MARGIN)){               return 'A' }
	if (dst > (b_distance - MARGIN) && dst < (b_distance + MARGIN)){   return 'B' }
	if (dst > (c_distance - MARGIN) && dst < (c_distance + MARGIN)){   return 'C' }
	if (dst > (d_distance - MARGIN) && dst < (d_distance + MARGIN)){   return 'D' }
	if (dst > (e_distance - MARGIN) && dst < (e_distance + MARGIN)){   return 'E' }

	console.warn("Distance was not in any bound", dst);
	return ''
}


if(typeof(classify_distance) == "undefined"){
	console.log("Using default distance classification, which may not be what you want if a better classifier is available");
	classify_distance = _classify_distance
}




function distance_between_points(p1, p2) {
	return Math.abs(Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]))) * RATIO;
}

function sort_by_distance(location, arrayOfPoints) {
	arrayOfPoints.sort(function (a, b) {
		a.distance = distance_between_points(location, a);
		b.distance = distance_between_points(location, b);

		return a.distance - b.distance;
	});

	return arrayOfPoints;
}

var process_touches = function(evt){
	var touch_map = [];
	var i, j, l;
	for (i=0, l=evt.touches.length; i < l; i++){
		touch_map.push([evt.touches[i].screenX, evt.touches[i].screenY, evt.touches[i].identifier]);
	}

	touch_map.sort(function(a, b){
		return a[2] - b[2]
	});
	var vertices = {};
	var distances = {};
	for (i=0, l=evt.touches.length; i < l; i++){
		for (j=i+1; j < l; j++){
			let key = 'v' + touch_map[i][2] + 'v' + touch_map[j][2];
			let distance = distance_between_points( touch_map[i] ,  touch_map[j]);
			let classified = classify_distance(distance);
			distances[key] = distance;
			if (classified){
				vertices[key] = classified;
			}
		}
	}
	console.log('touch_map', touch_map, 'distances', distances, 'vertices', vertices);

	let obj_key = [];
	for(let key in vertices){
		obj_key.push(vertices[key])
	}
	obj_key = obj_key.sort().join("");
	console.log('obj key', obj_key, obj_key.length);

	if (OBJECTS.hasOwnProperty(obj_key)){
			var event = new CustomEvent('object_recognized', {detail: {
				'verticies': vertices,
				'recognition_type': 'touch_pattern',
				'triggering_event': evt,
				'pattern': obj_key,
				'object_name': OBJECTS[obj_key]
			}});
			evt.target.dispatchEvent(event)
	} else {
			var event = new CustomEvent('no_object_recognized', {detail: {
				'verticies': {},
				'recognition_type': 'touch_pattern',
				'triggering_event': evt,
				'pattern': obj_key,
				'object_name': ''
			}});
			evt.target.dispatchEvent(event)
	}
};