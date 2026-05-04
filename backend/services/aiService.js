/**
 * AI Service - Candidate profile analyze kare ane personalized task generate kare
 * Primary: Google Gemini (FREE) — https://aistudio.google.com/app/apikey
 * Fallback: OpenAI GPT (if key set)
 * Last resort: Smart skill-based fallback generator
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Main task generator — tries Gemini first, then OpenAI, then smart fallback
 */
const generateTask = async (candidateData) => {
  const { fullName, skills, experience, portfolioLink } = candidateData;
  const skillsList = Array.isArray(skills) ? skills.join(', ') : skills;

  const prompt = `You are a technical hiring manager at a top software company.
A candidate has applied with this profile:
- Name: ${fullName}
- Skills: ${skillsList}
- Experience: ${experience}
- Portfolio: ${portfolioLink || 'Not provided'}

Generate a practical technical assignment based on their skills and experience.
Respond ONLY with valid JSON (no markdown, no extra text):
{
  "title": "Short task title",
  "description": "Detailed 2-3 paragraph description of what to build",
  "requirements": ["req 1", "req 2", "req 3", "req 4", "req 5"],
  "deadline": "7 days",
  "difficulty": "Beginner"
}
difficulty must be one of: Beginner, Intermediate, Advanced`;

  // ── Try Google Gemini (FREE) ──────────────────────────────────────────────
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      // Strip markdown code blocks if present
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const taskData = JSON.parse(cleaned);

      if (taskData.title && taskData.description && taskData.requirements) {
        console.log(`🤖 Gemini AI task generated for: ${fullName}`);
        return taskData;
      }
    } catch (err) {
      console.error('⚠️  Gemini error:', err.message);
    }
  }

  // ── Try OpenAI (if key set) ───────────────────────────────────────────────
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && openaiKey !== 'your_openai_api_key_here') {
    try {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: openaiKey });
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a technical hiring manager. Respond with valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
      });
      const raw = completion.choices[0].message.content.trim();
      const taskData = JSON.parse(raw);
      if (taskData.title && taskData.description && taskData.requirements) {
        console.log(`🤖 OpenAI task generated for: ${fullName}`);
        return taskData;
      }
    } catch (err) {
      console.error('⚠️  OpenAI error:', err.message);
    }
  }

  // ── Smart Fallback (no API key needed) ───────────────────────────────────
  console.log(`📋 Using smart fallback task for: ${fullName} | Skills: ${skillsList}`);
  return generateSmartFallback(skills, experience, fullName);
};

/**
 * Smart fallback — skills ane experience based unique task generate kare
 */
