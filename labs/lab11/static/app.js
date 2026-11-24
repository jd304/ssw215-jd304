const filterInput = document.getElementById('filter-input');
const projectGrid = document.querySelector('.project-grid');
const projectCount = document.getElementById('project-count');
const newTitleInput = document.getElementById('new-title');
const addProjectButton = document.getElementById('add-project');
const smartNotesInput = document.getElementById('smart-notes');
const smartCreateButton = document.getElementById('smart-create');
const githubImportForm = document.getElementById('github-import-form');
const repoOwnerInput = document.getElementById('repo-owner');
const repoNameInput = document.getElementById('repo-name');
const githubImportStatus = document.getElementById('github-import-status');
const draftPanel = document.getElementById('draft-panel');
const draftFeedbackForm = document.getElementById('github-refine-form');
const draftFeedbackInput = document.getElementById('draft-feedback');
const draftStatus = document.getElementById('draft-status');
const blindRefineButton = document.getElementById('refine-without-history');
const approveDraftButton = document.getElementById('approve-draft');
let draftSessionId = null;

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
  description.textContent = project.summary || project.description;
  card.append(description);

  if (project.technologies) {
    const technologies = document.createElement('p');
    technologies.className = 'card-technologies';
    technologies.textContent = `Technologies: ${project.technologies}`;
    card.append(technologies);
  }

  if (project.difficulty) {
    const difficulty = document.createElement('p');
    difficulty.className = 'card-difficulty';
    difficulty.textContent = `Difficulty: ${project.difficulty}`;
    card.append(difficulty);
  }

  const author = document.createElement('p');
  author.className = 'card-author';
  author.append('Author: ');
  const authorName = document.createElement('span');
  authorName.className = 'author-name';
  authorName.textContent = project.author_name;
  author.append(authorName);
  card.append(author);

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

function showProjectDraft(draft) {
  document.getElementById('draft-title').textContent = draft.title;
  document.getElementById('draft-summary').textContent = draft.summary;
  document.getElementById('draft-technologies').textContent = draft.technologies.join(', ');
  document.getElementById('draft-difficulty').textContent = draft.difficulty;
  draftPanel.classList.remove('is-hidden');
}

if (filterInput) {
  filterInput.addEventListener('input', updateProjects);
  updateProjects();
}

if (githubImportForm && repoOwnerInput && repoNameInput && projectGrid) {
  githubImportForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fetchButton = document.getElementById('fetch-draft');
    fetchButton.disabled = true;
    githubImportStatus.textContent = '';
    draftSessionId = null;
    draftPanel.classList.add('is-hidden');

    try {
      const response = await fetch('/api/projects/git-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner: repoOwnerInput.value,
          repo: repoNameInput.value,
        }),
      });
      if (!response.ok) {
        throw new Error(`Fetch draft failed with status ${response.status}`);
      }

      const result = await response.json();
      draftSessionId = result.session_id;
      showProjectDraft(result.draft);
      draftStatus.textContent = '';
    } catch (error) {
      githubImportStatus.textContent = error.message;
      console.error('Unable to fetch GitHub project draft:', error);
    } finally {
      fetchButton.disabled = false;
    }
  });
}

if (draftFeedbackForm && draftFeedbackInput && draftPanel) {
  draftFeedbackForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!draftSessionId) {
      return;
    }

    const sendFeedbackButton = document.getElementById('send-feedback');
    sendFeedbackButton.disabled = true;
    draftStatus.textContent = '';

    try {
      const response = await fetch('/api/projects/git-refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: draftSessionId,
          feedback: draftFeedbackInput.value,
        }),
      });
      if (!response.ok) {
        throw new Error(`Send feedback failed with status ${response.status}`);
      }

      showProjectDraft(await response.json());
      draftFeedbackInput.value = '';
    } catch (error) {
      draftStatus.textContent = error.message;
      console.error('Unable to refine GitHub project draft:', error);
    } finally {
      sendFeedbackButton.disabled = false;
    }
  });
}

if (blindRefineButton && draftFeedbackInput && draftPanel) {
  blindRefineButton.addEventListener('click', async () => {
    if (!draftSessionId) {
      return;
    }

    blindRefineButton.disabled = true;
    draftStatus.textContent = '';

    try {
      const response = await fetch('/api/projects/git-refine-blind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: draftSessionId,
          feedback: draftFeedbackInput.value,
        }),
      });
      if (!response.ok) {
        throw new Error(`Refine without history failed with status ${response.status}`);
      }

      showProjectDraft(await response.json());
    } catch (error) {
      draftStatus.textContent = error.message;
      console.error('Unable to refine GitHub project draft without history:', error);
    } finally {
      blindRefineButton.disabled = false;
    }
  });
}

if (approveDraftButton && draftPanel && projectGrid) {
  approveDraftButton.addEventListener('click', async () => {
    if (!draftSessionId) {
      return;
    }

    approveDraftButton.disabled = true;
    draftStatus.textContent = '';

    try {
      const response = await fetch('/api/projects/git-commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: draftSessionId }),
      });
      if (!response.ok) {
        throw new Error(`Approve draft failed with status ${response.status}`);
      }

      const project = await response.json();
      projectGrid.append(createProjectCard(project));
      draftSessionId = null;
      draftPanel.classList.add('is-hidden');
      repoOwnerInput.value = '';
      repoNameInput.value = '';
      updateProjects();
    } catch (error) {
      draftStatus.textContent = error.message;
      console.error('Unable to approve GitHub project draft:', error);
    } finally {
      approveDraftButton.disabled = false;
    }
  });
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

if (smartCreateButton && smartNotesInput && projectGrid) {
  smartCreateButton.addEventListener('click', async () => {
    smartCreateButton.disabled = true;

    try {
      const response = await fetch('/api/projects/smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: smartNotesInput.value }),
      });
      if (!response.ok) {
        throw new Error(`Smart create failed with status ${response.status}`);
      }

      const project = await response.json();
      projectGrid.append(createProjectCard(project));
      smartNotesInput.value = '';
      updateProjects();
    } catch (error) {
      console.error('Unable to smart-create project:', error);
    } finally {
      smartCreateButton.disabled = false;
    }
  });
}
