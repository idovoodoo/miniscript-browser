// MiniScript List Methods Test
// Tests all list methods required by the MiniScript specification

// Create a test list
myList = [10, 20, 30, 40, 50]
print "Original list: " + myList

// Test .len property
print "List length (should be 5): " + myList.len

// Test .hasIndex(i) method
print "hasIndex(2) should return 1: " + myList.hasIndex(2)
print "hasIndex(10) should return 0: " + myList.hasIndex(10)

// Test .indexes property
print "List indexes: " + myList.indexes

// Test .indexOf method
print "indexOf(30) should return 2: " + myList.indexOf(30)
print "indexOf(30, 2) should return 2: " + myList.indexOf(30, 2)
print "indexOf(30, 3) should return -1: " + myList.indexOf(30, 3)

// Test .join method
print "join(): \"" + myList.join() + "\""
print "join(\"-\"): \"" + myList.join("-") + "\""

// Test .pop method
popped = myList.pop()
print "After pop(): " + myList
print "Popped value (should be 50): " + popped

// Test .pull method
pulled = myList.pull()
print "After pull(): " + myList
print "Pulled value (should be 10): " + pulled

// Test .push method
myList.push(60)
print "After push(60): " + myList

// Test .shuffle
// Note: Result will be random but should contain same elements
savedList = myList.slice()
myList.shuffle
print "After shuffle: " + myList
print "Original elements: " + savedList

// Create a small function to verify if two lists have the same elements (regardless of order)
// This helps us confirm shuffle didn't lose any elements
containsSameElements = function(list1, list2)
  if list1.len != list2.len then return false
  
  // Count elements in list1
  counts = {}
  for item in list1
    if counts.hasIndex(item) then
      counts[item] = counts[item] + 1
    else
      counts[item] = 1
    end if
  end for
  
  // Subtract counts for list2
  for item in list2
    if not counts.hasIndex(item) then return false
    counts[item] = counts[item] - 1
    if counts[item] < 0 then return false
  end for
  
  // Make sure all counts are zero
  for key in counts.indexes
    if counts[key] != 0 then return false
  end for
  
  return true
end function

print "Shuffle kept all elements: " + containsSameElements(myList, savedList)

// Test .sort
myList = [3, 1, 4, 1, 5, 9, 2, 6]
print "Unsorted list: " + myList
myList.sort
print "After sort: " + myList

// Test sorting with key
employees = [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}, {"name": "Charlie", "age": 35}]
print "Unsorted employees: " + employees
employees.sort("age")
print "Employees sorted by age: " + employees

// Test .sum
numbers = [1, 2, 3, 4, 5]
print "Sum of " + numbers + " (should be 15): " + numbers.sum

// Test .remove
myList = [10, 20, 30, 40, 50]
print "Original: " + myList
removed = myList.remove(2)
print "After remove(2): " + myList
print "Remove result (should be 1): " + removed

// Test .replace
myList = [10, 20, 30, 20, 50]
print "Original: " + myList
replacements = myList.replace(20, 25)
print "After replace(20, 25): " + myList
print "Replacements made (should be 2): " + replacements

replacements = myList.replace(25, 99, 1)
print "After replace(25, 99, 1): " + myList
print "Replacements made (should be 1): " + replacements

// Test the global range function
print "range(5): " + range(5)
print "range(2, 7): " + range(2, 7)
print "range(10, 0, -2): " + range(10, 0, -2)
print "range(0, 10, 3): " + range(0, 10, 3)
