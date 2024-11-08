const LEVELS = 128,
  DEV_FPS = 30;
let NORMALIZE: number = 20;

const DEV = !Object.keys(window).includes("wallpaperGetUtilities");

console.info(DEV ? "Development environment" : "Wallpaper environment");
if (DEV) document.body.classList.add("dev");

class AudioColumn extends HTMLElement {
  // @ts-ignore
  children: HTMLCollectionOf<HTMLSpanElement>;

  constructor() {
    super();
    document.body.appendChild(this);
  }
  connectedCallback() {
    this.innerHTML = "";

    for (let i = LEVELS; i > 0; i--) {
      this.appendChild(document.createElement("span"));
    }
  }

  set level(level: number) {
    Array.from(this.children).forEach((e: HTMLSpanElement, i: number) => {
      if (level <= i / LEVELS) e.classList.remove("on");
      else e.classList.add("on");
    });
  }
}
customElements.define("audio-column", AudioColumn);

const audio_columns: AudioColumn[] = [];
for (let i = 0; i < Math.floor(LEVELS / 2); i++) {
  audio_columns.unshift(new AudioColumn());
}
for (let i = 0; i < Math.ceil(LEVELS / 2); i++) {
  audio_columns.push(new AudioColumn());
}

function update(audio_data: number[]) {
  audio_data.forEach((level: number, i: number) => {
    audio_columns[i].level = level * (NORMALIZE / 100);
  });
}

if (DEV) {
  const values: number[] = [];
  let offset: number = LEVELS;
  for (let i = 0; i < 128; i++) {
    values.push(Math.sin(i / 8));
  }
  setInterval(
    (function _() {
      update(values);
      values.unshift(Math.sin(offset / 8));
      offset++;
      values.pop();

      return _;
    })(),
    1e3 / DEV_FPS
  );
} else (window as any).wallpaperRegisterAudioListener(update);

(window as any).wallpaperPropertyListener = {
  applyUserProperties: function (properties: any) {
    document.body.classList.remove("dev");

    if (properties.normalize) NORMALIZE = properties.normalize.value;
  },
};
