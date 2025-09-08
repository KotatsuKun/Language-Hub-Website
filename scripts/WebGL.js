main();

function main() {
  
    init();

}

// Set clear color to black, fully opaque
gl.clearColor(0.0, 0.0, 0.0, 1.0);
// Clear the color buffer with specified clear color
gl.clear(gl.COLOR_BUFFER_BIT);


async function init() {
    try {
        // Load shaders
        await shaderLoader.loadMultipleShaders(['basic', 'effects', 'postProcessing']);

        const canvas = document.querySelector("#gl-canvas");
        // Initialize the GL context
        const gl = canvas.getContext("webgl");

        // Only continue if WebGL is available and working
        if (gl === null) {
            alert(
                "Unable to initialize WebGL. Your browser or machine may not support it.",
            );
            return;
        }

        // Initialize shader program using loaded shaders
        const basicShader = shaderLoader.getShader('basic');
        const shaderProgram = shaderLoader.initShaderProgram(
            gl,
            basicShader.vertex,
            basicShader.fragment
        );

        // Continue with your WebGL setup...
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                // ... other attributes
            },
            uniformLocations: {
                // ... uniform locations
            },
        };

        // Initialize buffers and start rendering...
        initBuffers(gl);
        drawScene(gl, programInfo);

    } catch (error) {
        console.error('Failed to initialize WebGL:', error);
    }
}

// Call init when the page loads
window.addEventListener('load', init);

const positions = [
  // Front face
  -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

  // Back face
  -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

  // Top face
  -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

  // Right face
  1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

  // Left face
  -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
];