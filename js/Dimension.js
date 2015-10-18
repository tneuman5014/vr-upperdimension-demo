
/// Point Class
// Represents a vector (or point) in
// N-space.  Each index in its array holds
// its position (or value) in that axis.
function Point (axisValues) {
	
	// AxisValue is meant to be passed in as an
	// array of doubles (just called "numbers" in javascript)
	this.position = axisValues;
	if (this.position != null) {
		this.dimensions = this.position.length;
	}
	
	// Returns the value of the provided axis.  
	// If the axis is not defined, 0 is still returned!!!!
	this.getAxisValue = function getAxisValue (axis) {
		if (axis >= this.dimensions || axis < 0) {
			return 0.0;
		}
		return this.position[axis];
	}
	
	// Sets the provided axis to the provided value.
	this.setAxis = function setAxis (axis, value) {
		this.position[axis] = value;
		this.dimensions = this.position.length;
	}
	
	// Adds the provided point to this one
	this.add = function add (positionToAdd) {
		for (var i = 0; i < this.dimensions; i++) {
			this.position[i] += positionToAdd.getAxisValue(i);
		}
	}
	
	// Subtracts the provided point
	this.subtract = function subtract (positionToSub) {
		for (var i = 0; i < this.dimensions; i++) {
			this.position[i] -= positionToSub.getAxisValue(i);
		}
	}
	
	// Returns the index of the greatest defined axis
	// (which is the number of dimensions the point is defined in)
	this.getDimensions = function getDimensions () {
		return this.dimensions;
	}
	
	// Returns the values of each axis surrounded by brackets
	this.toString = function toString () {
		var result = "[";
		if (this.position[0] >= 0) {
			result += " ";
		}
		result += this.position[0];
		for (var t = 1; t < this.position.length; t++) {
			result += ", ";
			if (this.position[t] >= 0) {
				result += " ";
			}
			result += this.position[t];
		}
		result += "]";
		return result;
	}
} 
 /// Line Class
// Stores 2 integers, corresponding to the indexes of
// two vertices (stored in a figure object) that make up a line
function Line ( a, b ) {
	this.aIndex = a;
	this.bIndex = b;
	
	this.getA = function getA () {
		return this.aIndex;
	};
	this.getB = function getB () {
		return this.bIndex;
	};
	
	// Returns a neat ascii line showing the connected vertices
	this.toString = function toString () {
		return this.aIndex + " --- " + this.bIndex;
	}
}

function Face (pieces) {
	this.triangles = [];
	if (pieces != null) {
		this.triangles = pieces;
	}
	
	this.add = function add ( triangle ) {
		this.triangles.push( triangle );
	}
	
	this.getTriangle = function getTriangle ( index ) {
		return this.triangles[ index ];
	}
	
	this.toString = function toString () {
		var result = "" + this.triangles.length + " Pieces\n";
		for (var i = 0; i < this.triangles.length; i++) {
			result += "    " + i + ":   a: " + this.getTriangle(i).a + ", b: " +
			this.getTriangle(i).b + ", c: " + this.getTriangle(i).c + "\n";
		}
		return result + "\n";
	}
	
}
 /// General figure class
