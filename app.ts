const DEV = !Object.keys(window).includes("wallpaperGetUtilities");

console.log(DEV ? "Development environment" : "Wallpaper environment");
