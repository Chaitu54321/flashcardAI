document.getElementById("uploadForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "Generating questions... Please wait.";

    const response = await fetch("/generate", {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    if (data.error) {
        resultDiv.innerHTML = `<p class="error">${data.error}</p>`;
    } 
    else if (data.questions) {
        const questionsHtml = data.questions
            .map(
                (q, index) => `
                <div class="flashcard">
                    <p><strong>Q${index + 1}:</strong> ${q.question}</p>
                    <p class="hidden"><strong>Answer:</strong> ${q.answer}</p>
                    <button class="show-answer-btn">Show Answer</button>
                </div>
            `
            )
            .join("");
    
        resultDiv.innerHTML = questionsHtml;
    
        // Add event listeners to each "Show Answer" button
        const buttons = document.querySelectorAll(".show-answer-btn");
        buttons.forEach((button, idx) => {
            button.addEventListener("click", () => {
                const answer = button.previousElementSibling; // get the answer paragraph
                if (answer.classList.contains("hidden")) {
                    answer.classList.remove("hidden");
                    button.textContent = "Hide Answer";
                } else {
                    answer.classList.add("hidden");
                    button.textContent = "Show Answer";
                }
            });
        });
    }
    
    
    else {
        resultDiv.innerHTML = "<p>No questions generated.</p>";
    }
});
