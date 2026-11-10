import os
from pathlib import Path
from typing import List

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


class AIRefusalError(Exception):
    pass


class AIServiceUnavailableError(Exception):
    pass


def extract_project_details(notes: str) -> ProjectDetails:
    try:
        completion = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Extract a concise project title, a one- or two-sentence "
                        "summary, and a list of technologies from the user's notes."
                    ),
                },
                {"role": "user", "content": notes},
            ],
            response_format=ProjectDetails,
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
