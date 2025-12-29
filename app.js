window.addEventListener("scroll", () => {
  document.querySelectorAll(".scene").forEach(scene => {
    const speed = 0.3;
    scene.style.backgroundPositionY = `${window.scrollY * speed}px`;
  });
});
