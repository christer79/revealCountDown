/**
 * A plugin which enables rendering of a countdown clock in
 * reveal.js slides with a circular progress indicator.
 *
 * @author Christer Eriksson, modificato
 */
var RevealCountDown =
window.RevealCountDown ||
(function () {
  var options = Reveal.getConfig().countdown || {};

  var defaultOptions = {
    defaultTime: 300,
      autostart: "no",
 tDelta: 30,
 playTickSoundLast: 10,
 tickSound: "",
 timeIsUpSound: "",
  };

  defaults(options, defaultOptions);

  function defaults(options, defaultOptions) {
    for (var i in defaultOptions) {
      if (!options.hasOwnProperty(i)) {
        options[i] = defaultOptions[i];
      }
    }
  }

  var tick = options.tickSound != "" ? new Audio(options.tickSound) : null;
  var endSound =
  options.timeIsUpSound != "" ? new Audio(options.timeIsUpSound) : null;
  var counterRef = null;
  var interval = null;
  var startTime = 0;
  var elapsedTime = 0;
  var running = false;

  // Aggiungi stili dinamici
  function addStyles() {
    const style = document.createElement("style");
    style.textContent = `
    .countdown-circle {
      width: 120px;
      height: 120px;
      display: block;
      margin: 0 auto;
    }
    .countdown-circle circle:nth-child(1) {
      stroke: var(--r-heading-color, #ddd); /* Colore del tema */
    }
    .countdown-circle circle:nth-child(2) {
      stroke: var(--r-link-color, #007bff); /* Colore del tema */
      transition: stroke-dashoffset 0.1s linear;
    }
    .countdown-circle text {
      font-family: inherit; /* Font del tema */
      font-size: 18px;
      fill: var(--r-heading-color, #333); /* Colore del testo */
    }
    body.dark .countdown-circle circle:nth-child(1) {
      stroke: #555; /* Sfondo scuro */
    }
    body.dark .countdown-circle circle:nth-child(2) {
      stroke: #4caf50; /* Colore accento scuro */
    }
    body.dark .countdown-circle text {
      fill: #fff; /* Testo scuro */
    }
    `;
    document.head.appendChild(style);
  }

  Reveal.addEventListener("slidechanged", function (event) {
    initCountDown(event.currentSlide);
  });

  Reveal.addEventListener("ready", function (event) {
    initCountDown(event.currentSlide);
  });

  Reveal.addKeyBinding(
    { keyCode: 84, key: "T", description: "Pause/Unpause timer" },
    function () {
      togglePauseTimer();
    }
  );

  Reveal.addKeyBinding(
    {
      keyCode: 187,
      key: "+",
      description: "Increase timer with tDelta seconds",
    },
    increaseTime
  );

  Reveal.addKeyBinding(
    {
      keyCode: 189,
      key: "-",
      description: "Decrease time with tDelta seconds",
    },
    decreseTime
  );

  function createCircularTimer(element) {
    element.innerHTML = `
    <svg viewBox="0 0 100 100" class="countdown-circle">
    <circle cx="50" cy="50" r="45" stroke-width="10" fill="none"></circle>
    <circle cx="50" cy="50" r="45" stroke-width="10" fill="none" stroke-dasharray="283" stroke-dashoffset="283"></circle>
    <text x="50" y="55" text-anchor="middle"></text>
    </svg>
    `;
  }

  function updateTimer(timeLeft) {
    if (counterRef === null) return;

    // Calcola ore, minuti, secondi
    let secondsLeft = timeLeft;
    const minutesLeft = Math.floor(secondsLeft / 60);
    secondsLeft = secondsLeft % 60;

    // Aggiorna testo al centro
    const text = counterRef.querySelector("text");
    text.textContent = `${minutesLeft}:${secondsLeft.toString().padStart(2, "0")}`;

    // Aggiorna cerchio progressivo
    const circle = counterRef.querySelector("circle:nth-child(2)");
    const totalTime = startTime;
    const percentage = (timeLeft / totalTime) * 283; // 283 è la lunghezza della circonferenza
    circle.setAttribute("stroke-dashoffset", percentage);
  }

  function increaseTime() {
    startTime = Number(startTime) + Number(options.tDelta);
    updateTimer(startTime - elapsedTime);
  }

  function decreseTime() {
    startTime = Number(startTime) - Number(options.tDelta);
    if (startTime < elapsedTime) startTime = elapsedTime;
    updateTimer(startTime - elapsedTime);
  }

  function togglePauseTimer() {
    running = !running;
  }

  function startTimer() {
    interval = setInterval(function () {
      if (elapsedTime < startTime && running && !Reveal.isPaused()) {
        elapsedTime += 1;
        updateTimer(startTime - elapsedTime);
        if (tick && startTime < elapsedTime + options.playTickSoundLast)
          tick.play();
        if (endSound && elapsedTime >= startTime) endSound.play();
      }
    }, 1000);
  }

  function initCountDown(currentSlide) {
    if (interval != null) clearInterval(interval);
    counterRef = currentSlide.querySelector("countdown");
    if (!counterRef) return;

    createCircularTimer(counterRef);

    const time = counterRef.getAttribute("time");
    const autostart = counterRef.getAttribute("autostart");

    elapsedTime = 0;
    startTime = time ? parseInt(time, 10) : options.defaultTime;

    startTimer();
    updateTimer(startTime - elapsedTime);

    running = autostart === "yes";
  }

  addStyles(); // Aggiungi stili globali

  return {
    init: function () {},
  };
})();

Reveal.registerPlugin("countdown", RevealCountDown);
