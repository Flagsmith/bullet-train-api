import typing
from datetime import datetime

from pydantic import BaseModel


class LicenceInformation(BaseModel):
    organisation_name: str
    plan_id: str

    department_name: typing.Optional[str] = None
    expiry_date: typing.Optional[datetime] = None

    # TODO: should these live in a nested object?
    num_seats: int
    num_projects: int  # TODO: what about Flagsmith on Flagsmith project?
    num_api_calls: typing.Optional[
        int
    ] = None  # required to support private cloud installs