const generateSmartFallback = (skills, experience, fullName) => {
  const skillsList = Array.isArray(skills) ? skills : [skills];
  const exp = experience || '0-1 years';

  const difficulty =
    exp === '0-1 years' ? 'Beginner'
    : exp === '1-2 years' ? 'Beginner'
    : exp === '2-4 years' ? 'Intermediate'
    : exp === '4-6 years' ? 'Intermediate'
    : 'Advanced';

  const lower = skillsList.map((s) => s.toLowerCase());

  const has = (...keywords) =>
    keywords.some((k) => lower.some((s) => s.includes(k)));

  // ── React / Frontend ──────────────────────────────────────────────────────
  if (has('react', 'next', 'vue', 'angular', 'svelte')) {
    return {
      title: `${skillsList[0]} E-Commerce Product Page`,
      description: `Build a fully functional e-commerce product listing page using ${skillsList[0]}. The app should fetch product data from a public API (like FakeStoreAPI), display products in a responsive grid, and include a working shopping cart with add/remove functionality.\n\nImplement search and filter by category. Use proper state management (Context API or Redux). Focus on clean component architecture, reusability, and smooth UX with loading states.\n\nBonus: Add a product detail page with routing and persist cart in localStorage.`,
      requirements: [
        `Build with ${skillsList[0]} using functional components and hooks`,
        'Fetch and display products from FakeStoreAPI or similar',
        'Implement search bar and category filter',
        'Shopping cart with add/remove and quantity update',
        'Responsive design — works on mobile and desktop',
        'Deploy on Vercel or Netlify with live URL',
      ],
      deadline: '7 days',
      difficulty,
    };
  }

  // ── Node.js / Express / Backend ───────────────────────────────────────────
  if (has('node', 'express', 'fastapi', 'django', 'flask', 'spring', 'laravel')) {
    return {
      title: 'Task Management REST API',
      description: `Build a complete REST API for a task management system using ${skillsList[0]}. The API should support user authentication with JWT and full CRUD operations for tasks. Each task should have title, description, status (todo/in-progress/done), priority, and due date.\n\nImplement proper middleware for authentication, input validation, and error handling. Use MongoDB or PostgreSQL as the database. Write clean, modular code with separate routes, controllers, and models.\n\nBonus: Add pagination, sorting, and filtering for task listing endpoints.`,
      requirements: [
        'User registration and login with JWT authentication',
        'CRUD endpoints for tasks (GET, POST, PUT, DELETE)',
        'Input validation and proper HTTP status codes',
        'Database integration (MongoDB or PostgreSQL)',
        'Middleware for auth, error handling, and logging',
        'README with API documentation and Postman collection',
      ],
      deadline: '7 days',
      difficulty,
    };
  }

  // ── Python / Data ─────────────────────────────────────────────────────────
  if (has('python', 'pandas', 'numpy', 'machine learning', 'ml', 'data')) {
    return {
      title: 'Data Analysis & Visualization Dashboard',
      description: `Build a data analysis project using Python that analyzes a real-world dataset (e.g., COVID data, sales data, or any Kaggle dataset). Perform exploratory data analysis (EDA), clean the data, and generate meaningful insights.\n\nCreate visualizations using Matplotlib/Seaborn or Plotly. Build a simple Streamlit or Flask dashboard to display the results interactively. Document your findings and methodology clearly.\n\nBonus: Add a simple ML model (classification or regression) and show its accuracy metrics.`,
      requirements: [
        'Load and clean a real-world dataset using Pandas',
        'Perform EDA — missing values, distributions, correlations',
        'Create at least 5 meaningful visualizations',
        'Build interactive dashboard with Streamlit or Flask',
        'Document insights and conclusions in README',
        'Push to GitHub with requirements.txt',
      ],
      deadline: '7 days',
      difficulty,
    };
  }

  // ── Mobile / Flutter / React Native ──────────────────────────────────────
  if (has('flutter', 'react native', 'android', 'ios', 'kotlin', 'swift')) {
    return {
      title: 'Mobile Todo & Notes App',
      description: `Build a mobile application for task and notes management using ${skillsList[0]}. The app should allow users to create, edit, delete, and organize tasks with categories and priorities. Include local storage persistence so data survives app restarts.\n\nImplement a clean, intuitive UI with smooth animations. Add features like task completion toggle, due date reminders, and search functionality. Follow platform design guidelines (Material Design or Cupertino).\n\nBonus: Add cloud sync using Firebase Firestore.`,
      requirements: [
        `Build with ${skillsList[0]} — clean architecture`,
        'CRUD operations for tasks and notes',
        'Local storage persistence (SQLite or SharedPreferences)',
        'Search and filter by category/priority',
        'Smooth UI animations and transitions',
        'APK/IPA build or Expo link for testing',
      ],
      deadline: '7 days',
      difficulty,
    };
  }

  // ── Full Stack / General ──────────────────────────────────────────────────
  return {
    title: 'Full-Stack Blog Platform',
    description: `Build a full-stack blog platform where users can register, login, create posts, and comment. Use the skills you listed (${skillsList.slice(0, 3).join(', ')}) to build both the frontend and backend.\n\nThe platform should have user authentication, a rich text editor for posts, categories/tags, and a comment system. Implement proper authorization so users can only edit/delete their own posts.\n\nFocus on clean code architecture, proper error handling, and a polished UI. Deploy both frontend and backend.`,
    requirements: [
      'User authentication (register, login, logout)',
      'Create, edit, delete blog posts with rich text',
      'Categories, tags, and search functionality',
      'Comment system with nested replies',
      'Responsive UI — mobile and desktop',
      'Deploy with live URL (Vercel + Railway/Render)',
    ],
    deadline: '7 days',
    difficulty,
  };
};

module.exports = { generateTask };
