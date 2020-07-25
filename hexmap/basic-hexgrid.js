var rows = 3,
    cols = 9,
    diameter = 100,
    width = diameter,
    height = diameter * .86,
    offset = (diameter / 4.0 - diameter / 100.0) * -1, 
    map = new Array(rows),
    out = document.getElementById('out'),
    coords = [
      [.25, 0],
      [.75, 0],
      [1, .43],
      [.75, .86],
      [.25, .86],
      [0, .43]
    ];

coords = coords.map(function(set) {
  return [set[0] * diameter, set[1] * diameter].join(',');
}).join(' ');

map.fill(0);

map = map.map(function(zero, y) {
  var row = new Array(cols);
  row.fill(0)
  row = row.map(function(tile, x) {
     var margin = (x === 0) ? 0 : offset,
         translate = (x % 2 == 1) ? (height / 2) * -1 : 0;
    
     return `<svg id="tile${x}_${y}" class="hex" xmlns="http://www.w3.org/2000/svg" version="1.1" width="${width}" height="${height}" style="margin-left: ${margin}px; transform: translateY(${translate - 1}px)" xmlns:xlink="http://www.w3.org/1999/xlink">
  			<polygon class="hex" points="${coords}"></polygon>
</svg>`;
  }); 
  console.log(row);
  return `<div class="hex-row" style="height: ${height + 1}px">${row.join('')}</div>`;
});

console.log(map);

out.innerHTML = map.join('\n');

