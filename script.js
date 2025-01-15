// Toggle FAQ answers
document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', () => {
        const answer = item.nextElementSibling;
        answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    });
});

// Code typing effect
const codeOutput = document.getElementById('code-output');
const code = `<!DOCTYPE html>
<html lang="fr">
    <head>  
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hello Monde</title>
    </head>

    <body>
        <h1>Hello monde</h1>
    </body>
</html>`;

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