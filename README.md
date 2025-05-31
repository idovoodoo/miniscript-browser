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
- Map support:
  - Map literals (`{"key": value, "key2": value2}`)
  - Key-based access (`mapVar["key"]`)
  - Key-based assignment (`mapVar["key"] = value`)
  - Nested maps (`{"user": {"name": "John", "age": 30}}`)
  - Map methods (`hasIndex()`, `indexes()`, `values()`, `remove()`, `clear()`)
  - Map iteration (`for key in map`, `for key, value in map`)
- String indexing (e.g., `"hello"[0]`)

## Project Structure

- `lib/miniscript-shim.js` - The main MiniScript interpreter
- `index.html` - Browser interface with canvas support
- `game.js` - Game loop and MiniScript integration
- `tests/` - Directory containing MiniScript test files:
  - `test-master.ms` - Main test menu
  - `test-list-methods.ms` - List method tests
  - `test-nested-lists.ms` - Nested list tests
  - `test-string-operations.ms` - String operation tests
  - `test-list-bounds.ms` - List boundary tests
  - `test-slice-function.ms` - Slice function tests
  - `test-built-in-functions.ms` - Built-in function tests
  - `test-map.ms` - Map functionality tests

## Usage

1. Start a web server in the project directory
2. Open `index.html` in a browser
3. Use the test buttons to run different test suites
4. View the results in the console output below the canvas

## Testing

- Use the test buttons in the UI to run different test suites:
  - List Methods - Test basic list methods (push, pop, pull)
  - Nested Lists - Test operations on nested lists
  - Chained Indexing - Test chained indexing with nested lists
  - String Operations - Test string operations and concatenation
  - List Bounds - Test list boundary checking
  - Slice Function - Test the slice() function
  - Built-in Functions - Test built-in functions (sqrt, round, etc.)
  - Maps - Test map operations and methods
