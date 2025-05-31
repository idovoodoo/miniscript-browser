# MiniScript Browser Interpreter

A lightweight browser-based interpreter for MiniScript - a simple scripting language implementation in JavaScript.

## Features

- Basic variable assignment and arithmetic operations
- Control structures (if/else, while loops, for loops)
- Range function support
- Print statements
- Basic comparison operators
- String concatenation
- Built-in functions (input, val, sqrt, round)
- List support:
  - List literals (`[1, 2, 3]`)
  - Index-based access (`myList[0]`)
  - Index-based assignment (`myList[1] = 20`)
  - List concatenation (`myList = myList + [60]`)
  - List slicing (`slice(myList, start, end)`)
  - Proper index validation (errors on out-of-bounds access)
  - Robust chained/nested list indexing (e.g., `myList[1][0]`)
  - For-in loop support (`for item in myList`)
- String indexing (e.g., `"hello"[0]`)

## Project Structure

- `lib/miniscript-shim.js` - The main MiniScript interpreter
- `index.html` - Browser interface with canvas support
- `game.js` - Game loop and MiniScript integration
- `script.ms` - Example MiniScript code
- `test-clean.ms` - Test suite for the basic interpreter
- `list-test-basic.ms` - Test suite for list functionality

## Usage

1. Start a web server in the project directory
2. Open `index.html` in a browser
3. The interpreter will execute the MiniScript code from `script.ms`

## Testing

- Run `test-clean.ms` to verify the basic functionality of the interpreter
- Run `list-test-basic.ms` to test the basic list functionality
- Run `miniscript-list-test.ms` to test MiniScript-compliant list operations
- Run `slice-test.ms` to test the list slicing functionality
