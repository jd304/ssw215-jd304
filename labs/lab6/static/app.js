const filterInput = document.getElementById('filter-input');
const projectCards = Array.from(document.querySelectorAll('.card'));
const projectCount = document.getElementById('project-count');

function updateProjects() {
  const filterText = filterInput.value.trim().toLowerCase();
  const visibleTitles = [];
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const title = card.querySelector('h3')?.textContent.trim() || '';
    const matches = card.textContent.toLowerCase().includes(filterText);
    card.classList.toggle('hidden', !matches);

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

projectCards.forEach((card) => {
  const upvoteButton = card.querySelector('.upvote-btn');
  const likeCount = card.querySelector('.like-count');

  if (!upvoteButton || !likeCount) {
    return;
  }

  upvoteButton.addEventListener('click', async () => {
    const projectId = card.dataset.projectId;
    upvoteButton.disabled = true;

    try {
      const response = await fetch(`/api/projects/${projectId}/upvote`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Upvote failed with status ${response.status}`);
      }

      const result = await response.json();
      likeCount.textContent = result.likes;
    } catch (error) {
      console.error('Unable to upvote project:', error);
    } finally {
      upvoteButton.disabled = false;
    }
  });
});
