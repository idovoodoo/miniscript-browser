// MiniScript Compliant List Operations Test
// This script demonstrates list operations that work in real MiniScript

// Canvas text properties
text = "MiniScript Lists"
textX = 160
textY = 120
textColor = "#33FF33"

// Create a list literal
myList = [10, 20, 30, 40, 50]
print "List created: " + myList

// Access list items by index
print "First item: " + myList[0]
print "Third item: " + myList[2]

// Modify list items (within bounds)
myList[1] = 25
print "Modified list: " + myList

// CORRECT: Extend list using list concatenation
myList = myList + [60]
print "Extended list: " + myList

// Concatenate multiple items
myList = myList + [70, 80]
print "List after adding multiple items: " + myList

// Work with nested lists
nestedList = [1, [2, 3], 4]
print "Nested list: " + nestedList
print "Nested value: " + nestedList[1][0]

// For loop with list
print "Iterating through list:"
for item in myList
    print "  Item: " + item
end for

// Create a list and build it with concatenation
newList = []
newList = newList + [100]
newList = newList + [200]
print "New list: " + newList

// The following operations would cause errors in real MiniScript
// They are commented out to prevent errors:

// ERROR: Setting an out-of-bounds index
// myList[20] = 99  // This would cause an "index out of range" error

// ERROR: Accessing an out-of-bounds index
// print myList[20]  // This would cause an "index out of range" error

print "MiniScript-compliant list test completed!"
