main();

function main() {
  
    const canvas = document.querySelector("#gl-canvas");
    const gl = canvas.getContext("webgl2");
    
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const triangleVertices = [
        //top middle
        0.0, 0.5,
        //bottom left
        -0.5, -0.5,
        //bottom right
        0.5, -0.5
    ];

    const triangleVerticesCPUBuffer = new Float32Array(triangleVertices);

    const triangleVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVerticesCPUBuffer, gl.STATIC_DRAW);

    const vertexShaderSource = `#version 300 es
    precision mediump float;
    
    in vec2 vertPosition;

    void main() {
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }`;

    //verify errors in shader compilation
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling vertex shader:', gl.getShaderInfoLog(vertexShader));
        return;
    }

    const fragmentShaderSource = `#version 300 es
    precision mediump float;

    out vec4 FragColor;

    void main() {
        FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
    }`;

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Error compiling fragment shader:', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    const triangleShaderProgram = gl.createProgram();
    gl.attachShader(triangleShaderProgram, vertexShader);
    gl.attachShader(triangleShaderProgram, fragmentShader);
    gl.linkProgram(triangleShaderProgram);
    if (!gl.getProgramParameter(triangleShaderProgram, gl.LINK_STATUS)) {
        console.error('Error linking shader program:', gl.getProgramInfoLog(triangleShaderProgram));
        return;
    }

    const vertexPostionLocation = gl.getAttribLocation(triangleShaderProgram, 'vertPosition');
    if (vertexPostionLocation < 0) {
        console.error('Error getting attribute location for vertPosition');
        return;
    }

    //output merger 
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //rasterization
    gl.viewport(0, 0, canvas.width, canvas.height);
    //set gpu program (vertex + fragment shader)
    gl.useProgram(triangleShaderProgram);
    gl.enableVertexAttribArray(vertexPostionLocation);
    //input assembler
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    gl.vertexAttribPointer(
        /* index= */ vertexPostionLocation,
        /* size= */ 2, // x and y
        /* type= */ gl.FLOAT,
        /* normalized= */ false,
        /* stride= */ 2 * Float32Array.BYTES_PER_ELEMENT, // 2 floats per vertex
        /* offset= */ 0
    );

    //draw call
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}



