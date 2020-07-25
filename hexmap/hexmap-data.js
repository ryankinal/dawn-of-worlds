var rows = 90,
	cols = 150,
	landRatio = 0.90,
	diameter = 100,
	minSize = 25,
	maxSize = 25,
	minRow = 2,
	maxRow = rows - (rows * 0.4),
	width = diameter,
    height = diameter * .86,
    offset = (diameter / 4.0 - diameter / 100.0) * -1, 
	start = [Math.floor(Math.random() * (cols - 1)) + 1, Math.floor(Math.random() * (rows - 1)) + 1],
	mapData = new Array(rows),
	continentData = [],
	coords = [
		[.25, 0],
		[.75, 0],
		[1, .43],
		[.75, .86],
		[.25, .86],
		[0, .43]
	],
	processing = [],
	adjacentPoints = [
      [
        [-1, 0],
        [0, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1]
      ],
      [
        [-1, -1],
        [0, -1],
        [1, -1],
        [1, 0],
        [0, 1],
        [-1, 0]
      ]
    ];

coords = coords.map(function(set) {
	return [set[0] * diameter, set[1] * diameter].join(',');
}).join(' ');

mapData = mapData.fill(0).map(function(d, y) {
	var row = new Array(cols);

	row = row.fill(0).map(function(d, x) {
		return {
			base: 'water',
			x: x,
			y: y
		};
	});

	return row;
});

function getAdjacentTiles(point, extension)  {
	if (typeof extension === 'undefined') {
		extension = 0;
	}

	return getAdjacentPoints(point, extension).map(function(pt) {
		return getTile(pt);
	});
}


function getAdjacentPoints(currentPoint, extension) {
	if (typeof extension === 'undefined') {
		extension = 0;
	}

	try {
		var points = adjacentPoints[Math.abs(currentPoint[0] % 2)].map(function(point) {
				var nextX = currentPoint[0] + point[0],
					nextY = currentPoint[1] + point[1];

				return [nextX, nextY];
			});
	} catch (e) {
		debugger;
	}
	

	if (extension > 0) {
		return points.map(function(point) {
				return getAdjacentPoints(point, extension - 1)
			}).reduce(function(a, b) {
				return a.concat(b);
			}, []).filter(function(pt, index, self) {
				return self.indexOf(pt) === index;
			});
	} else {
		return points;
	}
}

function getTile(point) {
	var xInBounds = !!(point[0] < cols && point[0] >= 0),
		yInBounds = !!(point[1] < rows && point[1] >= 0);

	return (xInBounds && yInBounds) ? mapData[point[1]][point[0]] : null;
}

function getPercentLand(modifier) {
	if (typeof modifier === 'undefined') {
		modifier = 0;
	}

	var numerator = mapData.map(function(row) {
			return row.map(function(cell) {
				return cell.base === 'land' ? 1 : 0;
			}).reduce(function(a, b) {
				return a + b;
			}, 0);
		}).reduce(function(a, b) {
			return a + b;
		}, 0),
		denominator = (rows * cols);

	numerator += modifier;

	return numerator / denominator;
}

function buildContinentFromPoint(point, continents, maxSize, minSize) {
	var x = point[0],
		y = point[1],
		maxLength = Math.sqrt(maxSize * maxSize * 2),
		length = Math.floor(Math.random() * 2) + 1,
		halfway = false,
		offset = 0,
		tile,
		point,
		edges = [],
		landPoints = [],
		iterations = 0;

	if (typeof continents === 'undefined') {
		continents = 1;
	}

	do {
		let startTile = getTile([x, y]),
			previousTile = getTile([x - 1, y]),
			rightEdge = null;

		while (x < cols - 1 && ((startTile && startTile.base === 'land') || (previousTile && previousTile.base === 'land'))) {
			x++;
			startTile = getTile([x, y]);
			previousTile = getTile([x - 1, y]);
		}

		edges.push([x, y]);
		rightEdge = [x, y];

		for (let i = 0; i < length; i++) {
			if (x + i < cols - 1 && x + i > 0) {
				let point = [x + i, y];
				let tile = getTile(point);
				let nextTile = getTile([x + i + 1, y]);

				if (tile && nextTile && nextTile.base !== 'land') {
					landPoints.push(point);
					rightEdge = [x, y];
				}
			} else if (x + i >= cols - 1) {
				halfway = true;
			}
		}
		
		edges.push(rightEdge);

		offset = Math.floor(Math.random() * 3) - 1;

		if (halfway) {
			length = Math.max(length - 2 + Math.floor(Math.random() * 3) - 1, Math.abs(offset - 1));
			x = x + 1 + offset;
		} else {
			length = length + 2 + Math.floor(Math.random() * 3) - 1;

			if (length < 1) {
				length = 1;
			} else if (length >= maxLength) {
				offset += (length - maxLength) / 2;
			}

			x = x - 1 + offset;
		}

		if (length > maxLength || landPoints.length > maxSize / 3) {
			halfway = true;
		}

		y++;

		if (x < 1) {
			halfway = true;
		}

		console.log(x, y, length, halfway);
	} while (getPercentLand(landPoints.length) < landRatio && landPoints.length < maxSize && length > 0 && y > 0 && y < rows);

	console.log(landPoints);

	continentData.push(landPoints);

	landPoints.forEach(function(pt) {
		var tile = getTile(pt);
		tile.base = 'land'
		tile.continent = continentData.length;
	});

	makeBays(edges);

	continents--;

	if (continents && getPercentLand() < landRatio) {
		let tries = 0;

		do {
			randomPoint = getRandomPoint();
			randomTile = getTile(randomPoint);
			tries++;
		} while (tries < 5 && (randomTile.base !== 'water' || randomPoint[1] < minRow || randomPoint[1] > maxRow));

		buildContinentFromPoint(randomPoint, continents, maxSize, minSize);
	}
}

