'use strict';

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".saiba-mais")
    const homePage = document.getElementById("home-page")
    const detailsPage = document.getElementById("details-page")
    const actorDetailsPage = document.getElementById("actor-details-page")
    const movieImageLarge = document.getElementById("movie-image-large")
    const castList = document.getElementById("cast-list")
    const quoteText = document.getElementById("quote-text")
    const quoteButton = document.getElementById("random-quote")
    const backButton = document.getElementById("back-button")
    const backToMovieButton = document.getElementById("back-to-movie")

    const movies = [
        { id: 0, title: "Shrek", image: "./shrek1.jpeg" },
        { id: 1, title: "Shrek 2", image: "./shrek2.jpeg" },
        { id: 2, title: "Shrek Terceiro", image: "./shrek3.jpeg" },
        { id: 3, title: "Shrek Para Sempre", image: "./shrek4.jpeg" }
    ]

    let currentMovieId = null;

    async function fetchCast(movieId) {
        try {
            const response = await fetch(`https://shrekofficial.com/${movieId}/cast/top`)
            const data = await response.json()

            if (!Array.isArray(data)) {
                console.error("Estrutura de dados inválida:", data)
                return []
            }

            return data.map(actor => actor.name)
        } catch (error) {
            console.error("Erro ao buscar o elenco:", error)
            return []
        }
    }

    function fetchQuote(movieId) {
        fetch(`https://shrekofficial.com/${movieId}/quotes/random/text`)
            .then(response => response.text())
            .then(quote => {
                quoteText.textContent = `"${quote}"`
            })
            .catch(error => {
                console.error("Erro ao buscar a citação:", error)
            })
    }

    async function fetchActorDetails(actorName) {
        try {
            // buscando toda a lista de elenco 
            const response = await fetch(`https://shrekofficial.com/${currentMovieId}/cast/top`);
            
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
    
            const data = await response.json();
    
            // procurando o ator na lista de elenco
            const actor = data.find(a => a.name === actorName);
    
            if (!actor) {
                return "Nenhuma informação disponível para esse ator.";
            }
    
            //pega os personagens que ele dublou
            return actor.characters.length > 0 
                ? `Personagens: ${actor.characters.join(", ")}`
                : "Nenhum personagem listado.";
            
        } catch (error) {
            console.error("Erro ao buscar detalhes do ator:", error);
            return "Erro ao obter informações do ator.";
        }
    }
    

    async function showMovieDetails(movieId) {
        const movie = movies.find(m => m.id === parseInt(movieId))
        if (!movie) return

        movieImageLarge.src = movie.image
        movieImageLarge.alt = movie.title
        
        // limpa a citação anterior e atualiza o ID do filme
        quoteText.textContent = ""
        currentMovieId = movieId

        const castNames = await fetchCast(movieId)
        castList.innerHTML = ""

        // cria colunas para exibir os nomes dos dubladores
        for (let i = 0; i < 3; i++) {
            const column = document.createElement("ul")
            // adiciona os nomes
            for (let j = i * 8; j < (i + 1) * 8 && j < castNames.length; j++) {
                const listItem = document.createElement("li")
                listItem.textContent = castNames[j]
                listItem.classList.add("cast-name")
                listItem.dataset.actor = castNames[j]

                // adiciona evento de clique para exibir detalhes do ator
                listItem.addEventListener("click", async function () {
                    await showActorDetails(this.dataset.actor)
                })

                column.appendChild(listItem)
            }
            castList.appendChild(column)
        }

        homePage.style.display = "none"
        detailsPage.style.display = "flex"
    }

    // função para exibir os detalhes do ator
    async function showActorDetails(actorName) {
        document.getElementById("actor-name").textContent = actorName
        document.getElementById("actor-details").textContent = "Carregando..."

        const details = await fetchActorDetails(actorName)
        document.getElementById("actor-details").textContent = details

        detailsPage.style.display = "none"
        actorDetailsPage.style.display = "flex"
    }

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const movieId = this.getAttribute("data-movie-id")
            showMovieDetails(movieId)
        })
    })

    backButton.addEventListener("click", function () {
        homePage.style.display = "flex"
        detailsPage.style.display = "none"
    })

    backToMovieButton.addEventListener("click", function () {
        actorDetailsPage.style.display = "none"
        detailsPage.style.display = "flex"
    })

    quoteButton.addEventListener("click", function () {
        if (currentMovieId !== null) {
            fetchQuote(currentMovieId)
        }
    })
})
