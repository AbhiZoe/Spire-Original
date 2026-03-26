from fastapi import APIRouter, Request

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])


@router.post("/razorpay")
async def razorpay_webhook(request: Request):
    body = await request.json()
    print(f"[Razorpay Webhook] Received: {body.get('event', 'unknown')}")
    return {"status": "ok"}