function makeBays(edges) {
	var radius = Math.floor(Math.random() * edges.length / 200) + 1,
		edgeCount = Math.floor(Math.random() * edges.length / 15) + 1;

	while (edgeCount) {
		let edge = edges[Math.floor(Math.random() * edges.length)],
			startTile = getTile(edge);

		if (startTile) {
			getTile(edge).base = 'water';

			getAdjacentTiles(edge, radius).forEach(function(tile) {
				if (tile && tile.base === 'land') {
					tile.base = 'water';	
				}
			});

			edgeCount--;
		}
	}
}

function connectWater() {
	var points = [];

	mapData.forEach(function(row, y) {
		row.filter(function(cell) {
			return cell.base !== 'water';
		}).forEach(function(cell) {
			var firstWater = null,
				lastWater = null,
				waterDiff = 0,
				adjacentWater = getAdjacentTiles([cell.x, y]).filter(function(tile, index) {
					if (tile && tile.base === 'water') {
						if (firstWater === null) {
							firstWater = index;
						} else {
							lastWater = index
						}

						return true
					} else {
						return false;
					}
				});

			waterDiff = Math.abs(lastWater - firstWater);

			if (adjacentWater.length === 2 && waterDiff >= 2 && waterDiff <= 4) {
				points.push([cell.x, y]);
			}
		});
	});

	points.forEach(function(point) {
		getTile(point).base = 'water';
	});
}

function removeRandomContinents(count) {
	if (typeof count === 'undefined' || count == 0) {
		return;
	} else if (count > continentData.length) {
		count = continentData.length;
	}

	for (let i = 0; i < count; i++) {
		let index = Math.floor(Math.random() * continentData.length);
		continentData[index].forEach(function(point) {
			getTile(point).base = 'water';
		});

		continentData.splice(index, 1);
	}
}

function renderMapData(mapData) {
	document.getElementById('out').innerHTML = mapData.map(function(row, y) {
		return '<div class="hex-row">' + row.map(function(cell, x) {
			var margin = offset,
         		translate = (x % 2 == 1) ? (height / 2) * -1 : 0;
    
     		return `<svg id="tile${x}_${y}" class="hex ${cell.base}-hex continent-${cell.continent}" xmlns="http://www.w3.org/2000/svg" version="1.1" width="${width}" height="${height}" style="margin-left: ${margin}px; transform: translateY(${translate - 2}px)" xmlns:xlink="http://www.w3.org/1999/xlink">
  				<polygon class="hex" points="${coords}"></polygon></svg>`;
		}).join('') + '</div>';
	}).join('\n');
}

function getRandomPoint(edges) {
	if (typeof edges === 'undefined') {
		edges = false;
	}

	var offset = (edges) ? 0 : 1;

	return [
		Math.floor(Math.random() * (cols - offset)) + offset,
		Math.floor(Math.random() * (rows - offset)) + offset
	];
}

do {
	start = getRandomPoint();
} while (start[1] < minRow || start[1] > maxRow);

buildContinentFromPoint(start, 12, 800, 5);
removeRandomContinents(1);
connectWater();
renderMapData(mapData);