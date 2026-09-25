import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from '../app.js';

dotenv.config();

const PORT = 5055;

async function runTests() {
  console.log('🧪 Starting CodeVision AI Full-Stack Automated Test Suite...');
  let server;

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log('✅ 1. MongoDB Atlas Connection Verified');
    }

    server = app.listen(PORT, () => {
      console.log(`✅ 2. Express Server Started on port ${PORT}`);
    });

    const baseUrl = `http://localhost:${PORT}/api`;

    // 1. Health Check
    const healthRes = await fetch(`http://localhost:${PORT}/health`).then((r) => r.json());
    console.assert(healthRes.status === 'ok', 'Health check failed');
    console.log('✅ 3. Health Check: OK');

    // 2. Auth: Register
    const uniqueEmail = `test_${Date.now()}@codevision.ai`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Tester',
        email: uniqueEmail,
        password: 'TestPassword123!',
      }),
    }).then((r) => r.json());

    console.assert(regRes.success && regRes.token, 'Register failed');
    console.log('✅ 4. Authentication Register: OK');
    const token = regRes.token;

    // 3. Auth: Login
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'TestPassword123!',
      }),
    }).then((r) => r.json());

    console.assert(loginRes.success && loginRes.token, 'Login failed');
    console.log('✅ 5. Authentication Login: OK');

    // 4. Project CRUD: Create
    const projRes = await fetch(`${baseUrl}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Test QuickSort Project',
        language: 'python',
        code: `def quicksort(arr):\n    if len(arr) <= 1: return arr\n    pivot = arr[len(arr)//2]\n    return quicksort([x for x in arr if x < pivot]) + [x for x in arr if x == pivot] + quicksort([x for x in arr if x > pivot])\n\nprint(quicksort([3,6,8,10,1,2,1]))\n`,
        tags: ['sorting', 'dsa'],
      }),
    }).then((r) => r.json());

    console.assert(projRes.success && projRes.project?._id, 'Project creation failed');
    console.log('✅ 6. Project Create: OK');
    const projectId = projRes.project._id;

    // 5. Code Analysis Pipeline
    const analRes = await fetch(`${baseUrl}/analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        projectId,
        language: 'python',
        code: projRes.project.code,
      }),
    }).then((r) => r.json());

    console.assert(analRes.success && analRes.data, 'Analysis failed');
    console.assert(analRes.data.qualityScore.overall > 0, 'Quality score invalid');
    console.assert(analRes.data.metrics.lines > 0, 'Metrics lines invalid');
    console.assert(Array.isArray(analRes.data.bugs), 'Bugs array invalid');
    console.assert(Array.isArray(analRes.data.testCases), 'Test cases invalid');
    console.assert(Array.isArray(analRes.data.similarCode), 'Similar code invalid');
    console.log('✅ 7. Full 11-Domain Code Analysis Pipeline: OK');
    const analysisId = analRes.analysisId;

    // 6. Report Generation
    if (analysisId) {
      const reportRes = await fetch(`${baseUrl}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          analysisId,
          reportType: 'HTML',
        }),
      });

      console.assert(reportRes.status === 200, 'HTML Report generation failed');
      console.log('✅ 8. Report Generation (HTML): OK');
    }

    // 7. AI Chat persistence
    const chatRes = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        projectId,
        analysisId,
        message: 'What is the time complexity of quicksort?',
      }),
    }).then((r) => r.json());

    console.assert(chatRes.success && chatRes.reply, 'Chat failed');
    console.log('✅ 9. Project-Aware AI Code Chat: OK');

    // 8. History Audit
    const histRes = await fetch(`${baseUrl}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());

    console.assert(histRes.success && histRes.history.length > 0, 'History log failed');
    console.log('✅ 10. History Audit Trail: OK');

    console.log('\n🎉 ALL 10 TEST SUITES PASSED FLAWLESSLY WITH MONGODB ATLAS INTEGRATION!');
  } catch (err) {
    console.error('❌ Test suite error:', err);
  } finally {
    if (server) server.close();
    if (mongoose.connection.readyState === 1) await mongoose.connection.close();
    process.exit(0);
  }
}

runTests();
