// test-list-methods.ms - Tests for list methods: push, pop, pull
// This test focuses on the core list methods functionality

// Test properties for our canvas
text = "Testing List Methods"
textX = 160
textY = 120
textColor = "#33FF33"

print "=== List Methods Test ==="

// Create a test list
myList = [1, 2, 3, 4, 5]
print "Original list: " + myList

// Test push
myList.push(6)
print "After push(6): " + myList

// Test pop
popped = myList.pop()
print "After pop(): " + myList
print "Popped value: " + popped

// Test pull
pulled = myList.pull()
print "After pull(): " + myList
print "Pulled value: " + pulled

// Test empty list edge cases
emptyList = []
print "\nTesting empty list:"
emptyPop = emptyList.pop()
print "pop() on empty list returns: " + emptyPop

emptyPull = emptyList.pull()
print "pull() on empty list returns: " + emptyPull

// Test chaining methods
chainList = []
chainList.push(1).push(2).push(3)
print "\nTesting method chaining:"
print "After chained pushes: " + chainList

print "\n=== List Methods Test Complete ==="
