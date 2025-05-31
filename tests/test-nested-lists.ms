// test-nested-lists.ms - Tests for nested list operations
// This test focuses on nested lists and method calls on them

// Test properties for our canvas
text = "Testing Nested Lists"
textX = 160
textY = 120
textColor = "#00AAFF"

print "=== Nested List Test ==="

// Create a nested list
nestedList = [[1, 2], [3, 4]]
print "Original nested list: " + nestedList

// Test push with nested list
nestedList.push([5, 6])
print "After push([5, 6]): " + nestedList

// Store the popped value first to avoid concatenation error
poppedValue = nestedList.pop()
print "Popped value from nested list: " + poppedValue

// Test operations on the popped sublist
if poppedValue != null then
    print "First element of popped sublist: " + poppedValue[0]
    print "Second element of popped sublist: " + poppedValue[1]
end if

print "Final nested list: " + nestedList

// Test deep nesting
deepList = [1, [2, [3, 4]], 5]
print "\nDeep nested list: " + deepList
print "Second element: " + deepList[1]
print "Nested element: " + deepList[1][1]

print "\n=== Nested List Test Complete ==="
