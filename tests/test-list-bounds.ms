// test-list-bounds.ms - Tests for list bounds checking
// This tests index boundary conditions for lists

// Test properties for our canvas
text = "Testing List Bounds"
textX = 160
textY = 120
textColor = "#FF5533"

print "=== List Bounds Test ==="

// Create test list
testList = [10, 20, 30, 40, 50]
print "Test list: " + testList

// Valid indices
print "Index 0: " + testList[0]
print "Index 2: " + testList[2]
print "Last index (4): " + testList[4]

// Bounds errors - these should display appropriate error messages
print "\nTesting out-of-bounds access:"
// Uncomment to test bounds errors:
//print "Index 5 (out of bounds): " + testList[5]
//print "Index -1 (negative): " + testList[-1]

// Test assignment at bounds
print "\nTesting assignments:"
testList[0] = 15
testList[4] = 55
print "After assignment: " + testList

// Uncomment to test bounds errors for assignment:
//testList[5] = 60
//print "After invalid assignment: " + testList

// Empty list bounds
emptyList = []
print "\nEmpty list: " + emptyList
// Uncomment to test empty list access:
//print "Access empty list: " + emptyList[0]

print "\n=== List Bounds Test Complete ==="