// This is like the skeleton of any Nth dimensional
// shape. It stores a center point (not functional yet),
// an array of point objects (vertices) and line objects
// (segments) to connect them. It will be expanded to also  
// store "face" objects and maybe even "enclosed space" objects.
// This class also has a few methods that allow all of its 
// vertices to be offset, rotated, and projected down into 3D.
function Figure () {
	this.vertices = [];
	this.segments = [];
	this.faces = [];
	this.center = new Point();
	this.dimensions;
	
	
	// Offsets all vertices by the given point
	this.offset = function offset (point) {
		for (var i = 0; i < this.vertices.length; i++) {
			this.vertices[i].add(point);
		}
		this.center.add(point);
	}
	
	this.scaleAxis = function scaleAxis (axis, scaleFactor) {
		
		for (var i = 0; i < this.vertices.length; i++) {
			var value = this.vertices[i].getAxisValue(axis) - this.center.getAxisValue(axis);
			this.vertices[i].setAxis(axis, value * scaleFactor + this.center.getAxisValue(axis));
		}
		
	}
	
	this.scale = function scale (scaleFactor) {
		for (var axis = 0; axis < this.dimensions; axis++) {
			this.scaleAxis(axis, scaleFactor);
		}
	}
	
	// Rotates each verticy around the provided point in the plane
	// defined by the two axes. Example: If aAxis = 0 and bAxis = 1 that would
	// mean rotate the point in the xy plane.  If a = 0 and b = 2, that would 
	// mean rotate in the xz plane.  More complicated rotations can be constructed 
	// from multiple 2D rotations in different planes.
	// Heres a bit of explanation for how this method works:
	// https://www.siggraph.org/education/materials/HyperGraph/modeling/mod_tran/2drota.htm
	this.rotateFigure = function rotateFigure (aAxis, bAxis, rotateAbout, angle) {
		// Trig functions are computed once to save
		// time and shorten code
		var sin = Math.sin(angle);
		var cos = Math.cos(angle);
		
		// Rotate the center
		if (rotateAbout != null) {
			this.center = this.rotatePoint(this.center, aAxis, bAxis, rotateAbout, sin, cos);
		} else {
			rotateAbout = this.center;
		}
		
		// Loops through all of the figures vertices
		for (var vertIndex = 0; vertIndex < this.vertices.length; vertIndex++) {
			this.vertices[vertIndex] = this.rotatePoint
			( this.vertices[vertIndex], aAxis, bAxis, rotateAbout, sin, cos );
		}

	}
	
	// Rotates the verticy at the provided index using the given parameters
	this.rotatePoint = function rotatePoint (
			point, aAxis, bAxis, rotateAbout, sinTheta, cosTheta
												) {
		// Translates the point back to the relative origin to prime it for rotation
		point.subtract(rotateAbout);
		// Saves original values of each coordinate 
		var oldA = point.getAxisValue(aAxis);
		var oldB = point.getAxisValue(bAxis);
		// Performs rotation
		point.setAxis(aAxis, oldA * cosTheta - oldB * sinTheta);
		point.setAxis(bAxis, oldA * sinTheta + oldB * cosTheta);
		// Launches the point back to the area from whence it came.
		point.add(rotateAbout);
		return point;
	}
	
	// Projects all of the figures vertices onto 3D and returns them
	// as an array of THREE.Vector3s so they can be easily scooped up by 
	// a THREE.Geometry
	this.projectTo3D = function projectTo3D (nPlaneDistance) {
		var projectedVerts = [];
		// Stores the number of dimensions we's working with
		var dims = this.vertices[0].getDimensions();
		// Each verticy gets its turn
		for (var index = 0; index < this.vertices.length; index++) {
			var squashFactor = 1.0; // The amount by which each x, y, and 
			// z coordinate will be adjusted due to perspective projection
			if (dims > 3) {
				// Below is an imperfect compensation factor that
				// attempts to cancel out a "shrinking" effect caused
				// by dividing more and more for each extra dimension.
				squashFactor = 1.0 / Math.pow(3.0 , (dims - 3)) ;
				for (var dimToSquash = 3; dimToSquash < dims; dimToSquash++) {
					// Takes the product of all the values of axes 3 or greater, 
					// so they can all squash xy&z in one fell swoop.
					squashFactor *= this.vertices[index].getAxisValue(dimToSquash)
					+ nPlaneDistance; // This additional factor represents the position
					// that the viewplane (camera, whatever you want to call it) has 
					// in all dimensions 3 or greater 
				}
			}
			// Performs final squash of xyz coords and sticks 
			// them into a THREE.Vector3 for easy handling
			projectedVerts[index] = new THREE.Vector3 (
				this.vertices[index].getAxisValue(0) / squashFactor,
				this.vertices[index].getAxisValue(1) / squashFactor,
				this.vertices[index].getAxisValue(2) / squashFactor
					);
		}
		return projectedVerts;
	}
	
	
	// A useful string showing information about all the 
	// figures vertices and lines.
	this.toString = function toString () {
		var result = "Verticies: " + this.vertices.length + "\n";
		for (var t = 0; t < this.vertices.length; t++) {
			result += t + ":   " + this.vertices[t] + "\n";
		}
		if (this.segments != null) {
			result += "\nSegments: " + this.segments.length + "\n";
			for (var t = 0; t < this.segments.length; t++) {
				result += t + ":   " + this.segments[t] + "\n";
			}
		}
		if (this.faces != null) {
			result += "\nFaces: " + this.faces.length + "\n";
			for (var t = 0; t < this.faces.length; t++) {
				result += "" + t + ":  " + this.faces[t];
			}
			result += "\n";
		}
		return result;
	}
}

 /// Square class (extends Figure class)
