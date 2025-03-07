s=input()
count=0
vowels="aeiouAEIOU"
for c in s:
    if c in vowels:
        count=count+1
if count>0:
    print("Total number of vowels:",count)
else:
    print("No vowels were found.")      
