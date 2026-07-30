import fs from 'fs';
import path from 'path';

// Read configs
const profile = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config/profile.json'), 'utf8'));
const social = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config/social.json'), 'utf8'));
const skills = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config/skills.json'), 'utf8'));
const projects = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config/projects.json'), 'utf8'));

// Read template
let template = fs.readFileSync(path.join(process.cwd(), 'template.md'), 'utf8');

// Replace simple placeholders
template = template.replace(/\{\{NAME\}\}/g, profile.name);
template = template.replace(/\{\{NAME_ENCODED\}\}/g, encodeURIComponent(profile.name));
template = template.replace(/\{\{USERNAME\}\}/g, profile.username);
template = template.replace(/\{\{TITLE_ENCODED\}\}/g, encodeURIComponent(profile.title));
template = template.replace(/\{\{TAGLINE\}\}/g, profile.tagline);
template = template.replace(/\{\{BIO\}\}/g, profile.bio);
template = template.replace(/\{\{LOCATION\}\}/g, profile.location);
template = template.replace(/\{\{EDUCATION\}\}/g, profile.education);
template = template.replace(/\{\{CURRENT_FOCUS\}\}/g, profile.current_focus);
template = template.replace(/\{\{PORTFOLIO_LINK\}\}/g, profile.portfolio_link);
template = template.replace(/\{\{EMAIL\}\}/g, profile.email);
template = template.replace(/\{\{FUN_FACT\}\}/g, profile.fun_fact);

template = template.replace(/\{\{LINKEDIN\}\}/g, social.linkedin);
template = template.replace(/\{\{TWITTER\}\}/g, social.twitter);

// Build Skills Badges
let skillsHtml = '';
for (const [category, skillList] of Object.entries(skills)) {
  skillsHtml += `<h3>${category}</h3>\n<p>\n`;
  skillList.forEach(skill => {
    // Generate simple badge using shields.io
    const skillEncoded = encodeURIComponent(skill);
    skillsHtml += `  <img src="https://img.shields.io/badge/-${skillEncoded}-050505?style=flat-square&logo=${skillEncoded}&logoColor=38BDF8&labelColor=050505&color=111111" alt="${skill}" />\n`;
  });
  skillsHtml += `</p>\n`;
}
template = template.replace(/\{\{SKILLS_BADGES\}\}/g, skillsHtml);

// Build Projects HTML (2 columns)
let projectsHtml = '';
for (let i = 0; i < projects.length; i += 2) {
  projectsHtml += '  <tr>\n';
  
  for (let j = 0; j < 2; j++) {
    const project = projects[i + j];
    if (project) {
      projectsHtml += `    <td width="50%">\n`;
      projectsHtml += `      <h4><a href="https://github.com/${project.repo}">${project.name}</a></h4>\n`;
      projectsHtml += `      <p>${project.description}</p>\n`;
      projectsHtml += `      <p>\n`;
      project.tech.forEach(tech => {
        projectsHtml += `        <code>${tech}</code>\n`;
      });
      projectsHtml += `      </p>\n`;
      projectsHtml += `      <a href="https://github.com/${project.repo}">GitHub</a> | <a href="${project.demo}">Live Demo</a>\n`;
      projectsHtml += `    </td>\n`;
    } else {
      projectsHtml += `    <td width="50%"></td>\n`;
    }
  }
  projectsHtml += '  </tr>\n';
}
template = template.replace(/\{\{PROJECTS_HTML\}\}/g, projectsHtml);

// Write README.md
fs.writeFileSync(path.join(process.cwd(), 'README.md'), template, 'utf8');
console.log('README.md generated successfully.');
