'use strict';
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
        { id: 0, title: "Shrek", image: "./shrek1.jpeg" },
        { id: 1, title: "Shrek 2", image: "./shrek2.jpeg" },
        { id: 2, title: "Shrek Terceiro", image: "./shrek3.jpeg" },
        { id: 3, title: "Shrek Para Sempre", image: "./shrek4.jpeg" }
    ];

    let currentMovieId = null;

    async function fetchCast(movieId) {
        try {
            const response = await fetch(`https://shrekofficial.com/${movieId}/cast/top`);
            const data = await response.json();
            console.log("Dados da API do elenco:", data);

            if (!Array.isArray(data)) {
                console.error("Estrutura de dados inválida:", data);
                return [];
            }

            const castNames = data.map(actor => actor.name);
            console.log("Nomes do elenco:", castNames);

            return castNames;
        } catch (error) {
            console.error("Erro ao buscar o elenco:", error);
            return [];
        }
    }

    function fetchQuote(movieId) {
        fetch(`https://shrekofficial.com/${movieId}/quotes/random/text`)
            .then(response => response.text())
            .then(quote => {
                quoteText.textContent = `"${quote}"`;
            })
            .catch(error => {
                console.error("Erro ao buscar a citação:", error);
            });
    }

    async function showMovieDetails(movieId) {
        const movie = movies.find(m => m.id === parseInt(movieId));
        if (!movie) return;

        const movieImageLarge = document.getElementById("movie-image-large");
        movieImageLarge.src = movie.image;
        movieImageLarge.alt = movie.title;

        quoteText.textContent = "";
        currentMovieId = movieId;

        const castNames = await fetchCast(movieId);
        console.log("Elenco recebido:", castNames);

        castList.innerHTML = ""; // Limpa a lista anterior

        for (let i = 0; i < 3; i++) {
            const column = document.createElement("ul");
            for (let j = i * 8; j < (i + 1) * 8 && j < castNames.length; j++) {
                const listItem = document.createElement("li");
                listItem.textContent = castNames[j];
                column.appendChild(listItem);
            }
            castList.appendChild(column);
        }
    }

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const movieId = this.getAttribute("data-movie-id");

            homePage.style.display = "none";
            detailsPage.style.display = "flex";

            showMovieDetails(movieId);
        });
    });

    backButton.addEventListener("click", function () {
        homePage.style.display = "flex";
        detailsPage.style.display = "none";
    });

    quoteButton.addEventListener("click", function () {
        if (currentMovieId !== null) {
            fetchQuote(currentMovieId);
        }
    });
});