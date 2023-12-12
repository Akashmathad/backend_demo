from Solution import Solution

if __name__ == "__main__":
    try:
        with open("Python/input.txt", "r") as file:
            q = Solution()

            output = [0] * 10

            for i in range(10):
                num1, num2 = map(int, file.readline().split())
                sum_result = q.addition(num1, num2)
                output[i] = sum_result

            for result in output:
                print(result)

    except FileNotFoundError as e:
        print(e)