// A specific instance of the figure class that 
// represents an Nth dimensional square, cube, ect
function Square (dimensions, scale, position) {
	this.dimensions = dimensions;
	this.center = position;
	
	// First we generate the vertices
	// Number of vertices will always be 2^dimensions
	this.createVertices = function createVertices () {
		var verts = new Array(Math.pow(2, dimensions));
		for (var i = 0; i < verts.length; i++) {
			// Creates each needed point
			var p = new Point(new Array(dimensions));
			// Gives the proper value to each of the points axes.
			for (var axis = 0; axis < dimensions; axis++) {
				// This expression is very confusing and maybe
				// even a little magic, the notes2.png file 
				// may shed a little light on things
				p.setAxis(axis, Math.pow( -1.0, 
					Math.floor((2.0 * i * (Math.pow(2.0, axis))) / verts.length))
					* (scale / 2.0) + position.getAxisValue(axis));
			}
			verts[i] = p;
		}
		return verts;
	}
	
	// Use this method to store the vertices
	this.vertices = this.createVertices();
	
	// Now we generate associations between vertices that
	// represent the lines (edges) the "square" should have.
	// Turns out there are { ((2^d) * d ) / 2 } segments for any d dimensions
	// These loops go through every possible combination of 
	// vertices and then ...
	this.createSegments = function createSegments () {
		var lines = [];
		for (var a = 0; a < this.vertices.length - 1; a++) {
			for (var b = a + 1; b < this.vertices.length; b++) {
				var sharedAxes = 0;
				for (var axis = 0; axis < dimensions; axis++) {
					// ... counts the number of axis in which 
					// the vertices have the same value.
					if (this.vertices[a].getAxisValue(axis) ==
						this.vertices[b].getAxisValue(axis)) {
						sharedAxes++;
					}
				}
				// If they share all axis values except for 1, 
				// then they should be connected (a new line is born)
				if (sharedAxes == dimensions - 1) {
					lines.push(new Line(a, b));
				}
			}
		}
		return lines;
	}
	
	// Use the method to store the segments
	this.segments = this.createSegments();
	
	this.isFace = function isFace ( a, b, c, d ) {
		var count = 0;
		for (var axis = 0; axis < this.dimensions; axis++) {
			var sum = this.vertices[a].getAxisValue(axis) +
				      this.vertices[b].getAxisValue(axis) +
				      this.vertices[c].getAxisValue(axis) +
				      this.vertices[d].getAxisValue(axis) ;
			if (sum == scale * 2 || sum == - scale * 2) {
				count++;
			}
		}
		return count == this.dimensions - 2;
	}
	
	this.createFaces = function createFaces () {
		var faces = [];
	//	alert ("entering");
		for (var a = 0; a < this.vertices.length - 3; a++) {
			for (var b = a + 1; b < this.vertices.length - 2; b++) {
				for (var c = b + 1; c < this.vertices.length - 1; c++) {
					for (var d = c + 1; d < this.vertices.length; d++) {
						if (this.isFace( a, b, c, d )) {
							faces.push(new Face ( [ new THREE.Face3 ( c, b, a ), 
							              new THREE.Face3 ( b, c, d ) ] ));
						}
					}
				} 
			}
		}
		
		return faces;
	}
	
	
	this.faces = this.createFaces();
	
	
}

// This makes the Square class inherit all of the 
// figure classes functions and properties 
// (these are known as methods and fields in regular java)
// Its like saying "Square extends Figure"
Square.prototype = new Figure();


/*

					H
					|
			  H  H  C--H
			   `.|,'|
				 C  H  H
				 |     |
				 O    N  H  C
			     \\ ,' `.|,'|`.
				   C     C  H  H
				   |     |
				H--C     H
				 ,' `.
		  H  H--C  H--C--H
		  |     ||    |
	H     C     C     N  H  H
	 `. ,' `. ,' `. ,' `.|,'
	   C  _  C  H  C     C
	   | (_) |   `.|     |
	   C     C     C     H
	 ,' `. ,' `. ,' `.
	H     C     C     H
		  |    || 
		  N-----C
		  |     |
		  H     H
		  
*/
