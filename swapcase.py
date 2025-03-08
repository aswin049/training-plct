inputs=input("Enter a string :")
outputString=''
for i in inputs:
    if i.isupper():
        o=i.lower()
    elif i.islower():
        o=i.upper()
    else:
        o=i
    outputString+=o
print(outputString)
