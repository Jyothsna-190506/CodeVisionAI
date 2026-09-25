export interface SampleCode {
  id: string;
  name: string;
  language: 'cpp' | 'python' | 'java';
  code: string;
}

export const SAMPLE_CODES: SampleCode[] = [
  {
    id: 'cpp-arr-sum',
    name: 'C++ Array Sum',
    language: 'cpp',
    code: `#include <iostream>
using namespace std;

int main() {
    int arr[] = {2, 4, 6};
    int sum = 0;
    for (int i = 0; i < 3; i++) {
        sum += arr[i];
    }
    cout << "Total Sum: " << sum << endl;
    return 0;
}`
  },
  {
    id: 'cpp-swap',
    name: 'C++ Swap Values',
    language: 'cpp',
    code: `#include <iostream>
using namespace std;

int main() {
    int a = 10, b = 20;
    int temp = a;
    a = b;
    b = temp;
    cout << "Swapped: a=" << a << ", b=" << b << endl;
    return 0;
}`
  },
  {
    id: 'py-factorial',
    name: 'Python Loop Factorial',
    language: 'python',
    code: `n = 5
fact = 1
for i in range(1, n + 1):
    fact *= i
print("Factorial of 5:", fact)`
  },
  {
    id: 'java-find-max',
    name: 'Java Find Max',
    language: 'java',
    code: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {5, 12, 3, 9};
        int max = numbers[0];
        for (int i = 1; i < 4; i++) {
            if (numbers[i] > max) max = numbers[i];
        }
        System.out.println("Max Element: " + max);
    }
}`
  }
];
