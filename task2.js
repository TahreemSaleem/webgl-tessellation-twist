

function main(angle,tessellation_value) {
  	var canvas = document.getElementById('webgl');
	var gl = getWebGLContext(canvas);
	if (!gl){
		console.log('Failed to find context');
	}
	
	

	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram (program);
	gl.program = program;


	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	//Triangle
	var vertices = [-0.5, -0.5/Math.sqrt(3), 0.5, -0.5/Math.sqrt(3), 0, Math.sqrt(3)/3];
	console.log(angle);
	tessellation(tessellation_value,vertices,program,gl,angle);
	

	

}

function tessellation(value,vertices,program,gl,angle){
	
	if (value == 0)
	{	
		
		render(gl,vertices,program,angle);
		return -1;
	}
	
	else 
	{
		var new_v1 = [(vertices[0]+vertices[2])/2, (vertices[1]+vertices[3])/2, (vertices[2]+vertices[4])/2, (vertices[3]+vertices[5])/2, (vertices[0]+vertices[4])/2,(vertices[1]+vertices[5])/2];
		var new_v2 = [vertices[0], vertices[1], new_v1[0],new_v1[1], new_v1[4],new_v1[5]];
		var new_v3 = [vertices[2], vertices[3], new_v1[0],new_v1[1], new_v1[2],new_v1[3]];
		var new_v4 = [vertices[4], vertices[5], new_v1[4],new_v1[5], new_v1[2],new_v1[3]];
		value = value -1;
		tessellation(value,new_v1,program,gl,angle);
		tessellation(value,new_v2,program,gl,angle);	
		tessellation(value,new_v3,program,gl,angle);
		tessellation(value,new_v4,program,gl,angle);
	}
}


var FizzyText = function() {
  
 
  this.twist_angle = 0;
  this.tessellation = 0;

}

window.onload = function() {
 
  	var text = new FizzyText();
  	var gui = new dat.GUI();
  	var twist_angle = gui.add(text, 'twist_angle', 0, 500);
  	var tessellation = gui.add(text, 'tessellation', 0, 6);
	var twist_value = 0;
	var tessellation_value =0;
	
	twist_angle.onChange(function(value) {
		twist_value = value;
		//console.log(twist_value);
		main(twist_value,tessellation_value);
	});

	tessellation.onFinishChange(function(value) {
		tessellation_value = Math.floor(value);

		main(twist_value,tessellation_value);
	});


	main(0,0);

};

function twist(vertices,angle){

	if (angle>0)
	{
		angle =  angle* Math.PI / 180;
		r_vertices = [];
		for(i = 0;i<=5 ;i+=2){
			x = vertices[i];
			y = vertices[i+1];

		  	d = Math.sqrt(x * x + y * y),
        	sinAngle = Math.sin(d * angle),
        	cosAngle = Math.cos(d * angle);

       		r_vertices[i] = x * cosAngle - y * sinAngle;
		    r_vertices[i+1] = x * sinAngle + y * cosAngle;
		}
	}
	else 
		return vertices;
	return r_vertices;
}




function render (gl,vertices,program,angle){
	
	//   gl.clear( gl.COLOR_BUFFER_BIT );
	v = twist(vertices,angle);
	//console.log(v);
	var numberOfVertices = initVertices(program, gl, v)
	gl.drawArrays(gl.LINE_LOOP, 0, numberOfVertices);

	//console.log(numberOfVertices);


}

function initVertices(program, gl,vertices){
	
	var noOfDim = 2;
	var numberOfVertices = vertices.length / noOfDim;
	
	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer){ console.log('Failed to create the buffer object ');	return -1;}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	
	var a_Position = gl.getAttribLocation(program, 'a_Position');
	if (a_Position < 0) { console.log ("Failed to Get Position"); return;	}
	
	gl.vertexAttribPointer(a_Position, noOfDim, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Position);
	
	return numberOfVertices;
}

