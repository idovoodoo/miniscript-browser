// test-string-operations.ms - Tests for string operations and concatenation
// This test checks string operations, especially with list concatenation

// Test properties for our canvas
text = "Testing String Operations"
textX = 160
textY = 120
textColor = "#FFBB00"

print "=== String Operations Test ==="

// Simple string operations
str1 = "Hello"
str2 = "World"
print str1 + " " + str2

// String and number concatenation
num = 42
print "The answer is: " + num

// String and list concatenation
myList = [1, 2, 3]
print "My list: " + myList

// Concatenation with method results
numList = [5, 6, 7, 8, 9]
print "Popped value: " + numList.pop()
print "List after pop: " + numList
print "Pulled value: " + numList.pull()
print "List after pull: " + numList

// String indexing
message = "Testing"
print "First character: " + message[0]
print "Last character: " + message[6]

print "\n=== String Operations Test Complete ==="
