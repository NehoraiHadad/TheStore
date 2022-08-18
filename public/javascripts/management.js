const left = document.getElementsByClassName("left-main")[0];
const right = document.getElementsByClassName("right-main")[0];
const container = document.getElementsByTagName("main")[0];


left.addEventListener("mouseenter", () => {
  container.classList.add("hover-left");
});

left.addEventListener("mouseleave", () => {
  container.classList.remove("hover-left");
});

right.addEventListener("mouseenter", () => {
  container.classList.add("hover-right");
});

right.addEventListener("mouseleave", () => {
  container.classList.remove("hover-right");
});
