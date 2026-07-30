import fs from 'fs';
import path from 'path';

async function fetchRepos() {
  const profile = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config/profile.json'), 'utf8'));
  const username = profile.username;
  
  console.log(`Fetching repositories for ${username}...`);
  
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=15`);
    
    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }
    
    const repos = await response.json();
    
    // Filter out forks and get the top 6 recently updated repos
    const projects = repos
      .filter(r => !r.fork)
      .slice(0, 6)
      .map(repo => ({
        name: repo.name,
        description: repo.description || 'GitHub Repository',
        repo: repo.full_name,
        demo: repo.homepage || `https://github.com/${repo.full_name}`,
        tech: repo.language ? [repo.language] : ['Code']
      }));
      
    fs.writeFileSync(path.join(process.cwd(), 'config/projects.json'), JSON.stringify(projects, null, 2));
    console.log('Successfully updated config/projects.json');
  } catch (error) {
    console.error('Failed to fetch repos:', error.message);
  }
}

fetchRepos();
