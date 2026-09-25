import axios from 'axios';

async function testChat() {
  const code = `#include <iostream>
using namespace std;

int main() {
    int arr[] = {2, 4, 6};
    int sum = 0;

    for (int i = 0; i < 3; i++) {
        sum += arr[i];
    }

    cout << "Total Sum: " << sum << endl;

    return 0;
}`;

  const questions = [
    'give code explanation',
    'Explain this code thoroughly',
    'Why is the time complexity O(n)?',
    'Explain the for loop',
    'Explain line 6',
    'Can this code be optimized?',
    'Convert this code to Python',
    'Explain this like a beginner',
    'Give me an interview explanation',
    'Generate test cases',
    'What happens if the array is empty?'
  ];

  console.log('🤖 Testing Live Chat API (/api/chat)...\n');
  for (const q of questions) {
    console.log('----------------------------------------------------');
    console.log('Q: ' + q);
    console.log('----------------------------------------------------');
    const res = await axios.post('http://localhost:5000/api/chat', {
      message: q,
      codeSnippet: code,
      language: 'cpp'
    });
    console.log(res.data.reply + '\n');
  }
}

testChat().catch(console.error);
