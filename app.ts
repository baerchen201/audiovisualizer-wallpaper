const DEV = !Object.keys(window).includes("wallpaperGetUtilities");

console.log(DEV ? "Development environment" : "Wallpaper environment");

class AudioBar extends HTMLElement {
  on() {
    this.classList.add("on");
  }
  off() {
    this.classList.remove("on");
  }
}
customElements.define("audio-bar", AudioBar);

class AudioColumn extends HTMLElement {
  constructor() {
    super();
    document.body.appendChild(this);
  }
  connectedCallback() {
    this.innerHTML = "";

    for (let bar_id = 0; bar_id < 128; bar_id++) {
      const bar = new AudioBar();
      this.appendChild(bar);
    }
  }

  set value(value: number) {
    for (let i = 0; i < this.children.length; i++) {
      const element: AudioBar = this.children[i] as AudioBar;
      if (value <= i / 128) element.off();
      else element.on();
    }
  }
}
customElements.define("audio-column", AudioColumn);

const audio_columns: AudioColumn[] = [];
for (let column_id = 0; column_id < 128; column_id++) {
  audio_columns.push(new AudioColumn());
}

function update(audio_data: number[]) {
  console.log(audio_data);
  audio_data.forEach((volume: number, index: number) => {
    audio_columns[index].value = volume;
  });
}

if (DEV)
  setInterval(
    (function _() {
      let rand_data = [];
      while (rand_data.length < 128) {
        rand_data.push(Math.random());
      }

      update(rand_data);

      return _;
    })(),
    500
  );
else (window as any).wallpaperRegisterAudioListener(update);
