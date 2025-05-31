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
                        return [];
                    }
                    // Convert indices to numbers
                    startIdx = Number(startIdx);
                    if (isNaN(startIdx)) startIdx = 0;
                    if (endIdx === null || typeof endIdx === 'undefined') {
                        endIdx = list.length;
                    } else {
                        endIdx = Number(endIdx);
                        if (isNaN(endIdx)) endIdx = list.length;
                    }
                    // Handle negative indices (MiniScript: clamp to 0 if too negative)
                    if (startIdx < 0) startIdx = Math.max(0, list.length + startIdx);
                    if (endIdx < 0) endIdx = Math.max(0, list.length + endIdx);
                    // Clamp indices to valid range
                    startIdx = Math.max(0, Math.min(startIdx, list.length));
                    endIdx = Math.max(0, Math.min(endIdx, list.length));
                    // Return empty if range is invalid
                    if (startIdx >= endIdx) return [];
                    return list.slice(startIdx, endIdx);
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
            };

            // Parse function arguments, respecting nested structures
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
            this.evalExpr = function(expr, depth = 0) {
                if (depth > MAX_EVAL_DEPTH) {
                    console.error("MiniScript Error: Maximum evaluation depth exceeded. Possible infinite recursion with expression: " + expr);
                    return null; 
                }
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
                
                // List literal parsing [1, 2, 3]
                if (expr.startsWith('[') && expr.endsWith(']')) {
                    const listContent = expr.substring(1, expr.length - 1).trim();
                    if (listContent === "") {
                        return []; // Empty list
                    }
                    
                    // Parse list items, respecting nested structures
                    let items = [];
                    let currentItem = "";
                    let inString = false;
                    let bracketDepth = 0;
                    let braceDepth = 0;
                    
                    for (let i = 0; i < listContent.length; i++) {
                        const char = listContent[i];
                        
                        if (char === '"' && (i === 0 || listContent[i-1] !== '\\')) {
                            inString = !inString;
                            currentItem += char;
                        } else if (char === '[') {
                            bracketDepth++;
                            currentItem += char;
                        } else if (char === ']') {
                            bracketDepth--;
                            currentItem += char;
                        } else if (char === '{') {
                            braceDepth++;
                            currentItem += char;
                        } else if (char === '}') {
                            braceDepth--;
                            currentItem += char;
                        } else if (char === ',' && !inString && bracketDepth === 0 && braceDepth === 0) {
                            // Item separator found
                            items.push(currentItem.trim());
                            currentItem = "";
                        } else {
                            currentItem += char;
                        }
                    }
                    
                    // Add the last item
                    if (currentItem.trim()) {
                        items.push(currentItem.trim());
                    }
                    
                    // Evaluate each item in the list
                    return items.map(item => this.evalExpr(item.trim(), depth + 1));
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
                }
                
                // Arithmetic operations
                if (expr.includes("+")) {
                    const parts = expr.split("+");
                    if (parts.length === 2) {
                        const left = this.evalExpr(parts[0].trim(), depth + 1);
                        const right = this.evalExpr(parts[1].trim(), depth + 1);
                        // Handle list concatenation
                        if (Array.isArray(left) && Array.isArray(right)) {
                            return [...left, ...right]; // Concatenate arrays
                        }                        // Handle string concatenation
                        if (typeof left === 'string' || typeof right === 'string') {
                            return this.arrayToString(left) + this.arrayToString(right);
                        }
                        return Number(left) + Number(right);
                    }
                }
                
                if (expr.includes("-")) {
                    const parts = expr.split("-");
                    if (parts.length === 2) {
                        const left = this.evalExpr(parts[0].trim(), depth + 1);
                        const right = this.evalExpr(parts[1].trim(), depth + 1);
                        return Number(left) - Number(right);
                    }
                }
                
                if (expr.includes("*")) {
                    const parts = expr.split("*");
                    if (parts.length === 2) {
                        const left = this.evalExpr(parts[0].trim(), depth + 1);
                        const right = this.evalExpr(parts[1].trim(), depth + 1);
                        return Number(left) * Number(right);
                    }
                }
                
                if (expr.includes("/")) {
                    const parts = expr.split("/");
                    if (parts.length === 2) {
                        const left = this.evalExpr(parts[0].trim(), depth + 1);
                        const right = this.evalExpr(parts[1].trim(), depth + 1);
                        if (right === 0) {
                            console.error("Runtime Error: Division by zero.");
                            return null;
                        }
                        return Number(left) / Number(right);
                    }
                }                
                
                // List or Map indexing (e.g., myList[0], myMap["key"], myList[0][1], "string"[0])
                const firstOpenBracket = expr.indexOf('[');
                if (firstOpenBracket !== -1 && expr.endsWith(']')) { // Potential indexing
                    const matchingCloseBracket = this.findMatchingBracket(expr, firstOpenBracket);

                    if (matchingCloseBracket !== -1) {
                        const baseExpr = expr.substring(0, firstOpenBracket).trim();
                        const indexExprStr = expr.substring(firstOpenBracket + 1, matchingCloseBracket).trim();
                        const remainderExprStr = expr.substring(matchingCloseBracket + 1).trim();

                        let baseVal;
                        if (baseExpr === "") { // e.g. "[1,2,3][0]"
                            // This implies the base is a list literal that should have been parsed by list literal logic
                            // However, if it's a result of a function call like func()[0] then baseExpr would be func()
                            // This case needs careful handling. If baseExpr is empty, it means expr started with '['.
                            // If it's a list literal like "[1,2][0]", it should have been handled by list literal parsing first.
                            // This path is for when the base is an expression that evaluates to an indexable type.
                            // For "[1,2,3][0]", this logic might be re-entered if not careful.
                            // Let's assume evalExpr(baseExpr) is the right thing if baseExpr is not empty.
                            // If baseExpr is empty, it means the expression was like `[...][index]`.
                            // This should have been caught by list literal parsing if it was `[[1,2]][0]`
                            // The `expr.endsWith(']')` and `firstOpenBracket !== -1` is the main gate.
                            // If `expr` is `[1,2][0]`, `baseExpr` is `""`. This is wrong.
                            // It should be: `baseExpr` is `[1,2,3]`. `indexExprStr` is `0`. `remainderExprStr` is `""`.
                            // This means `firstOpenBracket` should be the one for *indexing*, not for list literal.

                            // Let's refine: the indexing operation is `(someExpr)[index]`
                            // `someExpr` is `expr.substring(0, firstOpenBracket)`
                            // `index` is `expr.substring(firstOpenBracket + 1, matchingCloseBracket)`
                            if (baseExpr === "" && expr.startsWith("[") && matchingCloseBracket === expr.length -1 - remainderExprStr.length) {
                                // This is a list literal being indexed, e.g. "[1,2,3][0]"
                                // The list literal itself is the base.
                                baseVal = this.evalExpr(expr.substring(0, matchingCloseBracket + 1), depth +1);
                                // And the index is what follows. This is getting complicated.

                                // Simpler: The current parsing of baseExpr, indexExprStr, remainderExprStr is for `A[B]C`
                                // where C is `remainderExprStr`.
                                // If `expr = "[1,2,3][0]"`:
                                // `firstOpenBracket = 0`. `baseExpr = ""`. `matchingCloseBracket = 4` (for `[1,2]`).
                                // `indexExprStr = "1,2"`. `remainderExprStr = "[0]"`. This is not right.

                                // The structure is: `ContainerExpr IndexOp IndexValue Remainder`
                                // `ContainerExpr` is `expr.substring(0, firstOpenBracket)`
                                // `IndexValue` is `expr.substring(firstOpenBracket+1, matchingCloseBracket)`
                                // `Remainder` is `expr.substring(matchingCloseBracket+1)`
                                // This seems generally correct. Let's test `baseExpr = ""`
                                if (baseExpr === "") {
                                     console.error("Syntax Error: Indexing an empty base expression in: " + expr);
                                     return null;
                                }
                            }
                            // Fallthrough to evaluate baseExpr normally
                        }


                        baseVal = this.evalExpr(baseExpr, depth + 1);
                        const indexVal = this.evalExpr(indexExprStr, depth + 1);

                        if (baseVal === null || baseVal === undefined) {
                            console.error("Index Error: Cannot access property of null or undefined from base expression \'" + baseExpr + "\' in: " + expr);
                            return null;
                        }

                        let indexedOnceVal;
                        if (Array.isArray(baseVal)) {
                            const numIndex = Number(indexVal);
                            if (!isNaN(numIndex) && numIndex >= 0 && numIndex < baseVal.length) {
                                indexedOnceVal = baseVal[numIndex];
                            } else {
                                console.error("Index Error: List index \'" + indexVal + "\' out of range for base \'" + baseExpr + "\' in: " + expr);
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
                                console.error("Index Error: String index \'" + indexVal + "\' out of range for base \'" + baseExpr + "\' in: " + expr);
                                return null;
                            }
                        } else {
                            console.error("TypeError: Base expression \'" + baseExpr + "\' (type: " + typeof baseVal + ") is not indexable in: " + expr);
                            return null;
                        }

                        if (remainderExprStr === "") {
                            return indexedOnceVal;
                        } else {
                            // Handle chained indexing like a[b][c] -> remainderExprStr would be "[c]"
                            // We need to evaluate indexedOnceVal[c]
                            // Create a temporary variable to hold indexedOnceVal
                            const tempVarName = "__evalExpr_temp_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
                            this.variables[tempVarName] = indexedOnceVal;
                            let finalResult;
                            try {
                                // The remainderExprStr should start with '[' for valid chained indexing
                                if (!remainderExprStr.startsWith('[')) {
                                     console.error("Syntax Error: Invalid chained indexing. Expected '[' after first index operation in: " + expr + ". Remainder: " + remainderExprStr);
                                     return null;
                                }
                                finalResult = this.evalExpr(tempVarName + remainderExprStr, depth + 1);
                            } finally {
                                delete this.variables[tempVarName];
                            }
                            return finalResult;
                        }
                    }
                    // If no matching bracket, or not endsWith ']', it might not be an indexing op, or malformed.
                    // Fall through to variable lookup or return as string.
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
