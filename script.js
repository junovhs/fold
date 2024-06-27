const pages = [
    { name: 'Home', file: 'home.md' },
    { name: 'Main Concepts', file: 'main-concepts.md' },
    { name: 'Story Structure', file: 'story-structure.md' },
    { name: 'Themes', file: 'themes.md' },
    { name: 'Locations', file: 'locations.md' }
];

const navList = document.getElementById('nav-list');
const content = document.getElementById('content');
const converter = new showdown.Converter();

// Populate navigation
pages.forEach(page => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${page.file}`;
    a.textContent = page.name;
    li.appendChild(a);
    navList.appendChild(li);
});

// Handle navigation
window.addEventListener('hashchange', loadPage);
window.addEventListener('load', loadPage);

function loadPage() {
    const page = pages.find(p => p.file === location.hash.slice(1)) || pages[0];
    fetch(page.file)
        .then(response => response.text())
        .then(text => {
            content.innerHTML = converter.makeHtml(text);
        })
        .catch(error => {
            content.innerHTML = '<p>Error loading page.</p>';
            console.error('Error:', error);
        });
}

// Add print functionality
const printButton = document.createElement('button');
printButton.textContent = 'Print Wiki';
printButton.addEventListener('click', printWiki);
document.body.appendChild(printButton);

async function printWiki() {
    let fullContent = '';
    for (const page of pages) {
        const response = await fetch(page.file);
        const text = await response.text();
        fullContent += `<h1>${page.name}</h1>\n${converter.makeHtml(text)}\n\n`;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Quantum Drift Wiki</title>
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                ${fullContent}
                <script>window.print();window.close();</script>
            </body>
        </html>
    `);
}
