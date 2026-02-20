require('dotenv').config();
const fs = require('fs').promises;
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API (Ensure you have GEMINI_API_KEY in your .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Tailors a master resume to a specific job description using AI.
 * * @param {string} jobTitle - The title of the job.
 * @param {string} companyName - The company name.
 * @param {string} jobDescription - The raw job description from the fetcher.
 * @returns {Promise<string>} - The tailored resume in Markdown format.
 */
async function generateTailoredResume(jobTitle, companyName, jobDescription) {
  console.log(
    `🧠 Analyzing role and tailoring resume for ${jobTitle} at ${companyName}...`,
  );

  try {
    // 1. Read your exhaustive master resume
    const masterResume = await fs.readFile('master_resume.md', 'utf8');

    // 2. Select the model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 3. Construct the strict prompt
    const prompt = `
            You are an expert technical recruiter and resume writer. 
            I am applying for the following role: ${jobTitle} at ${companyName}.
            
            Here is the Job Description:
            """
            ${jobDescription}
            """

            Here is my Master Resume containing all my experience:
            """
            ${masterResume}
            """

            YOUR TASK:
            1. Analyze the Job Description to identify the core technical skills and requirements.
            2. Select ONLY the most relevant experiences, projects, and skills from my Master Resume. 
            3. Rewrite the bullet points to naturally highlight the keywords found in the Job Description. 
            4. Keep the output professional, concise, and impact-driven (use metrics where available).
            5. STRICT RULE: Do NOT invent, hallucinate, or exaggerate any experience. Only use facts present in the Master Resume.
            
            Output the final tailored resume strictly in clean Markdown format. Do not include any conversational filler.
        `;

    // 4. Call the AI
    const result = await model.generateContent(prompt);
    const tailoredMarkdown = result.response.text();

    console.log(`✅ Successfully tailored resume for ${companyName}.\n`);
    return tailoredMarkdown;
  } catch (error) {
    console.error('❌ Error generating resume:', error.message);
    return null;
  }
}

// Test the tailor independently using mock data
async function run() {
  const mockJobDesc =
    'We are looking for a Frontend Engineer heavily experienced in React, Tailwind CSS, and building responsive, data-heavy dashboards. Experience with Web3 or crypto environments is a massive plus.';

  const tailoredFormat = await generateTailoredResume(
    'Frontend Engineer',
    'DeFi Innovations',
    mockJobDesc,
  );

  if (tailoredFormat) {
    // Save the output to a file so we can inspect it
    await fs.writeFile('tailored_output.md', tailoredFormat);
    console.log("Check 'tailored_output.md' to see the result!");
  }
}

// run(); // Uncomment to test
