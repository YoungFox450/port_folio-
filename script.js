// Toggle FAQ answers
document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', () => {
        const answer = item.nextElementSibling;
        answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    });
});

// Code typing effect
const codeOutput = document.getElementById('code-output');
const code = `<!DOCTYPE html>\\n<html lang="fr">\\n<head>\\n    <meta charset="UTF-8">\\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\\n    <title>Hello Monde</title>\\n</head>\\n<body>\\n    <h1>Hello monde</h1>\\n</body>\\n</html>`;

let index = 0;

function typeCode() {
    codeOutput.style.visibility = 'visible';
    codeOutput.textContent = '';
    index = 0;
    const interval = setInterval(() => {
        if (index < code.length) {
            codeOutput.textContent += code[index++];
        } else {
            clearInterval(interval);
            setTimeout(typeCode, 10000);
        }
    }, 60);
}

setTimeout(typeCode, 5000);