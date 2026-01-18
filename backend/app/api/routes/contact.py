from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...core.email import send_contact_notification
from ...models.contact import ContactMessage
from ...schemas.contact import ContactFormCreate, ContactFormInDB

router = APIRouter()


@router.post("/", response_model=ContactFormInDB)
def submit_contact_form(
    form: ContactFormCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Submit a contact form"""
    db_message = ContactMessage(**form.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    background_tasks.add_task(
        send_contact_notification,
        form.name,
        form.email,
        form.subject,
        form.message
    )

    return db_message


@router.get("/")
def get_contact_messages(db: Session = Depends(get_db)):
    """Get all contact messages (admin only)"""
    messages = db.query(ContactMessage).order_by(
        ContactMessage.created_at.desc()
    ).all()
    return messages
