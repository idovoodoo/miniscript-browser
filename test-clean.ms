// Simple test for the cleaned interpreter
print "Testing basic MiniScript interpreter (cleaned version)"
x = 10
y = 20
print "x = " + x
print "y = " + y
print "x + y = " + (x + y)

// Test range function
print "Testing range function:"
for i in range(1, 5)
    print "i = " + i
end for

// Test if statements
if x > y then
    print "x is greater than y"
else
    print "y is greater than or equal to x"
end if

// Test while loop
counter = 3
while counter > 0
    print "Counter: " + counter
    counter = counter - 1
end while

print "Interpreter test completed successfully!"
