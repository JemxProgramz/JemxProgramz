import { Jimp } from 'jimp';
import fs from 'fs';

async function generateDotAvatar(inputPath, outputPath) {
  try {
    const image = await Jimp.read(inputPath);
    
    // Set grid resolution (how many dots across)
    const columns = 70;
    const rows = 70;
    
    // Resize to grid resolution
    image.resize({ w: columns, h: rows });
    
    // Canvas settings
    const svgWidth = 400;
    const svgHeight = 400;
    const cellWidth = svgWidth / columns;
    const cellHeight = svgHeight / rows;
    
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">\n`;
    svgContent += `  <style>
    @keyframes pour {
      0% { transform: translateY(-400px); opacity: 0; }
      10% { opacity: 1; }
      20% { transform: translateY(5px); }
      25% { transform: translateY(0); opacity: 1; }
      80% { transform: translateY(0); opacity: 1; }
      90% { transform: translateY(400px); opacity: 0; }
      100% { transform: translateY(400px); opacity: 0; }
    }
    .point {
      animation: pour 8s ease-out infinite;
      transform-box: fill-box;
      transform-origin: center;
    }
  </style>\n`;
    svgContent += `  <defs>\n`;
    svgContent += `    <clipPath id="circleClip"><circle cx="${svgWidth/2}" cy="${svgHeight/2}" r="${svgWidth/2 - 20}" /></clipPath>\n`;
    svgContent += `  </defs>\n`;
    svgContent += `  <g clip-path="url(#circleClip)">\n`;
    svgContent += `    <rect width="100%" height="100%" fill="#030308" />\n`;
    svgContent += `    <g>\n`; 
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const color = image.getPixelColor(x, y);
        // Extract RGB
        const r = (color >> 24) & 0xFF;
        const g = (color >> 16) & 0xFF;
        const b = (color >> 8) & 0xFF;
        
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
        
        // Skip very dark pixels
        if (brightness < 10) continue;

        // 2D Coordinates
        let cx = x * cellWidth + cellWidth / 2;
        let cy = y * cellHeight + cellHeight / 2;
        
        // Size and Color
        const normalized = brightness / 255;
        const radius = normalized * (Math.min(cellWidth, cellHeight) / 2) * 1.8; 
        
        // Color grading (much brighter, more vibrant)
        const rB = Math.min(255, Math.floor(r * 1.6 + 30));
        const gB = Math.min(255, Math.floor(g * 1.6 + 30)); 
        const bB = Math.min(255, Math.floor(b * 1.6 + 50)); 
        
        // Calculate animation delay for sandclock fill (bottom fills first)
        const delay = ((rows - y) * 35 + Math.random() * 200).toFixed(0);
        
        svgContent += `      <circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${radius.toFixed(2)}" fill="rgb(${rB},${gB},${bB})" class="point" style="animation-delay: ${delay}ms" />\n`;
      }
    }
    
    svgContent += `    </g>\n`;
    svgContent += `  </g>\n`;
    svgContent += `  <!-- Circle Border -->\n`;
    svgContent += `  <circle cx="${svgWidth/2}" cy="${svgHeight/2}" r="${svgWidth/2 - 20}" fill="none" stroke="#3b82f6" stroke-width="3" opacity="0.4" stroke-dasharray="2 6" />\n`;
    svgContent += `  <circle cx="${svgWidth/2}" cy="${svgHeight/2}" r="${svgWidth/2 - 26}" fill="none" stroke="#a855f7" stroke-width="1" opacity="0.2" />\n`;

    // Add HUD elements like the reference image
    svgContent += `  <!-- HUD / Borders -->\n`;
    svgContent += `  <path d="M 10 30 L 10 10 L 30 10" fill="none" stroke="#06b6d4" stroke-width="2" />\n`;
    svgContent += `  <path d="M 390 30 L 390 10 L 370 10" fill="none" stroke="#06b6d4" stroke-width="2" />\n`;
    svgContent += `  <path d="M 10 370 L 10 390 L 30 390" fill="none" stroke="#06b6d4" stroke-width="2" />\n`;
    svgContent += `  <path d="M 390 370 L 390 390 L 370 390" fill="none" stroke="#06b6d4" stroke-width="2" />\n`;
    svgContent += `  <text x="10" y="8" fill="#52525b" font-family="monospace" font-size="8">VISUAL.MAP</text>\n`;
    
    svgContent += `</svg>`;
    
    fs.writeFileSync(outputPath, svgContent);
    console.log(`✨ Successfully generated dot-matrix avatar at ${outputPath}`);
  } catch (error) {
    console.error('Error generating avatar:', error.message);
  }
}

const inputImage = process.argv[2] || 'profile.jpg';
const outputImage = process.argv[3] || 'matrix-avatar.svg';

if (!fs.existsSync(inputImage)) {
  console.log(`⚠️  Could not find '${inputImage}'.`);
  console.log(`Please upload your picture as '${inputImage}' using the file explorer, then run this script again!`);
  
  // Create a placeholder matrix avatar so the README doesn't break
  const placeholder = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="100%" height="100%" fill="#0a0a14" />
    <!-- HUD / Borders -->
    <path d="M 10 30 L 10 10 L 30 10" fill="none" stroke="#06b6d4" stroke-width="2" />
    <path d="M 390 30 L 390 10 L 370 10" fill="none" stroke="#06b6d4" stroke-width="2" />
    <path d="M 10 370 L 10 390 L 30 390" fill="none" stroke="#06b6d4" stroke-width="2" />
    <path d="M 390 370 L 390 390 L 370 390" fill="none" stroke="#06b6d4" stroke-width="2" />
    <text x="10" y="8" fill="#52525b" font-family="monospace" font-size="8">VISUAL.MAP</text>
    <text x="200" y="190" fill="#a78bfa" font-family="monospace" font-size="14" text-anchor="middle">Upload profile.jpg</text>
    <text x="200" y="215" fill="#a78bfa" font-family="monospace" font-size="14" text-anchor="middle">to generate your avatar!</text>
  </svg>`;
  fs.writeFileSync(outputImage, placeholder);
} else {
  generateDotAvatar(inputImage, outputImage);
}
