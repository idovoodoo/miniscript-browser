// Simple MiniScript shim for browser
(function() {    // Create global miniscript object
    window.miniscript = {
        version: "1.0.1",
        
        // Interpreter class
        Interpreter: function() {
            this.variables = {
                // Add pi constant
                pi: Math.PI,
                  // Global range function
                range: function(x, y = null, step = null) {
                    // If only one argument, it's the end (with start=0, step=1)
                    if (y === null) {
                        y = x;
                        x = 0;
                        step = 1;
                    } else if (step === null) {
                        // With two arguments, step is determined by direction
                        step = x <= y ? 1 : -1;
                    }
                    
                    const result = [];
                    if (step > 0) {
                        // Ascending range
                        for (let i = x; i <= y; i += step) {
                            result.push(i);
                        }
                    } else {
                        // Descending range
                        for (let i = x; i >= y; i += step) {
                            result.push(i);
                        }
                    }
                    return this.enhanceListWithMethods(result);
                }
            };

            // Main code runner: parses and executes MiniScript code
            this.run = function(code) {
                const lines = code.split('\n');
                let i = 0;
                while (i < lines.length) {
                    let line = lines[i].trim();                    // --- SINGLE-LINE IF STATEMENT SUPPORT ---
                    if (line.startsWith("if ") && line.includes(" then") && !line.includes("end if")) {
                        const thenIndex = line.indexOf(" then");
                        const condExpr = line.substring(3, thenIndex).trim();
                        const rest = line.substring(thenIndex + 5).trim();
                        let condResult = this.evalCondition(condExpr);
                        if (condResult && rest.length > 0) {
                            this.run(rest);
                        }
                    }                    // --- MULTI-LINE IF/ELSE/ELSE IF SUPPORT ---
                    else if (line.startsWith("if ") && line.includes(" then")) {
                        const condExpr = line.substring(3, line.indexOf(" then")).trim();
                        let condResult = this.evalCondition(condExpr);
                        i++;
                        let blocks = [];
                        let currentBlock = [];
                        let conditions = [condResult];
                        let elseFound = false;
                        while (i < lines.length && !lines[i].trim().startsWith("end if")) {
                            let innerLine = lines[i].trim();
                            if (innerLine.startsWith("else if ") && innerLine.includes(" then")) {
                                blocks.push(currentBlock);
                                currentBlock = [];                                // Parse new else if condition
                                const elseIfCond = innerLine.substring(8, innerLine.indexOf(" then")).trim();
                                let elseIfResult = this.evalCondition(elseIfCond);
                                conditions.push(elseIfResult);
                            } else if (innerLine === "else") {
                                blocks.push(currentBlock);
                                currentBlock = [];
                                elseFound = true;
                            } else {
                                currentBlock.push(innerLine);
                            }
                            i++;
                        }
                        blocks.push(currentBlock);
                        // Find first true condition
                        let blockToRun = null;
                        for (let j = 0; j < conditions.length; j++) {
                            if (conditions[j]) {
                                blockToRun = blocks[j];
                                break;
                            }
                        }
                        if (!blockToRun && elseFound) {
                            blockToRun = blocks[blocks.length - 1];
                        }
                        if (blockToRun) {
                            for (let innerLine of blockToRun) {
                                this.run(innerLine);
                            }
                        }
                    }                    // --- WHILE LOOP SUPPORT ---
                    else if (line.startsWith("while ")) {
                        const condExpr = line.substring(6).trim();
                        let loopLines = [];
                        i++;
                        // Collect all lines between while and end while
                        while (i < lines.length && !lines[i].trim().startsWith("end while")) {
                            loopLines.push(lines[i]);
                            i++;
                        }

                        // Evaluate condition and execute loop body while condition is true
                        let condResult = this.evalCondition(condExpr);
                        while (condResult) {
                            // Execute the loop body
                            for (let loopLine of loopLines) {
                                let trimmed = loopLine.trim();
                                this.run(trimmed);
                            }
                            // Re-evaluate condition
                            condResult = this.evalCondition(condExpr);
                        }
                    }                    // --- PRINT STATEMENT SUPPORT ---
                    else if (line.startsWith("print ")) {
                        const expr = line.substring(6).trim();
                        let val = this.evalExpr(expr);
                        console.log(val);
                    }                    // --- VARIABLE ASSIGNMENT SUPPORT ---
                    else if (line.includes("=")) {
                        const [leftSide, valueRaw] = line.split("=").map(s => s.trim());
                        // Always evaluate the right-hand side as an expression
                        let value = this.evalExpr(valueRaw);
                        this.variables[leftSide] = value;
                    }                    // --- IGNORE EMPTY LINES ---
                    i++;
                }
                return true;
            };            // Evaluate an expression (supports variables and constants)
            this.evalExpr = function(expr) {
                expr = expr.trim();
                if (this.variables.hasOwnProperty(expr)) {
                    return this.variables[expr];
                }
                return expr;
            };            // Evaluate a condition (supports basic comparisons)
            this.evalCondition = function(expr) {
                expr = expr.trim();
                if (expr.includes("==")) {
                    const [left, right] = expr.split("==").map(s => s.trim());
                    return this.evalExpr(left) == this.evalExpr(right);
                } else if (expr.includes("!=")) {
                    const [left, right] = expr.split("!=").map(s => s.trim());
                    return this.evalExpr(left) != this.evalExpr(right);
                } else if (expr.includes(">")) {
                    const [left, right] = expr.split(">").map(s => s.trim());
                    return this.evalExpr(left) > this.evalExpr(right);
                } else if (expr.includes("<")) {
                    const [left, right] = expr.split("<").map(s => s.trim());
                    return this.evalExpr(left) < this.evalExpr(right);
                } else if (expr.includes(">=")) {
                    const [left, right] = expr.split(">=").map(s => s.trim());
                    return this.evalExpr(left) >= this.evalExpr(right);
                } else if (expr.includes("<=")) {
                    const [left, right] = expr.split("<=").map(s => s.trim());
                    return this.evalExpr(left) <= this.evalExpr(right);
                }
                return false;
            };
        },
        
        // Global function: runs MiniScript code in the global scope
        run: function(code) {
            // Create a new Interpreter instance for running the code
            const interpreter = new this.Interpreter();
            
            // Run the code
            return interpreter.run(code);
        }
    };
})();
