from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...models.contact import ContactMessage
from ...schemas.contact import ContactFormCreate, ContactFormInDB

router = APIRouter()


@router.post("/", response_model=ContactFormInDB)
def submit_contact_form(
    form: ContactFormCreate,
    db: Session = Depends(get_db)
):
    """Submit a contact form"""
    db_message = ContactMessage(**form.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    # TODO: Send email notification
    # send_email_notification(form)

    return db_message


@router.get("/")
def get_contact_messages(db: Session = Depends(get_db)):
    """Get all contact messages (admin only)"""
    messages = db.query(ContactMessage).order_by(
        ContactMessage.created_at.desc()
    ).all()
    return messages
