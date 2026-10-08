const filterInput = document.getElementById('filter-input');
const projectCards = Array.from(document.querySelectorAll('.card'));
const projectCount = document.getElementById('project-count');

function updateProjects() {
  const filterText = filterInput.value.trim().toLowerCase();
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const matches = card.textContent.toLowerCase().includes(filterText);
    card.classList.toggle('hidden', !matches);

    if (matches) {
      visibleCount += 1;
    }
  });

  projectCount.textContent = `Showing ${visibleCount} of ${projectCards.length} projects`;
}

if (filterInput) {
  filterInput.addEventListener('input', updateProjects);
  updateProjects();
}
