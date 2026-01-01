const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;

// HTML table parser - specifically for ContentPlaceHolder1_grd_project table
function parseHTMLTable(html) {
    const projects = [];
    
    // Find the specific table by ID
    const tableMatch = html.match(/<table[^>]*id=["']ContentPlaceHolder1_grd_project["'][^>]*>([\s\S]*?)<\/table>/i);
    if (!tableMatch) {
        console.warn('Table with ID ContentPlaceHolder1_grd_project not found');
        return projects;
    }
    
    const tableHtml = tableMatch[1];
    
    // Extract all data rows (skip header row)
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const rows = [];
    let match;
    while ((match = rowRegex.exec(tableHtml)) !== null) {
        const row = match[1];
        // Skip header row (contains <th>)
        if (row.includes('<th')) continue;
        rows.push(row);
    }
    
    // Process each data row
    for (const row of rows) {
        // Extract all <td> cells
        const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
        const cells = [];
        let cellMatch;
        while ((cellMatch = cellRegex.exec(row)) !== null) {
            cells.push(cellMatch[1]);
        }
        
        // Expected structure:
        // [0] = Checkbox + hidden inputs (skip)
        // [1] = Project Title (in <div>)
        // [2] = Objective (in <span id="...lbObjective_X">)
        // [3] = OutCome (in <span id="...lbOutCome_X">)
        // [4] = Skills (in <span id="...lbSkills_X">)
        // [5] = SuperVisior (in <span id="...lbSuperVisior_X">)
        // [6] = Co-SuperVisior (skip)
        // [7] = Total Preference (skip)
        
        if (cells.length < 6) continue;
        
        // Extract Project Title (from <div> in second cell)
        let title = '';
        const titleDivMatch = cells[1].match(/<div[^>]*>([\s\S]*?)<\/div>/i);
        if (titleDivMatch) {
            title = titleDivMatch[1].replace(/<[^>]+>/g, '').trim();
        } else {
            // Fallback: just get text from cell
            title = cells[1].replace(/<[^>]+>/g, '').trim();
        }
        
        // Extract Objective (from <span>)
        let objective = '';
        const objectiveMatch = cells[2].match(/<span[^>]*>([\s\S]*?)<\/span>/i);
        if (objectiveMatch) {
            objective = objectiveMatch[1].replace(/<[^>]+>/g, '').trim();
        } else {
            objective = cells[2].replace(/<[^>]+>/g, '').trim();
        }
        
        // Extract OutCome (from <span>)
        let outcome = '';
        const outcomeMatch = cells[3].match(/<span[^>]*>([\s\S]*?)<\/span>/i);
        if (outcomeMatch) {
            outcome = outcomeMatch[1].replace(/<[^>]+>/g, '').trim();
        } else {
            outcome = cells[3].replace(/<[^>]+>/g, '').trim();
        }
        
        // Extract Skills (from <span>)
        let skills = '';
        const skillsMatch = cells[4].match(/<span[^>]*>([\s\S]*?)<\/span>/i);
        if (skillsMatch) {
            skills = skillsMatch[1].replace(/<[^>]+>/g, '').trim();
        } else {
            skills = cells[4].replace(/<[^>]+>/g, '').trim();
        }
        
        // Extract SuperVisior (from <span>)
        let supervisor = '';
        const supervisorMatch = cells[5].match(/<span[^>]*>([\s\S]*?)<\/span>/i);
        if (supervisorMatch) {
            supervisor = supervisorMatch[1].replace(/<[^>]+>/g, '').trim();
        } else {
            supervisor = cells[5].replace(/<[^>]+>/g, '').trim();
        }
        
        // Only add if we have a title
        if (title && title.length > 0) {
            projects.push({
                title: title,
                objective: objective,
                context: outcome, // OutCome column
                skills: skills,
                area: '', // Not in this table
                person: supervisor // SuperVisior column
            });
        }
    }
    
    return projects;
}

// Helper function to process response
function processResponse(data, res) {
    // Check if we got redirected to login page or home page
    const hasLoginPage = data.includes('Log in') || 
        data.includes('Welcome to University Information') || 
        data.includes('UIMSLoginCookie');
    
    const hasProjectTable = data.includes('ContentPlaceHolder1_grd_project') || 
        data.includes('frmStudentProjectPolling');
    
    if (hasLoginPage || !hasProjectTable) {
        console.error('⚠️  Authentication failed - got login/home page instead of polling page');
        console.error('💡 Your cookies may have expired. Please update AUTH_COOKIES in proxy-server.js');
        console.error('💡 Make sure you copy cookies from a request to frmStudentProjectPolling.aspx, not StudentHome.aspx');
        console.error('📄 Response preview:', data.substring(0, 500));
        res.writeHead(401, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ 
            error: 'Authentication failed - cookies expired or invalid',
            message: 'Got redirected to home/login page. Please update AUTH_COOKIES in proxy-server.js with fresh cookies from your browser. Make sure you copy cookies from a request to frmStudentProjectPolling.aspx page.'
        }));
        return;
    }

    // Parse the HTML and extract just the table data
    const projects = parseHTMLTable(data);
    
    if (projects.length === 0) {
        console.warn('⚠️  No projects found in HTML. The page structure might have changed.');
        console.warn('📄 First 1000 chars of response:', data.substring(0, 1000));
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ 
            error: 'No projects found',
            message: 'Could not parse projects from the HTML. The page structure might have changed.',
            projects: []
        }));
        return;
    }

    // Return JSON with just the project data
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ 
        success: true,
        projects: projects,
        count: projects.length
    }));
    
    console.log(`✅ Successfully fetched ${projects.length} projects`);
}

