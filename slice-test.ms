// MiniScript List Slice Test
// Tests the slice functionality for lists

// Canvas text properties
text = "Testing List Slice"
textX = 160
textY = 120
textColor = "#33FF33"

// Create a test list
testList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print "Original list: " + testList

// Test basic slicing
print "slice(testList, 2, 5): " + slice(testList, 2, 5)  // Should be [3, 4, 5]

// Test slice to end
print "slice(testList, 7): " + slice(testList, 7)  // Should be [8, 9, 10]

// Test negative indices (from end of list)
print "slice(testList, -3): " + slice(testList, -3)  // Should be [8, 9, 10]
print "slice(testList, -5, -2): " + slice(testList, -5, -2)  // Should be [6, 7, 8]
print "slice(testList, 2, -2): " + slice(testList, 2, -2)  // Should be [3, 4, 5, 6, 7, 8]

// Test edge cases
print "slice(testList, 0, 1): " + slice(testList, 0, 1)  // Should be [1]
print "slice(testList, 9, 10): " + slice(testList, 9, 10)  // Should be [10]

// Test invalid ranges
print "slice(testList, 5, 3): " + slice(testList, 5, 3)  // Should be []
print "slice(testList, -20, -15): " + slice(testList, -20, -15)  // Should handle out-of-bounds gracefully

// Test with empty list
emptyList = []
print "slice(emptyList, 0): " + slice(emptyList, 0)  // Should be []

// Test with nested lists
nestedList = [[1, 2], [3, 4], [5, 6]]
print "Original nested list: " + nestedList
print "slice(nestedList, 1): " + slice(nestedList, 1)  // Should be [[3, 4], [5, 6]]
print "First element of slice: " + slice(nestedList, 1)[0]  // Should be [3, 4]

print "Slice test completed!"
