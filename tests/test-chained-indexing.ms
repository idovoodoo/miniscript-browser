// test-chained-indexing.ms - Specific test for chained indexing
// This test focuses specifically on chained indexing functionality

// Test properties for our canvas
text = "Testing Chained Indexing"
textX = 160
textY = 120
textColor = "#FF8800"

print "=== Chained Indexing Test ==="

// Create a simple nested structure
simpleNested = [[1, 2], [3, 4]]
print "Simple nested: " + simpleNested
print "First subarray: " + simpleNested[0]
print "First element of first subarray: " + simpleNested[0][0]
print "Second element of first subarray: " + simpleNested[0][1]
print "Second subarray: " + simpleNested[1]
print "First element of second subarray: " + simpleNested[1][0]
print "Second element of second subarray: " + simpleNested[1][1]

// Create a deeper nested structure
deepNested = [1, [2, [3, 4]], 5]
print "\nDeep nested: " + deepNested
print "First element: " + deepNested[0]
print "Second element: " + deepNested[1]
print "Second element, first sub: " + deepNested[1][0]
print "Second element, second sub: " + deepNested[1][1]
print "Deep nested element: " + deepNested[1][1][0]
print "Deeper nested element: " + deepNested[1][1][1]
print "Third element: " + deepNested[2]

// Test with mixed types
mixedNested = ["hello", [10, 20], ["a", "b"]]
print "\nMixed nested: " + mixedNested
print "String element: " + mixedNested[0]
print "Number array: " + mixedNested[1]
print "First number: " + mixedNested[1][0]
print "String array: " + mixedNested[2]
print "First string in array: " + mixedNested[2][0]

print "\n=== Chained Indexing Test Complete ==="