// Your authentication cookies
const AUTH_COOKIES = "_ga=GA1.1.738369711.1762419153; _gcl_au=1.1.46181186.1765163094; _ga_8N1BKMH5LY=GS2.1.s1765163092$o1$g0$t1765163188$j60$l0$h232556736; _ga_NGE1EJDNLY=GS2.1.s1765163092$o1$g0$t1765163188$j60$l0$h0; _ga_PS93BBF02P=GS2.1.s1765163095$o1$g0$t1765163188$j60$l0$h1985141567; UIMSLoginCookie12/25/2025=m29s7KDhZdw39j6iopfjpA==; UIMSLoginCookie12/26/2025=pMCdMW5FfCFCILz/tyo2jQ==; _ga_9ZHHJ22BJS=GS2.1.s1766756027$o63$g1$t1766756086$j1$l0$h0; _ga_7Z2H19VJWK=GS2.1.s1766756027$o63$g1$t1766756086$j1$l0$h0; _ga_VTQ3M834LB=GS2.1.s1766812153$o53$g0$t1766812153$j60$l0$h0; UIMSLoginCookie12/27/2025=tPTe6KHd/iOyv192+Socqg==; ASP.NET_SessionId=mhf4lg35b32dcorfbfct1mpe; _ga_78T77GFTWH=GS2.1.s1766812165$o23$g1$t1766812179$j46$l0$h0; _ga_7GYS9TV7S7=GS2.1.s1766812165$o27$g1$t1766812282$j60$l0$h0";

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/fetch-projects') {
        const options = {
            hostname: 'students.cuchd.in',
            path: '/frmStudentProjectPolling.aspx',
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cookie': AUTH_COOKIES,
                'Referer': 'https://students.cuchd.in/StudentHome.aspx'
            }
        };

        const httpsReq = https.request(options, (proxyRes) => {
            // Follow redirects
            if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302 || proxyRes.statusCode === 303 || proxyRes.statusCode === 307 || proxyRes.statusCode === 308) {
                const location = proxyRes.headers.location;
                if (location) {
                    console.log(`🔄 Following redirect to: ${location}`);
                    // Parse the redirect URL
                    const redirectUrl = new URL(location, 'https://students.cuchd.in');
                    const redirectOptions = {
                        hostname: redirectUrl.hostname,
                        path: redirectUrl.pathname + redirectUrl.search,
                        method: 'GET',
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                            'Accept-Language': 'en-US,en;q=0.9',
                            'Cookie': AUTH_COOKIES,
                            'Referer': 'https://students.cuchd.in/StudentHome.aspx'
                        }
                    };
                    
                    // Make the redirected request
                    const redirectReq = https.request(redirectOptions, (redirectRes) => {
                        let redirectData = '';
                        redirectRes.on('data', (chunk) => {
                            redirectData += chunk;
                        });
                        redirectRes.on('end', () => {
                            processResponse(redirectData, res);
                        });
                    });
                    redirectReq.on('error', (error) => {
                        console.error('Redirect request error:', error);
                        res.writeHead(500, {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        });
                        res.end(JSON.stringify({ error: error.message }));
                    });
                    redirectReq.end();
                    return;
                }
            }
            
            let data = '';
            proxyRes.on('data', (chunk) => {
                data += chunk;
            });

            proxyRes.on('end', () => {
                processResponse(data, res);
            });
        });
        
        httpsReq.on('error', (error) => {
            console.error('Proxy error:', error);
            res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: error.message }));
        });
        
        httpsReq.end();
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`🚀 CORS Proxy Server running on http://localhost:${PORT}`);
    console.log(`📡 Use this URL in your HTML: http://localhost:${PORT}/fetch-projects`);
    console.log(`\n⚠️  Remember to update AUTH_COOKIES in this file when they expire!`);
});
