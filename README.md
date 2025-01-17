# Countdown.js

This plugin let you add a graphic countdown timer to your reveal.js presentations

![coundown_screenshot](https://github.com/user-attachments/assets/c0dd1799-f418-45a0-9113-619b8e783149)


## Usage

Using the plugin is easy. First, register it in your Reveal.js initialize block.

```javascript
<script>
    // Import countdown plugin in Reveal.js
    const RevealCountdown = {
        id: 'countdown',
        init: function(deck) {
            return new Promise(resolve => {
                // Carica dinamicamente lo script countdown
                const script = document.createElement('script');
                script.src = 'plugin/countdown/countdown.js';
                script.onload = () => {
                    resolve();
                };
                document.head.appendChild(script);
            });
        }
    };

    // Configure Reveal.js
    Reveal.initialize({
        hash: true,

        // Add plugin countdown to the plugins array
        plugins: [RevealMarkdown, RevealHighlight, RevealNotes, RevealCountdown],

        // Configure countdown plugin
        countdown: {
            defaultTime: 600,
            autostart: "no"
        }
    });
</script>

```

Then simply add an element into your presentation:

```html
<section>
  <h1>5 minutes timer</h1>
  <countdown time="300" autostart="yes" />
</section>
```

### Pause/Resume

The defult keybinding to toggle pause/resume the timer is **t**

The timer will also pause when th epresentation is paused by pressing the period dot.

### increase Decrease counter time

Use the **+** and **-** keys to increment decrement timer with tDelta seconds. tDelta can be configured as seen in the next section.

## Configuration

The plugin can be configured with default values and settings in the initialize function:

- defaultTime: Default time for a timer if no time is given as attribute to <countodwn/>
- autostart: yes/no wether a timer should auotstart or not when the slide with timer loads
- tDelta: nr of seconds to increase decreas when pressing '+' and '-' key.
- tickSound: Sound to play every second for the last X seconds.
- timesUpSound: Sound to play when the time is up.

```javascript
    countdown: {
      defaultTime: 600,
      autostart: "no",
      tDelta: 60,
      playTickSoundLast: 10,
      tickSound: "http://soundbible.com/grab.php?id=2044&type=mp3",
      timeIsUpSound: "http://soundbible.com/grab.php?id=1746&type=mp3"
    }
```

defaults are:

```javascript
{
  defaultTime: 300,
  autostart: "no",
  tDelta: 30,
  playTickSoundLast: 10,
  tickSound: "",
  timeIsUpSound: ""
}
```
