/**
 * PDF Service - Generates task assignment PDF for email attachment
 * Uses PDFKit to create a professional-looking PDF
 */
const PDFDocument = require('pdfkit');

/**
 * Generates a PDF buffer for the task assignment
 * @param {Object} candidate - Candidate document
 * @param {Object} task - Generated task object
 * @returns {Promise<Buffer>} - PDF as a buffer
 */
const generateTaskPDF = (candidate, task) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // ── Color palette ──────────────────────────────────────────────
      const PRIMARY   = '#6366f1';
      const DARK      = '#1e293b';
      const MUTED     = '#64748b';
      const LIGHT_BG  = '#f8fafc';
      const SUCCESS   = '#22c55e';
      const WARNING   = '#f59e0b';
      const DANGER    = '#ef4444';

      const difficultyColor =
        task.difficulty === 'Beginner'   ? SUCCESS :
        task.difficulty === 'Intermediate' ? WARNING : DANGER;

      const pageWidth  = doc.page.width  - 100; // account for margins
      const pageLeft   = 50;

      // ── HEADER BANNER ──────────────────────────────────────────────
      doc.rect(0, 0, doc.page.width, 110).fill(PRIMARY);

      doc.fillColor('white')
         .fontSize(26)
         .font('Helvetica-Bold')
         .text('🚀 Career Portal', pageLeft, 28, { align: 'center', width: pageWidth });

      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('rgba(255,255,255,0.85)')
         .text('Technical Task Assignment', pageLeft, 62, { align: 'center', width: pageWidth });

      doc.fillColor('rgba(255,255,255,0.6)')
         .fontSize(10)
         .text(`Generated on ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`,
               pageLeft, 84, { align: 'center', width: pageWidth });

      // ── GREETING SECTION ───────────────────────────────────────────
      let y = 130;

      doc.fillColor(DARK)
         .fontSize(18)
         .font('Helvetica-Bold')
         .text(`Hello, ${candidate.fullName}!`, pageLeft, y);

      y += 28;
      doc.fillColor(MUTED)
         .fontSize(11)
         .font('Helvetica')
         .text(
           `Thank you for applying! Based on your skills in ${candidate.skills.join(', ')} ` +
           `and ${candidate.experience} of experience, we've prepared a personalized technical task for you.`,
           pageLeft, y, { width: pageWidth, lineGap: 4 }
         );

      y = doc.y + 20;

      // ── DIVIDER ────────────────────────────────────────────────────
      doc.moveTo(pageLeft, y).lineTo(pageLeft + pageWidth, y).strokeColor('#e2e8f0').lineWidth(1).stroke();
      y += 16;

      // ── TASK CARD ──────────────────────────────────────────────────
      // Card background
      doc.roundedRect(pageLeft, y, pageWidth, 36, 6).fill('#f0f0ff');

      doc.fillColor(MUTED)
         .fontSize(9)
         .font('Helvetica')
         .text('YOUR ASSIGNMENT', pageLeft + 12, y + 8);

      doc.fillColor(PRIMARY)
         .fontSize(14)
         .font('Helvetica-Bold')
         .text(task.title, pageLeft + 12, y + 18, { width: pageWidth - 24 });

      y += 46;

      // Badges row
      // Difficulty badge
      doc.roundedRect(pageLeft, y, 90, 22, 11).fill(difficultyColor + '30');
      doc.fillColor(difficultyColor)
         .fontSize(10)
         .font('Helvetica-Bold')
         .text(task.difficulty, pageLeft + 8, y + 6, { width: 74, align: 'center' });

      // Deadline badge
      doc.roundedRect(pageLeft + 98, y, 110, 22, 11).fill('#f0f0ff');
      doc.fillColor(PRIMARY)
         .fontSize(10)
         .font('Helvetica-Bold')
         .text(`⏰  ${task.deadline}`, pageLeft + 106, y + 6, { width: 94, align: 'center' });

      y += 34;

      // ── DESCRIPTION ────────────────────────────────────────────────
      doc.fillColor(DARK)
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('📄 Description', pageLeft, y);

      y += 16;

      // Description box
      const descText = task.description;
      const descHeight = doc.heightOfString(descText, { width: pageWidth - 24, lineGap: 4 }) + 20;
      doc.roundedRect(pageLeft, y, pageWidth, descHeight, 6).fill(LIGHT_BG);

      doc.fillColor('#475569')
         .fontSize(10.5)
         .font('Helvetica')
         .text(descText, pageLeft + 12, y + 10, { width: pageWidth - 24, lineGap: 4 });

      y += descHeight + 16;

      // ── REQUIREMENTS ───────────────────────────────────────────────
      doc.fillColor(DARK)
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('📋 Requirements', pageLeft, y);

      y += 16;

      task.requirements.forEach((req, i) => {
        // Check if we need a new page
        if (y > doc.page.height - 150) {
          doc.addPage();
          y = 50;
        }

        // Number circle
        doc.circle(pageLeft + 10, y + 7, 10).fill(PRIMARY);
        doc.fillColor('white')
           .fontSize(9)
           .font('Helvetica-Bold')
           .text(`${i + 1}`, pageLeft + 6, y + 2, { width: 10, align: 'center' });

        doc.fillColor('#475569')
           .fontSize(10.5)
           .font('Helvetica')
           .text(req, pageLeft + 26, y, { width: pageWidth - 26, lineGap: 3 });

        y = doc.y + 8;
      });

      y += 8;

      // ── SUBMISSION INSTRUCTIONS ────────────────────────────────────
      if (y > doc.page.height - 200) {
        doc.addPage();
        y = 50;
      }

      // Section background
      const subSteps = [
        `Complete the task within ${task.deadline}`,
        'Push your code to a public GitHub repository',
        'Include a detailed README.md with setup instructions',
        'Reply to this email with your GitHub repository link',
        'Optionally, include a live demo link (Vercel, Netlify, etc.)',
      ];

      const subHeight = subSteps.length * 22 + 44;
      doc.roundedRect(pageLeft, y, pageWidth, subHeight, 8).fill('#f0f9ff');
      doc.roundedRect(pageLeft, y, 4, subHeight, 2).fill('#0ea5e9');

      doc.fillColor('#0369a1')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('📤 Submission Instructions', pageLeft + 14, y + 12);

      let subY = y + 32;
      subSteps.forEach((step, i) => {
        doc.fillColor('#0c4a6e')
           .fontSize(10)
           .font('Helvetica')
           .text(`${i + 1}.  ${step}`, pageLeft + 14, subY, { width: pageWidth - 28 });
        subY += 20;
      });

      y += subHeight + 16;

      // ── PRO TIPS ───────────────────────────────────────────────────
      if (y > doc.page.height - 160) {
        doc.addPage();
        y = 50;
      }

      const tips = [
        'Write clean, well-commented code',
        'Follow best practices for your tech stack',
        'Add proper error handling',
        'Make it responsive and user-friendly',
      ];

      const tipsHeight = tips.length * 20 + 44;
      doc.roundedRect(pageLeft, y, pageWidth, tipsHeight, 8).fill('#fffbeb');
      doc.roundedRect(pageLeft, y, 4, tipsHeight, 2).fill('#f59e0b');

      doc.fillColor('#92400e')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('💡 Pro Tips', pageLeft + 14, y + 12);

      let tipY = y + 32;
      tips.forEach((tip) => {
        doc.fillColor('#78350f')
           .fontSize(10)
           .font('Helvetica')
           .text(`•  ${tip}`, pageLeft + 14, tipY, { width: pageWidth - 28 });
        tipY += 20;
      });

      y += tipsHeight + 20;

      // ── FOOTER ─────────────────────────────────────────────────────
      if (y > doc.page.height - 80) {
        doc.addPage();
        y = doc.page.height - 80;
      }

      doc.moveTo(pageLeft, y).lineTo(pageLeft + pageWidth, y).strokeColor('#e2e8f0').lineWidth(1).stroke();
      y += 12;

      doc.fillColor(MUTED)
         .fontSize(9)
         .font('Helvetica')
         .text('Best of luck! We\'re rooting for you. 🎯', pageLeft, y, { align: 'center', width: pageWidth });

      doc.fillColor('#94a3b8')
         .fontSize(8)
         .text('© 2024 Career Portal. All rights reserved.', pageLeft, y + 16, { align: 'center', width: pageWidth });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateTaskPDF };
