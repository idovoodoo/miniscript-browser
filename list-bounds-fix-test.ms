// List bounds test - Testing fix for index out of range
// This test verifies that out-of-bounds list access returns null without errors

// Set canvas properties
text = "List Bounds Fix Test"
textX = 160
textY = 120
textColor = "#33FF33"

print "=== LIST BOUNDS FIX TEST ==="
print ""

// Test 1: Basic list creation and access
print "TEST 1: Basic list creation and access"
testList = [1, 2, 3]
print "Created list: " + testList
print "testList[0] = " + testList[0]  // Should be 1
print "testList[2] = " + testList[2]  // Should be 3
print ""

// Test 2: Out-of-bounds access (should return null)
print "TEST 2: Out-of-bounds access"
print "testList[5] = " + testList[5]  // Should be null, not error
if testList[5] == null
    print "SUCCESS: Out of bounds access returned null"
else
    print "FAILED: Out of bounds access didn't return null"
end if
print ""

// Test 3: Auto-extension through assignment
print "TEST 3: Auto-extension through assignment"
print "Original list: " + testList
testList[5] = 6
print "After testList[5] = 6: " + testList
print "testList[3] should be null: " + testList[3]  // Should be null (gap)
print "testList[4] should be null: " + testList[4]  // Should be null (gap)
print "testList[5] should be 6: " + testList[5]     // Should be 6
print ""

// Test 4: Nested list access
print "TEST 4: Nested list access"
nestedList = [[1, 2], [3, 4]]
print "Nested list: " + nestedList
print "nestedList[1][0] = " + nestedList[1][0]  // Should be 3
print ""

// Test 5: Out-of-bounds nested access
print "TEST 5: Out-of-bounds nested access"
print "nestedList[5] = " + nestedList[5]  // Should be null, not error
print "nestedList[5][0] = " + nestedList[5][0]  // Should be null, not error
if nestedList[5] == null and nestedList[5][0] == null
    print "SUCCESS: Nested out-of-bounds access handled correctly"
else
    print "FAILED: Nested out-of-bounds access not handled correctly"
end if
print ""

// Test 6: Extend nested list
print "TEST 6: Extend nested list"
nestedList[2] = [5, 6]
print "Extended nested list: " + nestedList
print "nestedList[2][0] = " + nestedList[2][0]  // Should be 5
print ""

print "=== TEST COMPLETED ==="
