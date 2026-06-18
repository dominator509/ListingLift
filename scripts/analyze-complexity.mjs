/**
 * Cyclomatic complexity analyzer for TypeScript source files.
 * Computes cyclomatic complexity by counting decision points:
 *   if, else if, else, for, while, do, case, catch, &&, ||, ?.,
 *   ternary (?:), ??, switch
 * Also counts LOC and function count per file.
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const SRC_DIR = join(process.cwd(), 'src');

function getAllTsFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      files.push(...getAllTsFiles(full));
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      files.push(full);
    }
  }
  return files;
}

function computeCyclomaticComplexity(code) {
  let complexity = 1; // base: sequential flow
  const lines = code.split('\n');
  
  // Count decision points
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip comments
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('*/')) continue;
    
    // if, else if
    if (/\bif\s*\(/.test(trimmed)) complexity++;
    if (/\belse\s+if\s*\(/.test(trimmed)) complexity++; // counted separately
    
    // for, while
    if (/\b(for|while)\s*\(/.test(trimmed) && !trimmed.startsWith('for ')) complexity++;
    if (/^\s*while\s*\(/.test(trimmed)) complexity++;
    if (/^\s*for\s*\(/.test(trimmed)) complexity++;
    
    // case (not default)
    if (/\bcase\s+/.test(trimmed) && !trimmed.includes('break;')) complexity++;
    
    // catch
    if (/\bcatch\s*\(/.test(trimmed) || /\bcatch\s*\{/.test(trimmed)) complexity++;
    
    // ternary operator
    // Count ? : pattern - careful not to count labels or regex
    const ternaryMatches = trimmed.match(/[?]\s*\S+\s*:/g);
    if (ternaryMatches) complexity += ternaryMatches.length;
    
    // Logical AND/OR in non-comment code (excluding const declarations and imports)
    // These create additional paths
    if (!trimmed.startsWith('import') && !trimmed.startsWith('export') && !trimmed.includes('import')) {
      if (/\&\&/.test(trimmed) && !trimmed.includes('const ') && !trimmed.includes('let ') && !trimmed.includes('var ')) complexity++;
      if (/\|\|/.test(trimmed) && !trimmed.includes('const ') && !trimmed.includes('let ') && !trimmed.includes('var ')) complexity++;
    }
    
    // nullish coalescing
    if (/\?\?/.test(trimmed)) complexity++;
    
    // optional chaining
    if (/\?\./.test(trimmed)) complexity++;
  }
  
  return complexity;
}

function extractFunctionNames(code) {
  const funcs = [];
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Export functions
    let m = line.match(/export\s+(async\s+)?function\s+(\w+)/);
    if (m) funcs.push({ name: m[2], line: i + 1, kind: 'function' });
    
    m = line.match(/export\s+(async\s+)?function\s+\*?\s*(\w+)/);
    if (m && !funcs.find(f => f.name === m[2])) funcs.push({ name: m[2], line: i + 1, kind: 'function' });
    
    // Arrow functions assigned to const/let
    m = line.match(/export\s+(const|let|var)\s+(\w+)\s*[=:]\s*(async\s*)?\(/);
    if (m) funcs.push({ name: m[2], line: i + 1, kind: 'arrow' });
    
    // Method declarations
    m = line.match(/(public|private|protected|static|async)?\s*(\w+)\s*\([^)]*\)\s*\{/);
    if (m && m[2] && !['if', 'for', 'while', 'switch', 'catch', 'else'].includes(m[2])) {
      funcs.push({ name: m[2], line: i + 1, kind: 'method' });
    }
  }
  return funcs;
}

const files = getAllTsFiles(SRC_DIR);
const results = [];

for (const file of files) {
  const code = readFileSync(file, 'utf-8');
  const complexity = computeCyclomaticComplexity(code);
  const lines = code.split('\n').length;
  const funcs = extractFunctionNames(code);
  const relPath = relative(process.cwd(), file);
  
  results.push({
    path: relPath,
    complexity,
    loc: lines,
    funcCount: funcs.length,
    code,
    funcs
  });
}

// Sort by complexity descending
results.sort((a, b) => b.complexity - a.complexity);

console.log('COMPLEXITY_RANKING_START');
console.log('Rank | File | Complexity | LOC | Functions');
results.forEach((r, i) => {
  console.log(`${i + 1}. | ${r.path} | ${r.complexity} | ${r.loc} | ${r.funcCount}`);
});
console.log('COMPLEXITY_RANKING_END');

// Top 20 details
console.log('\nTOP20_DETAILS_START');
for (let i = 0; i < Math.min(20, results.length); i++) {
  const r = results[i];
  console.log(`\n=== #${i+1}: ${r.path} (C=${r.complexity}, LOC=${r.loc}) ===`);
  
  // Analyze per-function complexity for the most complex file
  const funcs = r.funcs;
  if (funcs.length > 0) {
    // We can compute per-function complexity by splitting on function boundaries
    const lines = r.code.split('\n');
    let currentFunc = null;
    let funcStart = 0;
    let funcComplexity = 0;
    let braceDepth = 0;
    let inFunc = false;
    
    for (let li = 0; li < lines.length; li++) {
      const line = lines[li];
      // Check if this line starts a function
      const funcMatch = funcs.find(f => f.line === li + 1);
      if (funcMatch) {
        if (inFunc && currentFunc) {
          console.log(`  Function: ${currentFunc} (C≈${funcComplexity}, lines ${funcStart}-${li})`);
        }
        currentFunc = funcMatch.name;
        funcStart = li + 1;
        funcComplexity = 0;
        inFunc = false;
        braceDepth = 0;
      }
      
      // Track brace depth for very rough function boundaries
      for (const ch of line) {
        if (ch === '{') braceDepth++;
        if (ch === '}') braceDepth--;
      }
      
      if (funcMatch) {
        inFunc = true;
      }
      
      if (inFunc && currentFunc) {
        // Count decision points in this function
        const trimmed = line.trim();
        if (/\bif\s*\(/.test(trimmed)) funcComplexity++;
        if (/\b(for|while)\s*\(/.test(trimmed) && !trimmed.startsWith('for(')) funcComplexity++;
        if (/\bcatch\s*\(/.test(trimmed)) funcComplexity++;
        const ternaryMatches = trimmed.match(/[?]\s*\S+\s*:/g);
        if (ternaryMatches) funcComplexity += ternaryMatches.length;
      }
      
      if (inFunc && currentFunc && braceDepth <= 0 && li > funcStart + 1) {
        console.log(`  Function: ${currentFunc} (C≈${funcComplexity}, lines ${funcStart}-${li})`);
        inFunc = false;
        currentFunc = null;
      }
    }
    
    // Catch any remaining
    if (inFunc && currentFunc) {
      console.log(`  Function: ${currentFunc} (C≈${funcComplexity}, lines ${funcStart}-${lines.length})`);
    }
  }
  
  // CFG analysis
  console.log('\n  Control Flow Analysis:');
  const cfgObs = analyzeControlFlow(r.code);
  for (const obs of cfgObs) {
    console.log(`  ${obs}`);
  }
}
console.log('TOP20_DETAILS_END');

function analyzeControlFlow(code) {
  const observations = [];
  const lines = code.split('\n');
  
  // Check for unreachable code patterns
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    const nextLine = lines[i + 1].trim();
    
    // return/throw followed by non-empty code (possible unreachable)
    if ((/^\s*return\s/.test(line) || /^\s*throw\s/.test(line)) && 
        nextLine && !nextLine.startsWith('}') && !nextLine.startsWith('//') && !nextLine.startsWith('/*')) {
      observations.push(`[CHECK] Line ${i+1}: '${line}' — code on line ${i+2} may be unreachable`);
    }
  }
  
  // Check for empty catch blocks (swallowed errors)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/catch\s*\{/.test(line) || (/catch\s*\(/.test(line) && lines[i+1]?.trim() === '{' && (lines[i+2]?.trim() === '}' || lines[i+2]?.trim().startsWith('//')))) {
      observations.push(`[ANOMALY] Line ${i+1}: Empty catch block — errors silently swallowed`);
    }
  }
  
  // Check for catch with only a comment
  for (let i = 0; i < lines.length - 2; i++) {
    const line = lines[i].trim();
    if (/catch\s*\(/.test(line) || /catch\s*\{/.test(line)) {
      const bodyLine = lines[i+1]?.trim();
      if (bodyLine?.startsWith('//') && lines[i+2]?.trim() === '}') {
        observations.push(`[ANOMALY] Line ${i+1}: Catch block only has a comment — errors silently swallowed`);
      }
    }
  }
  
  // Check for deep nesting (indicates high complexity)
  let maxDepth = 0;
  let currentDepth = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes('{')) currentDepth++;
    if (trimmed.includes('}')) currentDepth--;
    if (currentDepth > maxDepth) maxDepth = currentDepth;
  }
  if (maxDepth > 6) {
    observations.push(`[STRUCTURE] Max nesting depth: ${maxDepth} — consider refactoring deeply nested blocks`);
  }
  
  // Check for missing default in switch statements
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('switch')) {
      let hasDefault = false;
      for (let j = i + 1; j < Math.min(i + 30, lines.length); j++) {
        if (lines[j].trim().startsWith('default')) { hasDefault = true; break; }
        if (lines[j].trim().startsWith('}') && j > i + 1) break;
      }
      if (!hasDefault) {
        observations.push(`[MISSING] Line ${i+1}: Switch without default case — missing fallback branch`);
      }
    }
  }
  
  // Check for for loops without bounds check (potential infinite loop)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/for\s*\(\s*[^;]*;\s*[^;]*;\s*\)/.test(line) || /while\s*\(\s*true\s*\)/.test(line)) {
      // Check for break within the loop body
      let hasBreak = false;
      for (let j = i + 1; j < Math.min(i + 30, lines.length); j++) {
        if (lines[j].trim().startsWith('break') || lines[j].trim().startsWith('return')) { hasBreak = true; break; }
        if (lines[j].trim().startsWith('}') && lines[j].trim().length === 1) break;
      }
      if (!hasBreak) {
        observations.push(`[ANOMALY] Line ${i+1}: Loop without break/return — potential infinite loop`);
      }
    }
  }
  
  return observations;
}
