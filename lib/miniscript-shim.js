// Simple MiniScript shim for browser - Clean version without list/map features
(function() {
    // Create global miniscript object
    window.miniscript = {
        version: "1.0.1",
        
        // Interpreter class
        Interpreter: function() {
            this.variables = {
                // Add pi constant
                pi: Math.PI,
                // Simple range function that returns plain arrays
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
                    return result; // Return plain array without enhancement
                }
            };

            // Main code runner: parses and executes MiniScript code
            this.run = function(code) {
                const lines = code.split('\n');
                let i = 0;
                while (i < lines.length) {
                    let line = lines[i].trim();
                    
                    // Skip empty lines and comments
                    if (line.length === 0 || line.startsWith("//")) {
                        i++;
                        continue;
                    }
                    
                    // --- SINGLE-LINE IF STATEMENT SUPPORT ---
                    if (line.startsWith("if ") && line.includes(" then") && !line.includes("end if")) {
                        const thenIndex = line.indexOf(" then");
                        const condExpr = line.substring(3, thenIndex).trim();
                        const rest = line.substring(thenIndex + 5).trim();
                        let condResult = this.evalCondition(condExpr);
                        if (condResult && rest.length > 0) {
                            this.run(rest);
                        }
                        i++;
                        continue;
                    }
                    
                    // --- FOR LOOPS ---
                    if (line.startsWith("for ")) {
                        // Check for 'for x in range(a, b)' pattern
                        const forParts = line.match(/^for\s+(\w+)\s+in\s+range\(([^,]+),\s*([^)]+)\)/);
                        if (forParts) {
                            const varName = forParts[1];
                            const start = Number(this.evalExpr(forParts[2]));
                            const end = Number(this.evalExpr(forParts[3]));
                            let loopLines = [];
                            i++;
                            while (i < lines.length && !lines[i].trim().startsWith("end for")) {
                                loopLines.push(lines[i]);
                                i++;
                            }
                            for (let val = start; val <= end; val++) {
                                this.variables[varName] = val;
                                this.run(loopLines.join('\n'));
                            }
                            i++;
                            continue;
                        }
                    }

                    // --- WHILE LOOPS ---
                    if (line.startsWith("while ")) {
                        const condition = line.substring(6).trim();
                        let loopLines = [];
                        i++;
                        while (i < lines.length && !lines[i].trim().startsWith("end while")) {
                            loopLines.push(lines[i]);
                            i++;
                        }
                        
                        // Execute the loop
                        while (this.evalCondition(condition)) {
                            this.run(loopLines.join('\n'));
                        }
                        i++;
                        continue;
                    }

                    // --- IF/ELSE IF/ELSE BLOCKS ---
                    if (line.startsWith("if ")) {
                        let blocks = [];
                        let currentBlock = [];
                        let currentCondition = line.substring(3).trim();
                        
                        i++;
                        while (i < lines.length && !lines[i].trim().startsWith("end if")) {
                            if (lines[i].trim().startsWith("else if ")) {
                                // Save current block
                                blocks.push({ condition: currentCondition, lines: [...currentBlock] });
                                currentBlock = [];
                                // Parse new else if condition
                                currentCondition = lines[i].trim().substring(8).trim();
                            } else if (lines[i].trim() === "else") {
                                // Save current block and start else block
                                blocks.push({ condition: currentCondition, lines: [...currentBlock] });
                                currentBlock = [];
                                currentCondition = "true"; // else always executes if reached
                            } else {
                                currentBlock.push(lines[i]);
                            }
                            i++;
                        }
                        
                        // Save the last block
                        blocks.push({ condition: currentCondition, lines: currentBlock });
                        
                        // Execute the first block whose condition is true
                        for (const block of blocks) {
                            if (this.evalCondition(block.condition)) {
                                this.run(block.lines.join('\n'));
                                break;
                            }
                        }
                        i++;
                        continue;
                    }

                    // --- PRINT STATEMENT ---
                    if (line.startsWith("print ")) {
                        const output = this.evalExpr(line.substring(6));
                        console.log(output);
                        i++;
                        continue;
                    }

                    // --- VARIABLE ASSIGNMENT ---
                    if (line.includes("=") && !line.includes("==") && !line.includes("!=") && !line.includes("<=") && !line.includes(">=")) {
                        const parts = line.split("=");
                        if (parts.length === 2) {
                            const varName = parts[0].trim();
                            const value = this.evalExpr(parts[1].trim());
                            this.variables[varName] = value;
                            i++;
                            continue;
                        }
                    }

                    // --- FUNCTION CALLS ---
                    if (line.includes("(") && line.includes(")")) {
                        this.evalExpr(line);
                    }

                    i++;
                }
            };

            // Evaluate conditions for if/while statements
            this.evalCondition = function(condition) {
                condition = condition.trim();
                
                // Handle logical operators
                if (condition.includes(" and ")) {
                    const parts = condition.split(" and ");
                    return parts.every(part => this.evalCondition(part.trim()));
                }
                
                if (condition.includes(" or ")) {
                    const parts = condition.split(" or ");
                    return parts.some(part => this.evalCondition(part.trim()));
                }
                
                // Handle comparison operators
                if (condition.includes("==")) {
                    const parts = condition.split("==");
                    const left = this.evalExpr(parts[0].trim());
                    const right = this.evalExpr(parts[1].trim());
                    return left == right;
                }
                
                if (condition.includes("!=")) {
                    const parts = condition.split("!=");
                    const left = this.evalExpr(parts[0].trim());
                    const right = this.evalExpr(parts[1].trim());
                    return left != right;
                }
                
                if (condition.includes(">=")) {
                    const parts = condition.split(">=");
                    const left = Number(this.evalExpr(parts[0].trim()));
                    const right = Number(this.evalExpr(parts[1].trim()));
                    return left >= right;
                }
                
                if (condition.includes("<=")) {
                    const parts = condition.split("<=");
                    const left = Number(this.evalExpr(parts[0].trim()));
                    const right = Number(this.evalExpr(parts[1].trim()));
                    return left <= right;
                }
                
                if (condition.includes(">")) {
                    const parts = condition.split(">");
                    const left = Number(this.evalExpr(parts[0].trim()));
                    const right = Number(this.evalExpr(parts[1].trim()));
                    return left > right;
                }
                
                if (condition.includes("<")) {
                    const parts = condition.split("<");
                    const left = Number(this.evalExpr(parts[0].trim()));
                    const right = Number(this.evalExpr(parts[1].trim()));
                    return left < right;
                }
                
                // If no operators, evaluate as expression and check truthiness
                const result = this.evalExpr(condition);
                return !!result;
            };

            // Evaluate expressions (simplified version without list/map literals)
            this.evalExpr = function(expr) {
                expr = expr.trim();
                
                // String literal
                if (expr.startsWith('"') && expr.endsWith('"')) {
                    return expr.substring(1, expr.length-1);
                }
                
                // Number literal
                if (!isNaN(Number(expr))) {
                    return Number(expr);
                }
                
                // Boolean literals
                if (expr === "true") return true;
                if (expr === "false") return false;
                if (expr === "null") return null;
                
                // input() function
                if (expr.startsWith("input(")) {
                    let promptText = expr.substring(6, expr.length-1);
                    if (promptText.startsWith('"') && promptText.endsWith('"')) {
                        promptText = promptText.substring(1, promptText.length-1);
                    }
                    return window.prompt(promptText);
                }
                
                // val() function
                if (expr.startsWith("val(")) {
                    let inner = expr.substring(4, expr.length-1);
                    return Number(this.evalExpr(inner));
                }
                
                // sqrt() function
                if (expr.startsWith("sqrt(")) {
                    const inner = expr.substring(5, expr.length - 1);
                    const value = Number(this.evalExpr(inner));
                    return Math.sqrt(value);
                }
                
                // round() function
                if (expr.startsWith("round(")) {
                    const inner = expr.substring(6, expr.length - 1);
                    const value = Number(this.evalExpr(inner));
                    return Math.round(value);
                }
                
                // range() function
                if (expr.startsWith("range(")) {
                    const argsStr = expr.substring(6, expr.length - 1);
                    const args = argsStr.split(',').map(arg => this.evalExpr(arg.trim()));
                    
                    if (args.length === 1) {
                        return this.variables.range.call(this, args[0]);
                    } else if (args.length === 2) {
                        return this.variables.range.call(this, args[0], args[1]);
                    } else if (args.length === 3) {
                        return this.variables.range.call(this, args[0], args[1], args[2]);
                    } else {
                        console.error("range() requires 1-3 arguments");
                        return [];
                    }
                }
                
                // Arithmetic operations
                if (expr.includes("+")) {
                    const parts = expr.split("+");
                    if (parts.length === 2) {
                        const left = this.evalExpr(parts[0].trim());
                        const right = this.evalExpr(parts[1].trim());
                        // Handle string concatenation
                        if (typeof left === 'string' || typeof right === 'string') {
                            return String(left) + String(right);
                        }
                        return Number(left) + Number(right);
                    }
                }
                
                if (expr.includes("-")) {
                    const parts = expr.split("-");
                    if (parts.length === 2) {
                        const left = this.evalExpr(parts[0].trim());
                        const right = this.evalExpr(parts[1].trim());
                        return Number(left) - Number(right);
                    }
                }
                
                if (expr.includes("*")) {
                    const parts = expr.split("*");
                    if (parts.length === 2) {
                        const left = this.evalExpr(parts[0].trim());
                        const right = this.evalExpr(parts[1].trim());
                        return Number(left) * Number(right);
                    }
                }
                
                if (expr.includes("/")) {
                    const parts = expr.split("/");
                    if (parts.length === 2) {
                        const left = this.evalExpr(parts[0].trim());
                        const right = this.evalExpr(parts[1].trim());
                        return Number(left) / Number(right);
                    }
                }
                
                // Variable lookup
                if (this.variables.hasOwnProperty(expr)) {
                    return this.variables[expr];
                }
                
                // If nothing else matches, return as string
                return expr;
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
