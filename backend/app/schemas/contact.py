from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class ContactFormBase(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class ContactFormCreate(ContactFormBase):
    pass


class ContactFormInDB(ContactFormBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
