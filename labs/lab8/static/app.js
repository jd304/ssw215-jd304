const filterInput = document.getElementById('filter-input');
const projectGrid = document.querySelector('.project-grid');
const projectCount = document.getElementById('project-count');
const newTitleInput = document.getElementById('new-title');
const addProjectButton = document.getElementById('add-project');

function updateProjects() {
  const filterText = filterInput.value.trim().toLowerCase();
  const projectCards = Array.from(document.querySelectorAll('.card'));
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

function createProjectCard(project) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.projectId = project.id;

  const title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = project.title;
  card.append(title);

  const description = document.createElement('p');
  description.className = 'card-description';
  description.textContent = project.description;
  card.append(description);

  if (project.likes > 10) {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = 'Trending';
    card.append(badge);
  }

  const likes = document.createElement('p');
  likes.className = 'card-likes';
  likes.append('Likes: ');
  const likeCount = document.createElement('span');
  likeCount.className = 'like-count';
  likeCount.textContent = project.likes;
  likes.append(likeCount);
  card.append(likes);

  const upvoteButton = document.createElement('button');
  upvoteButton.className = 'upvote-btn';
  upvoteButton.type = 'button';
  upvoteButton.textContent = 'Upvote';
  card.append(upvoteButton);

  return card;
}

if (filterInput) {
  filterInput.addEventListener('input', updateProjects);
  updateProjects();
}

if (projectGrid) {
  projectGrid.addEventListener('click', async (event) => {
    const upvoteButton = event.target.closest('.upvote-btn');
    if (!upvoteButton || !projectGrid.contains(upvoteButton)) {
      return;
    }

    const card = upvoteButton.closest('.card');
    const likeCount = card.querySelector('.like-count');
    upvoteButton.disabled = true;

    try {
      const response = await fetch(`/api/projects/${card.dataset.projectId}/upvote`, {
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
}

if (addProjectButton && newTitleInput && projectGrid) {
  addProjectButton.addEventListener('click', async () => {
    addProjectButton.disabled = true;

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitleInput.value }),
      });
      if (!response.ok) {
        throw new Error(`Create project failed with status ${response.status}`);
      }

      const project = await response.json();
      projectGrid.append(createProjectCard(project));
      newTitleInput.value = '';
      updateProjects();
    } catch (error) {
      console.error('Unable to create project:', error);
    } finally {
      addProjectButton.disabled = false;
    }
  });
}
