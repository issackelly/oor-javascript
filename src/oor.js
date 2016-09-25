
// get the (flawed) screenPixel To MillimeterX value.
var calibration = document.createElement('svg');
calibration.style.width = 1;
calibration.style.height = 1;
document.body.appendChild(calibration);
const RATIO = calibration.screenPixelToMillimeterX;
document.removeChild(calibration);

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
	for (i=0, l=evt.touches.length; i < l; i++){
		for (j=i+1; j < l; j++){
			let key = 'v' + touch_map[i][2] + 'v' + touch_map[j][2];
			let distance = distance_between_points( touch_map[i] ,  touch_map[j]);
			let classified = classify_distance(distance);
			if (classified){
				vertices[key] = classified;
			}
		}
	}
	console.log(vertices);

	let obj_key = [];
	for(let key in vertices){
		obj_key.push(vertices[key])
	}
	obj_key = obj_key.sort().join("");
	console.log('obj key', obj_key, obj_key.length);

	if (OBJECTS.hasOwnProperty(obj_key)){
			var event = new CustomEvent('object_recognized', {
				'verticies': verticies,
				'recognition_type': 'touch_pattern',
				'triggering_event': evt,
				'pattern': obj_key,
				'object_name': OBJECTS[obj_key]
			});
			evt.target.dispatchEvent(event)
	} else {
			var event = new CustomEvent('no_object_recognized', {
				'verticies': {},
				'recognition_type': 'touch_pattern',
				'triggering_event': evt,
				'pattern': obj_key,
				'object_name': ''
			});
			evt.target.dispatchEvent(event)
	}
};