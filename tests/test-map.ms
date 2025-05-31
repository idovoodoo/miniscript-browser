// test-map.ms - Tests for map operations
// This test focuses on map creation and manipulation

// Test properties for our canvas
text = "Testing Maps"
textX = 160
textY = 120
textColor = "#44AAFF"

print "=== Map Test ==="

// Create an empty map
emptyMap = {}
print "Empty map: " + emptyMap

// Create a map with values
personMap = {"name": "John", "age": 30, "city": "New York"}
print "\nPerson map: " + personMap

// Access values
print "Name: " + personMap["name"]
print "Age: " + personMap["age"]

// Change values
personMap["age"] = 31
print "\nAfter changing age: " + personMap

// Add a new property
personMap["job"] = "Developer"
print "After adding job: " + personMap

// Map methods
print "\nMap methods:"
print "Has index 'name': " + personMap.hasIndex("name")
print "Has index 'address': " + personMap.hasIndex("address")
print "All keys: " + personMap.indexes()
print "All values: " + personMap.values()

// Remove value
removed = personMap.remove("city")
print "\nRemoved city: " + removed
print "After removing city: " + personMap

// Clear the map
personMap.clear()
print "After clearing: " + personMap

// Nested maps
nested = {"user": {"id": 1, "roles": ["admin", "editor"]}, "active": true}
print "\nNested map: " + nested
print "User ID: " + nested["user"]["id"]
print "User roles: " + nested["user"]["roles"]
print "First role: " + nested["user"]["roles"][0]

// Map iteration
testMap = {"a": 1, "b": 2, "c": 3}
print "\nMap iteration:"
print "Iterate through keys:"
for key in testMap
    print "Key: " + key
end for

print "\nIterate through keys and values:"
for k, v in testMap
    print "Key: " + k + ", Value: " + v
end for

print "\n=== Map Test Complete ==="