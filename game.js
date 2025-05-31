// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Create a MiniScript interpreter
let interpreter;

// Function to update the canvas based on interpreter variables
function updateCanvas() {
    if (!interpreter || !interpreter.variables) return;
    
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 320, 240);
    
    // Main text
    let color = interpreter.variables.textColor || "#FFFFFF";
    let text = interpreter.variables.text || "MiniScript Test";
    let textX = interpreter.variables.textX || 160;
    let textY = interpreter.variables.textY || 120;
    
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
    ctx.fillText(text, textX, textY);
    
    // Extra text fields (if defined)
    const extraTextFields = [
        { text: 'extraText1', x: 'extraText1X', y: 'extraText1Y', color: 'extraText1Color' },
        { text: 'extraText2', x: 'extraText2X', y: 'extraText2Y', color: 'extraText2Color' },
        { text: 'extraText3', x: 'extraText3X', y: 'extraText3Y', color: 'extraText3Color' },
        { text: 'extraText4', x: 'extraText4X', y: 'extraText4Y', color: 'extraText4Color' }
    ];
    
    for (const field of extraTextFields) {
        if (interpreter.variables[field.text]) {
            ctx.fillStyle = interpreter.variables[field.color] || "#FFFFFF";
            ctx.fillText(
                interpreter.variables[field.text],
                interpreter.variables[field.x] || 160,
                interpreter.variables[field.y] || 120
            );
        }
    }

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
}

// Initialize MiniScript when the page loads
window.onload = function() {
    try {
        console.log('Initializing MiniScript test suite...');

        // Check if MiniScript is loaded
        if (typeof miniscript === 'undefined') {
            throw new Error("MiniScript library not loaded!");
        }
        
        // Make updateCanvas globally available for test buttons
        window.updateCanvas = updateCanvas;
          // Load MiniScript code from test master script
        fetch('tests/test-master.ms?' + new Date().getTime())  // Add cache-busting parameter
            .then(response => response.text())
            .then(miniScriptCode => {
                // Create the interpreter
                interpreter = new miniscript.Interpreter();
                window.interpreter = interpreter; // Make it globally available for the test buttons
                
                // Run the MiniScript code
                interpreter.run(miniScriptCode);
                
                // Draw everything
                updateCanvas();
                
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
