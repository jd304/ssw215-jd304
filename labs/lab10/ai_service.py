import os
from pathlib import Path
from typing import Dict, List, Literal, Type, TypeVar, TypedDict
import uuid

from dotenv import load_dotenv
from openai import (
    APIConnectionError,
    APIStatusError,
    APITimeoutError,
    OpenAI,
)
from pydantic import BaseModel, Field

load_dotenv(Path(__file__).with_name(".env"))
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class ProjectDetails(BaseModel):
    title: str = Field(description="A concise project title, no more than 120 characters")
    summary: str = Field(description="A one- or two-sentence project summary")
    technologies: List[str] = Field(description="The technologies used in the project")


class GitHubProjectDraft(BaseModel):
    title: str = Field(description="A concise project title, no more than 120 characters")
    summary: str = Field(description="A one- or two-sentence project summary")
    technologies: List[str] = Field(description="The technologies used in the project")
    difficulty: Literal["Beginner", "Intermediate", "Advanced"]


class AIRefusalError(Exception):
    pass


class AIServiceUnavailableError(Exception):
    pass


class DraftSessionNotFoundError(Exception):
    pass


class DraftSession(TypedDict):
    draft: GitHubProjectDraft
    messages: List[Dict[str, str]]


project_draft_sessions: Dict[str, DraftSession] = {}
ModelT = TypeVar("ModelT", bound=BaseModel)


def _request_structured_response(
    messages: List[Dict[str, str]], response_format: Type[ModelT]
) -> ModelT:
    try:
        completion = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=messages,
            response_format=response_format,
            temperature=0.1,
        )
    except (APIConnectionError, APITimeoutError) as error:
        raise AIServiceUnavailableError from error
    except APIStatusError as error:
        if error.status_code >= 500:
            raise AIServiceUnavailableError from error 
        raise

    message = completion.choices[0].message
    if message.refusal:
        raise AIRefusalError
    if message.parsed is None:
        raise AIServiceUnavailableError
    return message.parsed


def extract_project_details(notes: str) -> ProjectDetails:
    return _request_structured_response(
        [
            {
                "role": "system",
                "content": (
                    "Extract a concise project title, a one- or two-sentence "
                    "summary, and a list of technologies from the user's notes."
                ),
            },
            {"role": "user", "content": notes},
        ],
        ProjectDetails,
    )


def start_project_draft(project_material: str):
    messages = [
        {
            "role": "system",
            "content": (
                "Create a concise project draft from the provided project material. "
                "Write a one- or two-sentence summary, list the technologies, and "
                "select exactly one difficulty: Beginner, Intermediate, or Advanced."
            ),
        },
        {"role": "user", "content": project_material},
    ]
    draft = _request_structured_response(messages, GitHubProjectDraft)
    messages.append({"role": "assistant", "content": draft.model_dump_json()})
    session_id = str(uuid.uuid4())
    project_draft_sessions[session_id] = {"draft": draft, "messages": messages}
    return session_id, draft.model_dump()


def refine_project_draft(session_id: str, feedback: str):
    session = project_draft_sessions.get(session_id)
    if session is None:
        raise DraftSessionNotFoundError

    messages = list(session["messages"])
    messages.append({"role": "user", "content": feedback})
    draft = _request_structured_response(messages, GitHubProjectDraft)
    messages.append({"role": "assistant", "content": draft.model_dump_json()})
    session["messages"] = messages
    session["draft"] = draft
    return draft.model_dump()

 
def get_project_draft(session_id: str):
    session = project_draft_sessions.get(session_id)
    if session is None:
        raise DraftSessionNotFoundError
    return session["draft"].model_dump()


def discard_project_draft(session_id: str):
    if session_id not in project_draft_sessions:
        raise DraftSessionNotFoundError
    del project_draft_sessions[session_id]
