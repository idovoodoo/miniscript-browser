// Array enhancement for MiniScript methods
function enhanceList(list) {
    if (!Array.isArray(list)) return list;
    // Only define properties if not already present
    if (!Object.getOwnPropertyDescriptor(list, 'pop')) {
        Object.defineProperties(list, {            pop: {
                value: function() {
                    if (this.length === 0) {
                        return null;
                    }
                    const result = this.splice(this.length - 1, 1)[0];
                    // Ensure nested results are also enhanced if they are arrays
                    return Array.isArray(result) ? enhanceList(result) : result;
                },
                enumerable: false
            },            pull: {
                value: function() {
                    if (this.length === 0) {
                        return null;
                    }
                    const result = this.splice(0, 1)[0];
                    // Ensure nested results are also enhanced if they are arrays
                    return Array.isArray(result) ? enhanceList(result) : result;
                },
                enumerable: false
            },
            push: {
                value: function(x) {
                    this.splice(this.length, 0, x);
                    return enhanceList(this); // Ensure chaining always returns enhanced list
                },
                enumerable: false
            }
        });
    }
    return list;
}

// Simple MiniScript shim for browser - Clean version without list/map features
(function() {
    // Create global miniscript object
    window.miniscript = {
        version: "1.0.1",
        
        // Interpreter class
        Interpreter: function() {
            const MAX_EVAL_DEPTH = 100; // Maximum recursion depth for evalExpr
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
                },                // MiniScript slice function: list.slice(start, end)
                // Returns a new list containing elements from start to end-1
                slice: function(list, startIdx, endIdx = null) {
                    if (!Array.isArray(list)) {
                        console.error("TypeError: slice requires a list");
                        return enhanceList([]);
                    }
                    // Convert indices to numbers
                    startIdx = Number(startIdx);
                    if (isNaN(startIdx)) startIdx = 0;
                    let len = list.length;
                    // Handle negative indices
                    if (startIdx < 0) startIdx = len + startIdx;
                    if (startIdx < 0) startIdx = 0;
                    let end;
                    if (endIdx === null || typeof endIdx === 'undefined') {
                        end = len;
                    } else {
                        end = Number(endIdx);
                        if (isNaN(end)) end = len;
                        if (end < 0) end = len + end;
                        if (end < 0) end = 0;
                    }
                    // Clamp indices
                    startIdx = Math.max(0, Math.min(startIdx, len));
                    end = Math.max(0, Math.min(end, len));
                    // Return empty if range is invalid
                    if (startIdx >= end) return enhanceList([]);
                    return enhanceList(list.slice(startIdx, end));
                }            };            // Convert arrays to MiniScript-style string representation
            this.arrayToString = function(value) {
                if (Array.isArray(value)) {
                    return '[' + value.map(item => this.arrayToString(item)).join(', ') + ']';
                }
                return String(value);
            };

            this.findMatchingBracket = function(str, openBracketPos) {
                let balance = 0;
                if (str[openBracketPos] !== '[') {
                    // This should ideally not be reached if called correctly
                    console.error("findMatchingBracket called on non-\'[\' char");
                    return -1;
                }
                for (let k = openBracketPos; k < str.length; k++) {
                    if (str[k] === '[') {
                        balance++;
                    } else if (str[k] === ']') {
                        balance--;
                        if (balance === 0) { // Found the matching bracket
                            return k;
                        }
                    }
                }
                return -1; // No matching bracket found
            };            // Parse function arguments, respecting nested structures
            this.parseArguments = function(argsStr) {
                if (!argsStr.trim()) return [];
                
                let args = [];
                let currentArg = "";
                let inString = false;
                let bracketDepth = 0;
                let parenDepth = 0;
                let braceDepth = 0;
                
                for (let i = 0; i < argsStr.length; i++) {
                    const char = argsStr[i];
                    
                    if (char === '"' && (i === 0 || argsStr[i-1] !== '\\')) {
                        inString = !inString;
                        currentArg += char;
                    } else if (!inString) {
                        if (char === '[') {
                            bracketDepth++;
                            currentArg += char;
                        } else if (char === ']') {
                            bracketDepth--;
                            currentArg += char;
                        } else if (char === '(') {
                            parenDepth++;
                            currentArg += char;
                        } else if (char === ')') {
                            parenDepth--;
                            currentArg += char;
                        } else if (char === '{') {
                            braceDepth++;
                            currentArg += char;
                        } else if (char === '}') {
                            braceDepth--;
                            currentArg += char;
                        } else if (char === ',' && bracketDepth === 0 && parenDepth === 0 && braceDepth === 0) {
                            // Argument separator found
                            args.push(currentArg.trim());
                            currentArg = "";
                        } else {
                            currentArg += char;
                        }
                    } else {
                        currentArg += char;
                    }
                }
                
                // Add the last argument
                if (currentArg.trim()) {
                    args.push(currentArg.trim());
                }
                
                return args;
            };

            // Smart split function that respects nested structures
            this.smartSplit = function(expr, operator) {
                let parts = [];
                let currentPart = "";
                let inString = false;
                let bracketDepth = 0;
                let parenDepth = 0;
                let braceDepth = 0;
                
                for (let i = 0; i < expr.length; i++) {
                    const char = expr[i];
                    
                    if (char === '"' && (i === 0 || expr[i-1] !== '\\')) {
                        inString = !inString;
                        currentPart += char;
                    } else if (!inString) {
                        if (char === '[') {
                            bracketDepth++;
                            currentPart += char;
                        } else if (char === ']') {
                            bracketDepth--;
                            currentPart += char;
                        } else if (char === '(') {
                            parenDepth++;
                            currentPart += char;
                        } else if (char === ')') {
                            parenDepth--;
                            currentPart += char;
                        } else if (char === '{') {
                            braceDepth++;
                            currentPart += char;
                        } else if (char === '}') {
                            braceDepth--;
                            currentPart += char;
                        } else if (expr.substring(i, i + operator.length) === operator && 
                                   bracketDepth === 0 && parenDepth === 0 && braceDepth === 0) {
                            // Operator found at top level
                            parts.push(currentPart.trim());
                            currentPart = "";
                            i += operator.length - 1; // Skip the operator
                        } else {
                            currentPart += char;
                        }
                    } else {
                        currentPart += char;
                    }
                }
                
                // Add the last part
                if (currentPart.trim()) {
                    parts.push(currentPart.trim());
                }
                
                return parts;
            };            this.findOpenBracketForOuterIndex = function(str, closeBracketPos) {
                // Finds the matching open bracket for the outermost index access like base[index]
                // For example, in "a[b][c]", when closeBracketPos points to the final ']',
                // this should return the position of the '[' before 'c'
                if (str[closeBracketPos] !== ']') return -1;
                let balance = 0;
                for (let k = closeBracketPos; k >= 0; k--) {
                    if (str[k] === ']') {
                        balance++;
                    } else if (str[k] === '[') {
                        balance--;
                        if (balance === 0) {
                            return k; // Found the matching open bracket for the outermost index
                        }
                    }
                }
                return -1; // No matching open bracket found
            };

            // Main code runner: parses and executes MiniScript code
            this.run = function(code) {
                const lines = code.split('\n');
                let i = 0;
                while (i < lines.length) {
                    let line = lines[i].trim();
                    line = this.stripInlineComment(line); // Strip inline comments
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
                        
                        // Check for 'for item in list' pattern
                        const forListMatch = line.match(/^for\s+(\w+)\s+in\s+(.+)$/);
                        if (forListMatch) {
                            const itemVarName = forListMatch[1];
                            const listExpr = forListMatch[2];
                            
                            // Evaluate the list expression
                            const list = this.evalExpr(listExpr);
                            
                            // Check if the result is an array
                            if (Array.isArray(list)) {
                                let loopLines = [];
                                i++;
                                
                                // Collect loop body lines
                                while (i < lines.length && !lines[i].trim().startsWith("end for")) {
                                    loopLines.push(lines[i]);
                                    i++;
                                }
                                
                                // Execute loop for each item in the list
                                for (const item of list) {
                                    this.variables[itemVarName] = item;
                                    this.run(loopLines.join('\n'));
                                }
                                
                                i++;
                                continue;
                            } else {
                                console.error("Expected a list in for loop, got:", typeof list);
                                // Skip to end for
                                while (i < lines.length && !lines[i].trim().startsWith("end for")) {
                                    i++;
                                }
                                i++;
                                continue;
                            }
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
                                // Debug: log what we're about to execute
                                console.log("Executing if-then block with lines:", block.lines);
                                console.log("Joined code:", block.lines.join('\n'));
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
                        // Use arrayToString for arrays (including nested)
                        if (Array.isArray(output)) {
                            console.log(this.arrayToString(output));
                        } else {
                            console.log(output);
                        }
                        i++;
                        continue;
                    }                    // --- VARIABLE ASSIGNMENT ---
                    if (line.includes("=") && !line.includes("==") && !line.includes("!=") && !line.includes("<=") && !line.includes(">=")) {
                        const parts = line.split("=");
                        if (parts.length === 2) {
                            const leftSide = parts[0].trim();
                            const rightSide = parts[1].trim();
                            const value = this.evalExpr(rightSide);
                            
                            // Handle list indexing assignment: myList[0] = value
                            if (leftSide.includes('[') && leftSide.includes(']')) {
                                const openBracket = leftSide.indexOf('[');
                                const containerName = leftSide.substring(0, openBracket).trim();
                                const indexExpr = leftSide.substring(openBracket + 1, leftSide.lastIndexOf(']'));
                                
                                // Get the container and index
                                if (this.variables.hasOwnProperty(containerName)) {
                                    const container = this.variables[containerName];
                                    const index = this.evalExpr(indexExpr);
                                      // Handle array assignment
                                    if (Array.isArray(container)) {
                                        const numIndex = Number(index);
                                        if (!isNaN(numIndex)) {
                                            // Check if the index is within bounds (real MiniScript behavior)
                                            if (numIndex >= 0 && numIndex < container.length) {
                                                container[numIndex] = value;
                                            } else {
                                                console.error("Index Error (list index " + numIndex + " out of range)");
                                            }
                                        }
                                    }
                                    // Handle object (map) assignment
                                    else if (typeof container === 'object' && container !== null) {
                                        container[String(index)] = value;
                                    }
                                }
                            } else {
                                // Regular variable assignment
                                this.variables[leftSide] = value;
                            }
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
            };            // Utility: Strip inline comments (// ...) outside of string literals
            this.stripInlineComment = function(line) {
                let inString = false;
                for (let i = 0; i < line.length - 1; i++) {
                    if (line[i] === '"' && (i === 0 || line[i-1] !== '\\')) {
                        inString = !inString;
                    }
                    if (!inString && line[i] === '/' && line[i+1] === '/') {
                        return line.substring(0, i).trimEnd();
                    }
                }
                return line;
            };

            // Evaluate conditions for if/while statements
            this.evalCondition = function(condition) {
                condition = condition.trim();
                
                // Handle logical operators
                if (condition.includes(" and ")) {
                    const parts = this.smartSplit(condition, " and ");
                    return parts.every(part => this.evalCondition(part.trim()));
                }
                
                if (condition.includes(" or ")) {
                    const parts = this.smartSplit(condition, " or ");
                    return parts.some(part => this.evalCondition(part.trim()));
                }
                
                // Handle comparison operators
                if (condition.includes("==")) {
                    const parts = this.smartSplit(condition, "==");
                    if (parts.length === 2) {
                        const left = this.evalExpr(parts[0].trim());
                        const right = this.evalExpr(parts[1].trim());
                        return left == right;
                    }
                }
                
                if (condition.includes("!=")) {
                    const parts = this.smartSplit(condition, "!=");
                    if (parts.length === 2) {
                        const left = this.evalExpr(parts[0].trim());
                        const right = this.evalExpr(parts[1].trim());
                        return left != right;
                    }
                }
                
                if (condition.includes(">=")) {
                    const parts = this.smartSplit(condition, ">=");
                    if (parts.length === 2) {
                        const left = Number(this.evalExpr(parts[0].trim()));
                        const right = Number(this.evalExpr(parts[1].trim()));
                        return left >= right;
                    }
                }
                
                if (condition.includes("<=")) {
                    const parts = this.smartSplit(condition, "<=");
                    if (parts.length === 2) {
                        const left = Number(this.evalExpr(parts[0].trim()));
                        const right = Number(this.evalExpr(parts[1].trim()));
                        return left <= right;
                    }
                }
                
                if (condition.includes(">")) {
                    const parts = this.smartSplit(condition, ">");
                    if (parts.length === 2) {
                        const left = Number(this.evalExpr(parts[0].trim()));
                        const right = Number(this.evalExpr(parts[1].trim()));
                        return left > right;
                    }
                }
                
                if (condition.includes("<")) {
                    const parts = this.smartSplit(condition, "<");
                    if (parts.length === 2) {
                        const left = Number(this.evalExpr(parts[0].trim()));
                        const right = Number(this.evalExpr(parts[1].trim()));
                        return left < right;
                    }
                }
                
                // If no operators, evaluate as expression and check truthiness
                const result = this.evalExpr(condition);
                return !!result;
            };

            // Evaluate expressions (simplified version without list/map literals)
            this.evalExpr = function(expr, depth = 0) {
                if (depth > MAX_EVAL_DEPTH) {
                    console.error("MiniScript Error: Maximum evaluation depth exceeded. Possible infinite recursion with expression: " + expr);
                    return null; 
                }
                expr = this.stripInlineComment(expr.trim());

                // Handle parenthesized expressions first
                if (expr.startsWith('(') && expr.endsWith(')')) {
                    let parenBalance = 0;
                    let isOuterPair = true;
                    for (let k = 0; k < expr.length - 1; k++) { 
                        if (expr[k] === '(') parenBalance++;
                        else if (expr[k] === ')') parenBalance--;
                        if (parenBalance === 0 && k < expr.length - 2) { 
                            isOuterPair = false;
                            break;
                        }
                    }
                    let finalParenBalance = 0;
                    for(let char of expr) {
                        if (char === '(') finalParenBalance++;
                        else if (char === ')') finalParenBalance--;
                    }

                    if (isOuterPair && finalParenBalance === 0 && expr.length > 2) {
                        const innerExpr = expr.substring(1, expr.length - 1).trim();
                        if (innerExpr !== "") {
                            return this.evalExpr(innerExpr, depth + 1);
                        }
                    }
                }
                  // String literal
                if (expr.startsWith('"') && expr.endsWith('"')) {
                    let str = expr.substring(1, expr.length-1);
                    // Handle escape sequences
                    str = str.replace(/\\n/g, '\n');
                    str = str.replace(/\\t/g, '\t');
                    str = str.replace(/\\r/g, '\r');
                    str = str.replace(/\\\\/g, '\\');
                    str = str.replace(/\\"/g, '"');
                    return str;
                }
                
                // Number literal
                if (!isNaN(Number(expr))) {
                    return Number(expr);
                }                // Boolean literals
                if (expr === "true") return true;
                if (expr === "false") return false;
                if (expr === "null") return null;

                if (expr.startsWith('[') && expr.endsWith(']')) {
                    if (this.findOpenBracketForOuterIndex(expr, expr.length - 1) === 0) {
                        const listContent = expr.substring(1, expr.length - 1).trim();
                        if (listContent === "") {
                            return enhanceList([]); 
                        }
                        
                        let items = [];
                        let currentItem = "";
                        let inString = false;
                        let nestBracketDepth = 0; 
                        let parenDepth = 0; 
                        let braceDepth = 0;
                        
                        for (let i = 0; i < listContent.length; i++) {
                            const char = listContent[i];
                            
                            if (char === '"' && (i === 0 || listContent[i-1] !== '\\')) {
                                inString = !inString;
                                currentItem += char;
                            } else if (!inString) {
                                if (char === '[') {
                                    nestBracketDepth++;
                                    currentItem += char;
                                } else if (char === ']') {
                                    nestBracketDepth--;
                                    currentItem += char;
                                } else if (char === '(') {
                                    parenDepth++;
                                    currentItem += char;
                                } else if (char === ')') {
                                    parenDepth--;
                                    currentItem += char;
                                } else if (char === '{') {
                                    braceDepth++;
                                    currentItem += char;
                                } else if (char === '}') {
                                    braceDepth--;
                                    currentItem += char;
                                } else if (char === ',' && nestBracketDepth === 0 && parenDepth === 0 && braceDepth === 0) {
                                    items.push(currentItem.trim());
                                    currentItem = "";
                                } else {
                                    currentItem += char;
                                }
                            } else {
                                currentItem += char;
                            }
                        }
                        
                        if (currentItem.trim()) {
                            items.push(currentItem.trim());
                        }
                        return enhanceList(items.map(item => this.evalExpr(item.trim(), depth + 1)));
                    }
                }

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
                    return Number(this.evalExpr(inner, depth + 1));
                }
                
                // sqrt() function
                if (expr.startsWith("sqrt(")) {
                    const inner = expr.substring(5, expr.length - 1);
                    const value = Number(this.evalExpr(inner, depth + 1));
                    return Math.sqrt(value);
                }
                
                // round() function
                if (expr.startsWith("round(")) {
                    const inner = expr.substring(6, expr.length - 1);
                    const value = Number(this.evalExpr(inner, depth + 1));
                    return Math.round(value);
                }
                  // range() function
                if (expr.startsWith("range(")) {
                    const argsStr = expr.substring(6, expr.length - 1);
                    const args = this.parseArguments(argsStr).map(arg => this.evalExpr(arg, depth + 1));
                    
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
                }// slice() function - MiniScript compatible
                if (expr.startsWith("slice(")) {
                    const argsStr = expr.substring(6, expr.length - 1);
                    const args = this.parseArguments(argsStr); // parseArguments doesn't call evalExpr
                    
                    if (args.length < 2 || args.length > 3) {
                        console.error("slice() requires 2-3 arguments: list, startIndex, [endIndex]");
                        return [];
                    }
                    
                    const list = this.evalExpr(args[0], depth + 1);
                    const startIdx = this.evalExpr(args[1], depth + 1); 
                    const endIdx = args.length === 3 ? this.evalExpr(args[2], depth + 1) : null;
                    
                    return this.variables.slice.call(this, list, startIdx, endIdx);
                }                  // Arithmetic operations
                if (expr.includes("+")) {
                    const parts = this.smartSplit(expr, "+");
                    if (parts.length >= 2) { // Handle binary and multi-part additions
                        // For multi-part additions like A+B+C, evaluate left-to-right: (A+B)+C
                        let result = this.evalExpr(parts[0].trim(), depth + 1);
                        
                        for (let i = 1; i < parts.length; i++) {
                            const right = this.evalExpr(parts[i].trim(), depth + 1);
                            
                            // Handle list concatenation
                            if (Array.isArray(result) && Array.isArray(right)) {
                                result = enhanceList([...result, ...right]);
                            }                            // Handle string concatenation: if either operand is a string, result is string.
                            else if (typeof result === 'string' || typeof right === 'string') {
                                // Use arrayToString only for arrays, regular toString for other types
                                const leftStr = Array.isArray(result) ? this.arrayToString(result) : String(result);
                                const rightStr = Array.isArray(right) ? this.arrayToString(right) : String(right);
                                result = leftStr + rightStr;
                            }
                            // Otherwise, assume numeric addition
                            else {
                                result = Number(result) + Number(right);
                            }
                        }
                        
                        return result;
                    }
                }
                  if (expr.includes("-")) {
                    const parts = this.smartSplit(expr, "-");
                    if (parts.length >= 2) { // Handle binary and multi-part subtractions
                        let result = Number(this.evalExpr(parts[0].trim(), depth + 1));
                        
                        for (let i = 1; i < parts.length; i++) {
                            const right = Number(this.evalExpr(parts[i].trim(), depth + 1));
                            result = result - right;
                        }
                        
                        return result;
                    }
                }
                  if (expr.includes("*")) {
                    const parts = this.smartSplit(expr, "*");
                    if (parts.length >= 2) { // Handle binary and multi-part multiplications
                        let result = Number(this.evalExpr(parts[0].trim(), depth + 1));
                        
                        for (let i = 1; i < parts.length; i++) {
                            const right = Number(this.evalExpr(parts[i].trim(), depth + 1));
                            result = result * right;
                        }
                        
                        return result;
                    }
                }
                  if (expr.includes("/")) {
                    const parts = this.smartSplit(expr, "/");
                    if (parts.length >= 2) { // Handle binary and multi-part divisions
                        let result = Number(this.evalExpr(parts[0].trim(), depth + 1));
                        
                        for (let i = 1; i < parts.length; i++) {
                            const right = Number(this.evalExpr(parts[i].trim(), depth + 1));
                            if (right === 0) {
                                console.error("Runtime Error: Division by zero.");
                                return null;
                            }                            result = result / right;
                        }
                        
                        return result;
                    }
                }
                
                // --- INDEXING LOGIC (after arithmetic operations) ---
                if (expr.endsWith(']')) {
                    const openBracketForFinalIndex = this.findOpenBracketForOuterIndex(expr, expr.length - 1);

                    if (openBracketForFinalIndex !== -1) { 
                        const baseExprStr = expr.substring(0, openBracketForFinalIndex).trim();
                        const indexExprStr = expr.substring(openBracketForFinalIndex + 1, expr.length - 1).trim();

                        if (baseExprStr !== "") {
                            const baseVal = this.evalExpr(baseExprStr, depth + 1);
                            
                            if (baseVal === null || baseVal === undefined) {
                                console.error("Index Error: Cannot access property of null or undefined from base expression '" + baseExprStr + "' in: " + expr);
                                return null;
                            }

                            const indexVal = this.evalExpr(indexExprStr, depth + 1);
                            let indexedOnceVal;

                            if (Array.isArray(baseVal)) {
                                const numIndex = Number(indexVal);
                                if (!isNaN(numIndex) && numIndex >= 0 && numIndex < baseVal.length) {
                                    indexedOnceVal = baseVal[numIndex];
                                    if (Array.isArray(indexedOnceVal)) {
                                        enhanceList(indexedOnceVal); 
                                    }
                                } else {
                                    return null; 
                                }
                            } else if (typeof baseVal === 'object' && baseVal !== null && !(baseVal instanceof Function)) { 
                                indexedOnceVal = baseVal[String(indexVal)];
                                if (indexedOnceVal === undefined && !baseVal.hasOwnProperty(String(indexVal))) {
                                     return null;
                                }
                            } else if (typeof baseVal === 'string') { 
                                const numIndex = Number(indexVal);
                                if (!isNaN(numIndex) && numIndex >= 0 && numIndex < baseVal.length) {
                                    indexedOnceVal = baseVal.charAt(numIndex);
                                } else {
                                    return null;
                                }
                            } else {
                                // If baseVal is not indexable, return null (MiniScript behavior)
                                return null;
                            }
                            
                            return indexedOnceVal; 
                        }
                    }
                }
                
                // THIS OLD INDEXING BLOCK IS NOW REPLACED/HANDLED BY THE REVISED INDEXING LOGIC AT THE TOP OF evalExpr
                /*
                const firstOpenBracket = expr.indexOf('[');
                if (firstOpenBracket !== -1 && expr.endsWith(']')) { // Potential indexing
                    const matchingCloseBracket = this.findMatchingBracket(expr, firstOpenBracket);

                    if (matchingCloseBracket !== -1) {
                        const baseExpr = expr.substring(0, firstOpenBracket).trim();
                        const indexExprStr = expr.substring(firstOpenBracket + 1, matchingCloseBracket).trim();
                        const remainderExprStr = expr.substring(matchingCloseBracket + 1).trim();

                        // Only proceed with indexing if we have a valid base expression
                        // Skip if baseExpr is empty, ends with comma, or contains comma (indicating list elements)
                        if (baseExpr !== "" && !baseExpr.endsWith(",") && !baseExpr.includes(",")) {
                            const baseVal = this.evalExpr(baseExpr, depth + 1);
                            const indexVal = this.evalExpr(indexExprStr, depth + 1);

                            if (baseVal === null || baseVal === undefined) {
                                console.error("Index Error: Cannot access property of null or undefined from base expression '" + baseExpr + "' in: " + expr);
                                return null;
                            }

                            let indexedOnceVal;
                            if (Array.isArray(baseVal)) {
                                const numIndex = Number(indexVal);
                                if (!isNaN(numIndex) && numIndex >= 0 && numIndex < baseVal.length) {
                                    indexedOnceVal = baseVal[numIndex];
                                     if (Array.isArray(indexedOnceVal)) { // Enhance if it's an array
                                        enhanceList(indexedOnceVal);
                                    }
                                } else {
                                    console.error("Index Error: List index '" + indexVal + "' out of range for base '" + baseExpr + "' in: " + expr);
                                    return null;
                                }
                            } else if (typeof baseVal === 'object' && baseVal !== null) { // Map
                                indexedOnceVal = baseVal[String(indexVal)];
                                // MiniScript often returns null for missing map keys, check if this is desired.
                                // if (indexedOnceVal === undefined && !baseVal.hasOwnProperty(String(indexVal))) return null;
                            } else if (typeof baseVal === 'string') { // String indexing
                                const numIndex = Number(indexVal);
                                if (!isNaN(numIndex) && numIndex >= 0 && numIndex < baseVal.length) {
                                    indexedOnceVal = baseVal.charAt(numIndex);
                                } else {
                                    console.error("Index Error: String index '" + indexVal + "' out of range for base '" + baseExpr + "' in: " + expr);
                                    return null;
                                }
                            } else {
                                console.error("TypeError: Base expression '" + baseExpr + "' (type: " + typeof baseVal + ") is not indexable in: " + expr);
                                return null;
                            }

                            if (remainderExprStr === "") {
                                return indexedOnceVal;
                            } else {
                                // Handle chained indexing by recursively evaluating the remainder
                                // This part needs to be robust. The new structure handles chaining via recursion on baseExpr.
                                // For example, if expr is "val[0][1]", baseExpr becomes "val[0]", remainder is "[1]".
                                // The recursive call to evalExpr("val[0]") will handle the first indexing.
                                // The result of that (e.g., an inner list) becomes the base for the next indexing operation.
                                // The current revised logic at the top of evalExpr should handle this naturally.
                                // Let's ensure the new logic correctly passes the already evaluated `indexedOnceVal`
                                // if we were to reconstruct the expression.
                                // However, the new model is: eval( (eval(base)) [index] )
                                // So, if `indexedOnceVal` is the result of `base[index]`, and there's a `remainderExprStr` like `[nextIndex]`,
                                // we need to evaluate `indexedOnceVal[nextIndex]`.
                                // The current top-level indexing logic should handle this by parsing `indexedOnceValAsString + remainderExprStr`.
                                // This is tricky. The current refactoring aims to avoid this explicit remainder handling.
                                // The recursive call `this.evalExpr(baseExprStr, depth + 1)` should resolve `val[0]`.
                                // The result of that is `baseVal`. Then `baseVal[indexVal]` (where indexVal is from `indexExprStr`) is computed.
                                // This seems to cover one level of indexing. Chained indexing like `a[b][c]` means `(a[b])[c]`.
                                // `evalExpr("a[b][c]")` -> base="a[b]", index="c". `evalExpr("a[b]")` is called.
                                // This recursive structure should handle chaining.
                                console.warn("Old chained indexing path hit, this should ideally be handled by recursive base evaluation.");
                                // Fallback or ensure the new structure fully replaces this.
                                // The new structure should make this block unreachable or unnecessary.
                                let tempVarName = "_tempIndexed_" + Date.now();
                                this.variables[tempVarName] = indexedOnceVal;
                                let result = this.evalExpr(tempVarName + remainderExprStr, depth + 1);
                                delete this.variables[tempVarName];
                                return result;
                            }
                        }
                    }
                }
                */
                
                // Handle list method calls with chaining: baseExpr.method(args)
                // Supports chaining like list.push(1).push(2)
                // We'll use a loop to handle multiple chained calls
                let methodCallMatch = expr.match(/^(.*?)(?:\.(pop|pull|push)\(([^)]*)\))+$/);
                if (methodCallMatch) {
                    // Split the expression into base and method calls
                    // We'll use a regex to extract all method calls in order
                    let baseExpr = expr;
                    let methodCalls = [];
                    let methodCallRegex = /\.(pop|pull|push)\(([^)]*)\)/g;
                    let m;
                    // Find the first base expression (before the first .method())
                    let firstDot = expr.indexOf('.');
                    if (firstDot === -1) {
                        baseExpr = expr;
                    } else {
                        baseExpr = expr.substring(0, firstDot);
                    }
                    // Collect all method calls in order
                    let rest = expr.substring(firstDot);
                    while ((m = methodCallRegex.exec(rest)) !== null) {
                        methodCalls.push({ method: m[1], argStr: m[2] });
                    }
                    // Evaluate the base expression
                    let value = this.evalExpr(baseExpr, depth + 1);
                    // Apply each method call in order
                    for (let call of methodCalls) {
                        if (!Array.isArray(value)) {
                            console.error("Method '" + call.method + "' called on non-list value");
                            return null;
                        }
                        enhanceList(value);
                        if (call.method === "push") {
                            const arg = call.argStr.length ? this.evalExpr(call.argStr, depth + 1) : undefined;
                            value = value.push(arg); // returns the list for chaining
                        } else if (call.method === "pop" || call.method === "pull") {
                            value = value[call.method]();
                        }
                    }
                    return value;
                }
                
                // At the end of evalExpr, after all other checks:
                if (this.variables.hasOwnProperty(expr)) {
                    return this.variables[expr];
                }
                // If nothing else matches, return null (no error log)
                return null;
            };
        }
    };
})();
