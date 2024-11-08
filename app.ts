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
for (let column_id = 0; column_id < 64; column_id++) {
  audio_columns.unshift(new AudioColumn());
}
for (let column_id = 0; column_id < 64; column_id++) {
  audio_columns.push(new AudioColumn());
}

function update(audio_data: number[]) {
  audio_data.forEach((volume: number, index: number) => {
    audio_columns[index].value = volume;
  });
}

if (DEV) {
  const values: number[] = [];
  let offset: number = 128;
  for (let i = 0; i < 128; i++) {
    values.push(Math.sin(i / 8) * 0.25);
  }
  setInterval(
    (function _() {
      update(values);
      values.unshift(Math.sin(offset / 8) * 0.25);
      offset++;
      values.pop();

      return _;
    })(),
    1e3 / 30
  );
} else (window as any).wallpaperRegisterAudioListener(update);
