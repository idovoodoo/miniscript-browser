// Test script for MiniScript interpreter

// Test single-line if statement
if 1 == 1 then print "Single-line if statement works!"

// Test multi-line if/else/else if
if 1 == 2 then
    print "This should not print."
else if 1 == 1 then
    print "Else-if condition works!"
else
    print "This should not print either."
end if

// Test while loop
x = 0
while x < 3
    print "While loop iteration: " + x
    x = x + 1
end while

// Test variable assignment and print
message = "Hello, MiniScript!"
print message

// Test basic comparisons
if 5 > 3 then print "Comparison works!"
if 3 < 5 then print "Less than comparison works!"
if 5 >= 5 then print "Greater than or equal comparison works!"
if 3 <= 3 then print "Less than or equal comparison works!"
if 5 != 3 then print "Not equal comparison works!"