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

## Project Structure

- `lib/miniscript-shim.js` - The main MiniScript interpreter
- `index.html` - Browser interface with canvas support
- `game.js` - Game loop and MiniScript integration
- `script.ms` - Example MiniScript code
- `test-clean.ms` - Test suite for the interpreter

## Usage

1. Start a web server in the project directory
2. Open `index.html` in a browser
3. The interpreter will execute the MiniScript code from `script.ms`

## Testing

Run `test-clean.ms` to verify the basic functionality of the interpreter.
