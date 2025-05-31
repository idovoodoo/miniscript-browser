// test-slice-function.ms - Tests for the slice() function
// This test focuses on the slice function with various input parameters

// Test properties for our canvas
text = "Testing Slice Function"
textX = 160
textY = 120
textColor = "#66DD66"

print "=== Slice Function Test ==="

// Create a test list
myList = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
print "Original list: " + myList

// Basic slicing
print "\nBasic slicing:"
print "slice(myList, 0, 5): " + slice(myList, 0, 5)  // [10, 20, 30, 40, 50]
print "slice(myList, 5, 10): " + slice(myList, 5, 10)  // [60, 70, 80, 90, 100]
print "slice(myList, 2, 7): " + slice(myList, 2, 7)  // [30, 40, 50, 60, 70]

// Default end parameter
print "\nDefault end parameter:"
print "slice(myList, 7): " + slice(myList, 7)  // [80, 90, 100]

// Negative indices
print "\nNegative indices:"
print "slice(myList, -3): " + slice(myList, -3)  // [80, 90, 100]
print "slice(myList, 3, -2): " + slice(myList, 3, -2)  // [40, 50, 60, 70, 80]

// Out of bounds indices (should clamp to valid range)
print "\nOut of bounds indices:"
print "slice(myList, -20, 5): " + slice(myList, -20, 5)  // [10, 20, 30, 40, 50]
print "slice(myList, 7, 20): " + slice(myList, 7, 20)  // [80, 90, 100]

// Invalid ranges (should return empty list)
print "\nInvalid ranges:"
print "slice(myList, 8, 3): " + slice(myList, 8, 3)  // []
print "slice(myList, 15, 20): " + slice(myList, 15, 20)  // []

// Slicing with nested lists
nestedList = [[1, 2], [3, 4], [5, 6], [7, 8]]
print "\nNested list: " + nestedList
print "slice(nestedList, 1, 3): " + slice(nestedList, 1, 3)  // [[3, 4], [5, 6]]

print "\n=== Slice Function Test Complete ==="
