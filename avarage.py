sum = 0
num_count = int(input(""))
if num_count > 0:
    for a in range(num_count):
        n1 = int(input(""))
        sum += n1   
    avg = sum / num_count
    print(f"The average is: {avg:.2f}")
