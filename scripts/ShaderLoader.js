class ShaderLoader {
    constructor() {
        this.shaders = {};
    }

    async loadShader(name) {
        try {
            // Load both vertex and fragment shaders simultaneously
            const [vertResponse, fragResponse] = await Promise.all([
                fetch(`shaders/${name}.vert`),
                fetch(`shaders/${name}.frag`)
            ]);

            if (!vertResponse.ok || !fragResponse.ok) {
                throw new Error(`Failed to load shader: ${name}`);
            }

            const [vertexSource, fragmentSource] = await Promise.all([
                vertResponse.text(),
                fragResponse.text()
            ]);

            this.shaders[name] = {
                vertex: vertexSource,
                fragment: fragmentSource
            };

            return this.shaders[name];
        } catch (error) {
            console.error('Error loading shader:', error);
            throw error;
        }
    }

    async loadMultipleShaders(shaderNames) {
        try {
            const loadPromises = shaderNames.map(name => this.loadShader(name));
            return await Promise.all(loadPromises);
        } catch (error) {
            console.error('Error loading multiple shaders:', error);
            throw error;
        }
    }

    getShader(name) {
        return this.shaders[name];
    }

    // Helper method to compile and link shaders (similar to MDN tutorial)
    initShaderProgram(gl, vertexSource, fragmentSource) {
        const vertexShader = this.loadShaderOfType(gl, vertexSource, gl.VERTEX_SHADER);
        const fragmentShader = this.loadShaderOfType(gl, fragmentSource, gl.FRAGMENT_SHADER);

        // Create the shader program
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }

    loadShaderOfType(gl, source, type) {
        const shader = gl.createShader(type);

        // Send the source to the shader object
        gl.shaderSource(shader, source);

        // Compile the shader program
        gl.compileShader(shader);

        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }
}

// Create a global instance for easy access
const shaderLoader = new ShaderLoader();