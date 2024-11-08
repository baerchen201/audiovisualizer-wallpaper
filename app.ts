const DEV = !Object.keys(window).includes("wallpaperGetUtilities");

console.log(DEV ? "Development environment" : "Wallpaper environment");

function update(audio_data: number[]) {
  console.log(audio_data);
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
