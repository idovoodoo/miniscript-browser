// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Create a MiniScript interpreter
let interpreter;

// Initialize MiniScript when the page loads
window.onload = function() {
    try {
        console.log('Initializing game...');

        // Check if MiniScript is loaded
        if (typeof miniscript === 'undefined') {
            throw new Error("MiniScript library not loaded!");
        }        // Load MiniScript code from our slice test script
        fetch('slice-test.ms?' + new Date().getTime())  // Add cache-busting parameter
            .then(response => response.text())
            .then(miniScriptCode => {
                // Create the interpreter
                interpreter = new miniscript.Interpreter();

                // Run the MiniScript code
                interpreter.run(miniScriptCode);

                // Draw everything: 'Hello World' and sprite if specified
                const drawEverything = () => {
                    ctx.fillStyle = "#000000";
                    ctx.fillRect(0, 0, 320, 240);
                    let color = interpreter.variables.textColor;
                    if (!color || typeof color !== 'string' || color.length < 4) {
                        color = "#FFFFFF";
                        console.log('textColor not set or invalid, using fallback:', color);
                    } else {
                        console.log('Using textColor:', color);
                    }
                    ctx.fillStyle = color;
                    ctx.font = "20px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(interpreter.variables.text, interpreter.variables.textX, interpreter.variables.textY);

                    // Draw sprite if specified
                    if (interpreter.variables.spritePath) {
                        const img = new Image();
                        img.src = interpreter.variables.spritePath;
                        img.onload = function() {
                            ctx.drawImage(
                                img,
                                interpreter.variables.spriteX || 0,
                                interpreter.variables.spriteY || 0
                            );
                        };
                        img.onerror = function() {
                            console.warn('Sprite image not found:', img.src);
                        };
                    }
                };

                drawEverything();

                console.log('Graphics drawn to canvas');
                console.log('Interpreter variables:', interpreter.variables);
            })
            .catch(error => {
                console.error('Error loading MiniScript code:', error);
            });
    } catch (error) {
        console.error('Error initializing game:', error);
    }
};
