import PDFDocument from 'pdfkit';

export const generatePDFReport = async ({ project, analysis, result }) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header Branding
      doc.rect(0, 0, doc.page.width, 90).fill('#0f172a');
      doc.fillColor('#38bdf8').fontSize(22).font('Helvetica-Bold').text('CODEVISION AI', 50, 25);
      doc.fillColor('#94a3b8').fontSize(11).font('Helvetica').text('Comprehensive Code Analysis & Quality Audit Report', 50, 55);

      doc.moveDown(4);
      doc.fillColor('#1e293b');

      // Project Overview Section
      doc.fontSize(16).font('Helvetica-Bold').text('Project Information', 50, 115);
      doc.fontSize(10).font('Helvetica').fillColor('#475569');
      doc.text(`Project Name: ${project?.name || 'Code Analysis Session'}`);
      doc.text(`Language: ${(analysis?.language || 'Unknown').toUpperCase()}`);
      doc.text(`Generated Date: ${new Date().toLocaleString()}`);
      doc.text(`Overall Quality Score: ${result?.qualityScore?.overall || 85}/100`);

      doc.moveDown();
      doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Complexity & Quality Summary
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#0f172a').text('Code Quality & Complexity Summary');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').fillColor('#334155');
      doc.text(`• Time Complexity: ${result?.complexity?.timeComplexity || 'O(n)'}`);
      doc.text(`• Space Complexity: ${result?.complexity?.spaceComplexity || 'O(1)'}`);
      doc.text(`• Cyclomatic Complexity: ${result?.metrics?.cyclomaticComplexity || 1}`);
      doc.text(`• Total Lines of Code: ${result?.metrics?.lines || 0} (${result?.metrics?.comments || 0} comments, ${result?.metrics?.blankLines || 0} blank)`);
      doc.text(`• Maintainability Index: ${result?.metrics?.maintainabilityIndex || 85}/100`);

      doc.moveDown();
      doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Detected Bugs & Security Findings
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#0f172a').text('Detected Bugs & Code Smells');
      doc.moveDown(0.5);

      const bugs = result?.bugs || [];
      if (bugs.length === 0) {
        doc.fontSize(10).font('Helvetica').fillColor('#16a34a').text('No critical syntax or logic bugs detected.');
      } else {
        bugs.forEach((b, i) => {
          doc.fontSize(11).font('Helvetica-Bold').fillColor('#dc2626').text(`${i + 1}. [${b.severity || 'Medium'}] ${b.title || 'Finding'}`);
          doc.fontSize(9).font('Helvetica').fillColor('#475569');
          doc.text(`Line: ${b.line || 'General'} | Category: ${b.category || 'Quality'} | Source: ${b.source || 'Engine'}`);
          doc.text(`Description: ${b.description || ''}`);
          if (b.suggestedFix) doc.text(`Suggested Fix: ${b.suggestedFix}`);
          doc.moveDown(0.5);
        });
      }

      doc.moveDown();
      doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Optimizations
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#0f172a').text('Recommended Optimizations');
      doc.moveDown(0.5);
      const optimizations = result?.optimizations || [];
      optimizations.forEach((opt, idx) => {
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#2563eb').text(`${idx + 1}. ${opt.title || 'Optimization proposal'}`);
        doc.fontSize(9).font('Helvetica').fillColor('#475569');
        doc.text(`Benefit: ${opt.expectedBenefit || 'Improved execution efficiency'}`);
        doc.text(`Explanation: ${opt.explanation || ''}`);
        doc.moveDown(0.5);
      });

      // Footer
      doc.fontSize(8).fillColor('#94a3b8').text('Report generated autonomously by CodeVision AI Platform. Results are computed via AST & AI engines.', 50, 740, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

export const generateHTMLReport = ({ project, analysis, result }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CodeVision AI Report - ${project?.name || 'Analysis'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px; }
    .container { max-width: 900px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    h1 { color: #38bdf8; margin-top: 0; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; background: #0284c7; color: white; font-size: 12px; font-weight: 600; }
    .card { background: #0f172a; border-radius: 8px; padding: 16px; margin: 16px 0; border: 1px solid #334155; }
    .metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 20px 0; }
    .metric-box { background: #0f172a; border: 1px solid #334155; padding: 16px; border-radius: 8px; text-align: center; }
    .metric-val { font-size: 24px; font-weight: bold; color: #38bdf8; }
    .metric-label { font-size: 12px; color: #94a3b8; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1>CodeVision AI Report</h1>
        <p style="color: #94a3b8;">${project?.name || 'Code Analysis Report'} • ${new Date().toLocaleDateString()}</p>
      </div>
      <span class="badge">Quality: ${result?.qualityScore?.overall || 85}/100</span>
    </div>

    <div class="metric-grid">
      <div class="metric-box"><div class="metric-val">${result?.metrics?.lines || 0}</div><div class="metric-label">Lines Analyzed</div></div>
      <div class="metric-box"><div class="metric-val">${result?.complexity?.timeComplexity || 'O(n)'}</div><div class="metric-label">Time Complexity</div></div>
      <div class="metric-box"><div class="metric-val">${result?.metrics?.maintainabilityIndex || 85}/100</div><div class="metric-label">Maintainability</div></div>
    </div>

    <h2>Bugs & Quality Findings (${(result?.bugs || []).length})</h2>
    ${(result?.bugs || []).map(b => `
      <div class="card">
        <strong style="color: #f87171;">[${b.severity}] ${b.title}</strong>
        <p style="color: #cbd5e1; font-size: 14px; margin: 8px 0;">${b.description}</p>
        <p style="color: #38bdf8; font-size: 13px; margin: 0;">💡 Fix: ${b.suggestedFix || 'Refactor logic'}</p>
      </div>
    `).join('')}

    <h2>Recommended Optimizations</h2>
    ${(result?.optimizations || []).map(opt => `
      <div class="card">
        <strong style="color: #60a5fa;">${opt.title}</strong>
        <p style="color: #cbd5e1; font-size: 14px;">${opt.explanation}</p>
        <p style="color: #4ade80; font-size: 13px;">⚡ ${opt.expectedBenefit}</p>
      </div>
    `).join('')}
  </div>
</body>
</html>`;
};
