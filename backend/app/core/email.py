import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from .config import settings


def send_contact_notification(name: str, email: str, subject: str, message: str) -> bool:
    """Send email notification when someone submits a contact form"""
    if not all([settings.SMTP_HOST, settings.SMTP_USER, settings.SMTP_PASSWORD, settings.EMAIL_FROM]):
        print("Email settings not configured")
        return False

    try:
        msg = MIMEMultipart()
        msg['From'] = settings.EMAIL_FROM
        msg['To'] = settings.EMAIL_FROM
        msg['Subject'] = f"[Portfolio Contact] {subject}"

        body = f"""
새로운 문의가 접수되었습니다.

이름: {name}
이메일: {email}
제목: {subject}

메시지:
{message}
"""
        msg.attach(MIMEText(body, 'plain', 'utf-8'))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)

        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
