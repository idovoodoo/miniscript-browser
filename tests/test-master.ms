// test-master.ms - Master test script that runs all tests
// This file doesn't actually execute the other tests, but provides
// a menu of tests to choose from by changing which file game.js loads

// Test properties for our canvas
text = "MiniScript Tests"
textX = 160
textY = 60
textColor = "#FFFFFF"

// Display test menu
print "=== MiniScript Test Menu ==="
print "To run a specific test, update game.js to load the desired test file:"
print "1. test-list-methods.ms - Basic list methods (push, pop, pull)"
print "2. test-nested-lists.ms - Operations on nested lists"
print "3. test-string-operations.ms - String concatenation and operations"
print "4. test-list-bounds.ms - List boundary checking"
print "5. test-slice-function.ms - Slice function tests"
print "6. test-built-in-functions.ms - Built-in function tests"
print ""
print "============================="
print "All tests should be run individually to verify functionality."

// Additional text for canvas visualization
extraText1 = "Available Tests:"
extraText1X = 160
extraText1Y = 100
extraText1Color = "#AAFFAA"

extraText2 = "1. List Methods  2. Nested Lists  3. Strings"
extraText2X = 160
extraText2Y = 130
extraText2Color = "#AAAAFF"

extraText3 = "4. List Bounds  5. Slice Function  6. Built-ins"
extraText3X = 160
extraText3Y = 150
extraText3Color = "#FFAAAA"

extraText4 = "Change the test file in game.js to run a test"
extraText4X = 160
extraText4Y = 190
extraText4Color = "#FFFF88"
