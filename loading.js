
const $loading = document.querySelector("#loading");
const $app = document.querySelector("#app");
document.fonts.onloadingdone = () => {
    $loading.style.display = "none";
    $app.style.display = "";
};