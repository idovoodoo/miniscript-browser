// List bounds test
// Testing list access with in-bounds and out-of-bounds indices

// Create a test list
testList = [1, 2, 3]
print "Original list: " + testList

// Test in-bounds access
print "In-bounds access:"
print "testList[0] = " + testList[0]
print "testList[1] = " + testList[1]
print "testList[2] = " + testList[2]

// Test out-of-bounds access
print "Out-of-bounds access:"
print "testList[3] = " + testList[3]  // Should be null, not error
print "testList[10] = " + testList[10]  // Should be null, not error

// Test extension through assignment
print "Extending list through assignment:"
testList[3] = 4  // Extend by 1 (next index)
print "After testList[3] = 4: " + testList

testList[10] = 11  // Extend with gaps
print "After testList[10] = 11: " + testList

// Test out-of-bounds access after extension
print "testList[5] should be null: " + testList[5]

// Test nested list with out-of-bounds access
nestedList = [[1, 2], [3, 4]]
print "Nested list: " + nestedList
print "nestedList[0][0] = " + nestedList[0][0]  // Should be 1
print "nestedList[0][5] = " + nestedList[0][5]  // Should be null, not error
print "nestedList[5] = " + nestedList[5]  // Should be null, not error

// Try to access out-of-bounds nested element
print "Out-of-bounds nested access:"
// This should not crash but return null:
print "nestedList[5][0] = " + nestedList[5][0]

print "Bounds test completed!"
