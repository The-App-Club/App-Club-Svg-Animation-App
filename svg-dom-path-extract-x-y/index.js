let svg = document.querySelector("#cool-path"),
  pathString = document.querySelector("#pathCubic").getAttribute("d"),
  pathCubic = Snap.path.toCubic(pathString),
  arrayPath = [];
// grab svg and turn it into x & y coords
function setUpPoint(segment) {
  for (let i = 0; i < segment.length; i += 2) {
    //create a new object for the point so it can be passed to the bezier plugin
    let point = {};
    point.x = segment[i];
    point.y = segment[i + 1];
    //add the point to the array
    arrayPath.push(point);
  } //loop end
}

// loop through the curves collection
for (let i = 0; i < pathCubic.length; i++) {
  let segment = pathCubic[i],
    point;
  // 1st element returned in the array is a letter, remove it
  segment.shift();
  //call the function to set up the points based on the segment returned
  point = setUpPoint(segment);
}

console.log(JSON.stringify(arrayPath));
