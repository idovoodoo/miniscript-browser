// test-built-in-functions.ms - Tests for built-in MiniScript functions
// This test ensures that built-in functions continue to work

// Test properties for our canvas
text = "Testing Built-in Functions"
textX = 160
textY = 120
textColor = "#BB66FF"

print "=== Built-in Functions Test ==="

// Math functions
print "\nMath functions:"
print "sqrt(16): " + sqrt(16)
print "round(3.7): " + round(3.7)
print "pi constant: " + pi

// Range function
print "\nRange function:"
print "range(5): " + range(5)  // [0, 1, 2, 3, 4]
print "range(2, 8): " + range(2, 8)  // [2, 3, 4, 5, 6, 7, 8]
print "range(10, 2, -2): " + range(10, 2, -2)  // [10, 8, 6, 4, 2]

// Value conversion
print "\nValue conversion:"
print "val(\"42\"): " + val("42")
print "val(\"3.14\"): " + val("3.14")

// Test that enhanced list methods don't break built-ins
testList = range(5)
print "\nUsing built-in function after list methods:"
testList.push(5)
print "After push: " + testList
print "sqrt(16) after list methods: " + sqrt(16)

print "\n=== Built-in Functions Test Complete ==="
