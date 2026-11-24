from unittest.mock import MagicMock, patch

import github_service


def test_fetch_repository_readme_truncates_to_4000_characters():
    response = MagicMock(status_code=200, text="x" * 5001)

    with patch("github_service.requests.get", return_value=response):
        readme = github_service.fetch_repository_readme("owner", "repo")

    assert len(readme) == 4000