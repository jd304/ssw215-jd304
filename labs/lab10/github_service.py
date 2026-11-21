import os
from pathlib import Path
from urllib.parse import quote

import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).with_name(".env"))

GITHUB_API_URL = "https://api.github.com"
README_MAX_LENGTH = 4000


class GitHubRepositoryNotFoundError(Exception):
    pass


class GitHubServiceUnavailableError(Exception):
    pass


def fetch_repository_readme(owner, repo):
    url = "{}/repos/{}/{}/readme".format(
        GITHUB_API_URL,
        quote(owner, safe=""),
        quote(repo, safe=""),
    )
    headers = {"Accept": "application/vnd.github.raw"}
    token = os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = "Bearer {}".format(token)

    try:
        response = requests.get(url, headers=headers, timeout=10)
    except requests.RequestException as error:
        raise GitHubServiceUnavailableError from error

    if response.status_code == 404:
        raise GitHubRepositoryNotFoundError
    if response.status_code >= 500 or response.status_code >= 400:
        raise GitHubServiceUnavailableError

    return response.text[:README_MAX_LENGTH]
