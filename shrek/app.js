'use strict'

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".saiba-mais");
    const homePage = document.getElementById("home-page");
    const detailsPage = document.getElementById("details-page");
    const movieImage = document.getElementById("movie-image");
    const castList = document.getElementById("cast-list");
    const quoteText = document.getElementById("quote-text");
    const quoteButton = document.getElementById("random-quote");
    const backButton = document.getElementById("back-button");

    const movies = [
        { id: 0, title: "Shrek", image: "shrek1.jpg" },
        { id: 1, title: "Shrek 2", image: "shrek2.jpg" },
        { id: 2, title: "Shrek Terceiro", image: "shrek3.jpg" },
        { id: 3, title: "Shrek Para Sempre", image: "shrek4.jpg" }
    ];

    function fetchCast(movieId) {
        fetch(`https://shrekofficial.com/${movieId}/cast/top`)
            .then(response => response.json())
            .then(data => {
                castList.innerHTML = "";
                data.cast.forEach(actor => {
                    const div = document.createElement("div");
                    div.textContent = actor.name;
                    castList.appendChild(div);
                });
            });
    }

    function fetchQuote(movieId) {
        fetch(`https://shrekofficial.com/${movieId}/quotes/random/text`)
            .then(response => response.text())
            .then(quote => {
                quoteText.textContent = `\\"${quote}\\"`;
            });
    }

    function showMovieDetails(movieId) {
        const movie = movies.find(m => m.id === movieId);
        if (!movie) return;

        movieImage.src = movie.image;
        movieImage.alt = movie.title;
        fetchCast(movieId);
        quoteText.textContent = "";
        quoteButton.onclick = () => fetchQuote(movieId);

        detailsPage.style.display = "flex";
    }

    // Mostra detalhes do filme ao clicar no botão saiba mais
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const movieId = this.getAttribute("data-movie-id");

            // Esconde a página inicial e mostra a de detalhes
            homePage.style.display = "none";
            detailsPage.style.display = "flex";

            showMovieDetails(movieId);
        });
    });

    // Voltar para a página inicial
    backButton.addEventListener("click", function () {
        homePage.style.display = "flex";
        detailsPage.style.display = "none";
    });

});