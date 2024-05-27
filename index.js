
const setupGameGrid = async () => {
    console.log("Setting up game grid");
    $("#gameGrid").empty();
    const pokeAPI = 'https://pokeapi.co/api/v2/pokemon/';
    const randomIds = Array.from({length: 3}, () => Math.floor(Math.random() * 810) + 1);
    const pokemonPromises = randomIds.flatMap(id => [axios.get(pokeAPI + id), axios.get(pokeAPI + id)]);
    const responses = await Promise.all(pokemonPromises);
    const pokemons = responses.map(response => response.data);

    const sprites = pokemons.map(pokemon => pokemon.sprites.front_default);
    // console.log(sprites);
    sprites.sort(() => 0.5 - Math.random());  // Shuffle sprites

    sprites.forEach((sprite, index) => {
        const card = $(`
            <div class="card">
                <div class="card_inner">
                    <div class="card_front">
                        <img id="pokemon${index}" src="${sprite}" class="front_face" alt="Pokemon">
                    </div>
                    <div class="card_back"></div>
                </div>
            </div>
        `);
        $("#gameGrid").append(card);
    });

    setup();
}

const setup = () => {
    let firstCard = undefined;
    let secondCard = undefined;
    let matchedPairs = 0; // Counter for matched pairs
    let numOfClicks = 0; // Counter for number of clicks
    let isFlipping = false; // Flag to prevent multiple clicks

    $(".card").off("click").on("click", function () {
        // Check if the card is already matched
        if ($(this).hasClass("matched") || $(this).find(".front_face")[0] === firstCard) {
            return;
        }
        console.log(this);
        $(this).toggleClass("flip");

        if (!firstCard) {
            firstCard = $(this).find(".front_face")[0];
            // $(`#${firstCard.id}`).parent().parent().parent().off("click");
            console.log(firstCard.id);
        } else {
            secondCard = $(this).find(".front_face")[0];
            // console.log(firstCard, secondCard);
            if (firstCard.src === secondCard.src) {
                console.log("match");
                // Mark cards as matched and disable click events
                $(`#${firstCard.id}`).parent().parent().parent().addClass("matched").off("click");
                $(`#${secondCard.id}`).parent().parent().parent().addClass("matched").off("click");
                matchedPairs++;
                // Check if all pairs are matched
                if (matchedPairs === 3) {
                    console.log("All pairs matched!");
                    // Add your logic for game completion here
                }
            } else {
                console.log("no match");
                const currentFirstCard = firstCard;
                const currentSecondCard = secondCard;
                isFlipping = true;
                setTimeout(() => {
                    // console.log(currentFirstCard, currentSecondCard);
                    $(`#${currentFirstCard.id}`).parent().parent().parent().toggleClass("flip");
                    $(`#${currentSecondCard.id}`).parent().parent().parent().toggleClass("flip");

                    isFlipping = false;
                }, 1000);
                
            }
            firstCard = undefined;
            secondCard = undefined;
        }
    });
}

 
$(document).ready(() => {
    setupGameGrid().catch(console.error);
});