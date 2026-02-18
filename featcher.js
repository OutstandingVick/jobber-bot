require('dotenv').config();
const axios = require('axios');

// Configuration for your target roles
const SEARCH_QUERY = 'Frontend Developer React';
const LOCATION = 'Remote';

/**
 * Fetches job listings from an API.
 * (This example uses the structure of a typical RapidAPI job endpoint)
 */
async function fetchJobs(query, location) {
  console.log(`🔍 Scouring the web for: ${query} in ${location}...`);

  // Replace with your actual API endpoint and Key
  const options = {
    method: 'GET',
    url: 'https://jsearch.p.rapidapi.com/search',
    params: {
      query: `${query} in ${location}`,
      page: '1',
      num_pages: '1', // Keep it small for testing
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    const rawJobs = response.data.data;

    // Clean and standardize the data for the AI pipeline
    const formattedJobs = rawJobs.map((job) => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      applyLink: job.job_apply_link,
      description: job.job_description,
      isRemote: job.job_is_remote,
    }));

    console.log(`✅ Found ${formattedJobs.length} relevant job openings.\n`);
    return formattedJobs;
  } catch (error) {
    console.error('❌ Error fetching jobs:', error.message);
    return [];
  }
}

// Test the fetcher independently
async function run() {
  const jobs = await fetchJobs(SEARCH_QUERY, LOCATION);

  if (jobs.length > 0) {
    console.log(`First job found: ${jobs[0].title} at ${jobs[0].company}`);
    console.log(`Apply here: ${jobs[0].applyLink}`);
    // The description is usually long, so we won't print it all to the console
  }
}

run();
