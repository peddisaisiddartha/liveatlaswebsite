function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

let pageIndex = 0;
const pages = document.querySelectorAll('.page');

function nextPage() {
  pages[pageIndex].classList.remove('active');
  pageIndex = (pageIndex + 1) % pages.length;
  pages[pageIndex].classList.add('active');
}
