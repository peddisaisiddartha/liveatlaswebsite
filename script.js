// Additional interactivity, like smooth scrolling and animations
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll to sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Parallax effect (basic)
    window.addEventListener('scroll', () => {
        const scroll = window.pageYOffset;
        document.querySelectorAll('.layer').forEach(layer => {
            layer.style.transform = `translateY(${scroll * 0.5}px)`;
        });
    });
});
