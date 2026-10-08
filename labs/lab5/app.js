const filterInput = document.getElementById('filter-input');
const projectCards = Array.from(document.querySelectorAll('.card'));
const projectCount = document.getElementById('project-count');

function updateProjects() {
  const filterText = filterInput.value.trim().toLowerCase();
  const visibleTitles = [];
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const title = card.querySelector('h3')?.textContent.trim() || '';
    const matches = title.toLowerCase().includes(filterText);
    card.classList.toggle('is-hidden', !matches);

    if (matches) {
      visibleCount += 1;
      visibleTitles.push(title);
    }
  });

  projectCount.textContent = `Showing ${visibleCount} of ${projectCards.length} projects`;
  console.log(visibleTitles);
}

if (filterInput) {
  filterInput.addEventListener('input', updateProjects);
  updateProjects();
}
