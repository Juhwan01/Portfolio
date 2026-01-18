from fastapi import APIRouter, HTTPException
import httpx
from ...core.config import settings

router = APIRouter()

NOTION_API_BASE = "https://api.notion.com/v1"
NOTION_VERSION = "2022-06-28"


def get_headers():
    if not settings.NOTION_TOKEN:
        raise HTTPException(status_code=500, detail="Notion token not configured")
    return {
        "Authorization": f"Bearer {settings.NOTION_TOKEN}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    }


async def fetch_blocks_recursive(client: httpx.AsyncClient, block_id: str, headers: dict) -> list:
    """Recursively fetch all blocks including children"""
    blocks = []
    cursor = None

    while True:
        url = f"{NOTION_API_BASE}/blocks/{block_id}/children?page_size=100"
        if cursor:
            url += f"&start_cursor={cursor}"

        response = await client.get(url, headers=headers, timeout=30.0)

        if response.status_code != 200:
            break

        data = response.json()
        results = data.get("results", [])

        for block in results:
            # If block has children, fetch them recursively
            if block.get("has_children"):
                children = await fetch_blocks_recursive(client, block["id"], headers)
                block["children"] = children
            blocks.append(block)

        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor")

    return blocks


@router.get("/page/{page_id}")
async def get_notion_page(page_id: str):
    """Get Notion page with all blocks using official API"""
    headers = get_headers()

    # Format page_id (add hyphens if needed)
    if len(page_id) == 32 and "-" not in page_id:
        page_id = f"{page_id[:8]}-{page_id[8:12]}-{page_id[12:16]}-{page_id[16:20]}-{page_id[20:]}"

    async with httpx.AsyncClient() as client:
        # Fetch page info
        page_response = await client.get(
            f"{NOTION_API_BASE}/pages/{page_id}",
            headers=headers,
            timeout=30.0,
        )

        if page_response.status_code != 200:
            error_data = page_response.json()
            raise HTTPException(
                status_code=page_response.status_code,
                detail=error_data.get("message", "Failed to fetch Notion page")
            )

        page = page_response.json()

        # Fetch all blocks recursively
        blocks = await fetch_blocks_recursive(client, page_id, headers)

        return {
            "page": page,
            "blocks": blocks,
        }


@router.get("/blocks/{page_id}")
async def get_notion_blocks(page_id: str):
    """Get Notion page blocks (alias for /page endpoint)"""
    return await get_notion_page(page_id)
