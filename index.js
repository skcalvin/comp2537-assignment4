const setupGameGrid = async (numPairs, ball) => {
  console.log(ball);  
  console.log("Setting up game grid");
  $("#gameMessage").text("");
  $("#gameGrid").empty();
  const pokeAPI = "https://pokeapi.co/api/v2/pokemon/";
  const randomIds = Array.from(
    { length: numPairs },
    () => Math.floor(Math.random() * 810) + 1
  );
  const pokemonPromises = randomIds.flatMap((id) => [
    axios.get(pokeAPI + id),
    axios.get(pokeAPI + id),
  ]);
  const responses = await Promise.all(pokemonPromises);
  const pokemons = responses.map((response) => response.data);

  const sprites = pokemons.map((pokemon) => pokemon.sprites.front_default);
  // console.log(sprites);
  sprites.sort(() => 0.5 - Math.random()); // Shuffle sprites

  sprites.forEach((sprite, index) => {
    const card = $(`
            <div class="card">
                <div class="card_inner">
                    <div class="card_front">
                        <img id="pokemon${index}" src="${sprite}" class="front_face" alt="Pokemon">
                    </div>
                    <div class="card_back ${ball}"></div>
                </div>
            </div>
        `);
    $("#gameGrid").append(card);
  });

  setup(numPairs);
};

const setup = (numPairs) => {
  let firstCard = undefined;
  let secondCard = undefined;
  let matchedPairs = 0; // Counter for matched pairs
  let numOfClicks = 0; // Counter for number of clicks
  let totalMatches = numPairs; // Total number of pairs
  let isFlipping = false; // Flag to prevent multiple clicks
  let timer;
  let timeElapsed = 0;

  $("#timeElapsed").text(timeElapsed);

  $("#clickCount").text(numOfClicks);
  $("#totalMatches").text(totalMatches);
  $("#matchesMade").text(matchedPairs);
  $("#matchesLeft").text(totalMatches - matchedPairs);

  if (window.timer) clearInterval(window.timer);
    window.timer = setInterval(() => {
        timeElapsed++;
        $("#timeElapsed").text(timeElapsed);
    }, 1000);

  $(".card")
    .off("click")
    .on("click", function () {
      // Check if the card is already matched
      if (
        $(this).hasClass("matched") ||
        $(this).find(".front_face")[0] === firstCard ||
        isFlipping == true
      ) {
        return;
      }
      // console.log(this);
      $(this).toggleClass("flip");
      numOfClicks++;
      $("#clickCount").text(numOfClicks);

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
          $(`#${firstCard.id}`)
            .parent()
            .parent()
            .parent()
            .addClass("matched")
            .off("click");
          $(`#${secondCard.id}`)
            .parent()
            .parent()
            .parent()
            .addClass("matched")
            .off("click");
          matchedPairs++;
          $("#matchesMade").text(matchedPairs);
        $("#matchesLeft").text(totalMatches - matchedPairs);
          // Check if all pairs are matched
          if (matchedPairs === totalMatches) {
            console.log("All pairs matched!");
            clearInterval(window.timer);
            // Add your logic for game completion here
            $("#gameMessage").text("YOU WIN!");
          }
        } else {
          console.log("no match");
          const currentFirstCard = firstCard;
          const currentSecondCard = secondCard;
          isFlipping = true;
          setTimeout(() => {
            // console.log(currentFirstCard, currentSecondCard);
            $(`#${currentFirstCard.id}`)
              .parent()
              .parent()
              .parent()
              .toggleClass("flip");
            $(`#${currentSecondCard.id}`)
              .parent()
              .parent()
              .parent()
              .toggleClass("flip");

            isFlipping = false;
          }, 1000);
        }
        firstCard = undefined;
        secondCard = undefined;
      }
    });
};

const startGame = () => {
    const selectedDifficulty = $('input[name="options"]:checked').val();
    let numPairs;
    let ball;
    switch (selectedDifficulty) {
        case 'easy':
            numPairs = 3;
            ball = "pokeball"; 
            break;
        case 'medium':
            numPairs = 6; 
            ball = "greatball";
            break;
        case 'hard':
            numPairs = 9; 
            ball = "ultraball";
            break;
        default:
            numPairs = 3; 
            ball = "pokeball";
    }
    setupGameGrid(numPairs, ball);
}

const resetGame = () => {
    if (window.timer) clearInterval(window.timer);
    $("#gameGrid").empty();
    $("#clickCount").text(0);
    $("#totalMatches").text(0);
    $("#matchesMade").text(0);
    $("#matchesLeft").text(0);
    $("#timeElapsed").text(0);
}

$(document).ready(() => {
    $("#startGame").on("click", startGame);
    $("#resetGame").on("click", resetGame);
});
