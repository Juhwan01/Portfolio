import boto3
from botocore.exceptions import ClientError
from fastapi import UploadFile
from ..core.config import settings


s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION
)


async def upload_file_to_s3(file: UploadFile, filename: str) -> str:
    """
    Upload a file to S3 and return the file URL
    """
    try:
        # Read file content
        file_content = await file.read()

        # Upload to S3
        s3_client.put_object(
            Bucket=settings.S3_BUCKET_NAME,
            Key=filename,
            Body=file_content,
            ContentType=file.content_type,
            ACL='public-read'  # Make file publicly accessible
        )

        # Generate file URL
        file_url = f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{filename}"
        return file_url

    except ClientError as e:
        raise Exception(f"Failed to upload file to S3: {str(e)}")


def delete_file_from_s3(filename: str) -> bool:
    """
    Delete a file from S3
    """
    try:
        s3_client.delete_object(
            Bucket=settings.S3_BUCKET_NAME,
            Key=filename
        )
        return True
    except ClientError as e:
        raise Exception(f"Failed to delete file from S3: {str(e)}")


def get_presigned_url(filename: str, expiration: int = 3600) -> str:
    """
    Generate a presigned URL for temporary access to a private S3 object
    """
    try:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': settings.S3_BUCKET_NAME,
                'Key': filename
            },
            ExpiresIn=expiration
        )
        return url
    except ClientError as e:
        raise Exception(f"Failed to generate presigned URL: {str(e)}")
