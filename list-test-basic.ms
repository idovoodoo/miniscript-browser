// MiniScript list test
// Tests the basic list functionality without methods

// Canvas text properties
text = "Testing Lists"
textX = 160
textY = 120
textColor = "#33FF33"

// Create a list literal
myList = [10, 20, 30, 40, 50]
print "List created: " + myList

// Access list items by index
print "First item: " + myList[0]
print "Third item: " + myList[2]

// Modify list items
myList[1] = 25
print "Modified list: " + myList

// Add new items to the list
myList = myList + [60]  // In MiniScript, concatenate lists to add items
print "Extended list: " + myList

// Nested lists
nestedList = [1, [2, 3], 4]
print "Nested list: " + nestedList
print "Nested value: " + nestedList[1][0]

// For loop with list
print "Iterating through list:"
for item in myList
    print "  Item: " + item
end for

// Create a list and fill it
newList = []
newList = newList + [100]  // Use list concatenation to add items
newList = newList + [200]
print "New list: " + newList

print "List test completed successfully!"
