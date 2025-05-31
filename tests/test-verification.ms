// test-verification.ms - Verification test for the fixes
// This test verifies that the issues with nested lists and expressions have been resolved

// Test properties for our canvas
text = "Verification Test"
textX = 160
textY = 120
textColor = "#00FF00"

print "=== Verification Test ==="

// Test 1: Basic nested list operations
print "\nTest 1: Basic nested list operations"
nestedList = [[1, 2], [3, 4]]
print "Original: " + nestedList
nestedList.push([5, 6])
print "After push: " + nestedList
poppedValue = nestedList.pop()
print "Popped: " + poppedValue

// Test 2: Complex string concatenation with indexing
print "\nTest 2: Complex expressions"
if poppedValue != null then
    print "First element of popped value: " + poppedValue[0]
    print "Second element of popped value: " + poppedValue[1]
end if

// Test 3: Escape sequences
print "\nTest 3: Escape sequences"
print "Line 1\nLine 2\nLine 3"

// Test 4: Deep nesting
print "\nTest 4: Deep nesting"
deepList = [1, [2, [3, 4]], 5]
print "Deep list: " + deepList
print "Access deep element: " + deepList[1][1][0]

print "\n=== All Tests Complete ==="
