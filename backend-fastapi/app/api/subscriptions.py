import hashlib
import hmac
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, Subscription, Payment
from app.schemas.schemas import SubscriptionCreate, PaymentVerify

router = APIRouter(prefix="/api/subscriptions", tags=["subscriptions"])

PLAN_CONFIG = {
    "pro": {"amount": 49900, "label": "Pro", "days": 30},
    "enterprise": {"amount": 99900, "label": "Enterprise", "days": 30},
}


@router.post("/create")
def create_order(
    payload: SubscriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    plan = payload.plan.lower()
    if plan not in PLAN_CONFIG:
        raise HTTPException(status_code=400, detail="Invalid plan. Choose 'pro' or 'enterprise'.")

    config = PLAN_CONFIG[plan]

    # Create payment record
    payment = Payment(
        user_id=current_user.id,
        amount=config["amount"] / 100,
        status="pending",
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    try:
        import razorpay
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        order = client.order.create({
            "amount": config["amount"],
            "currency": "INR",
            "receipt": f"spire_{payment.id}",
        })
        payment.razorpay_order_id = order["id"]
        db.commit()

        return {
            "success": True,
            "order_id": order["id"],
            "amount": config["amount"],
            "currency": "INR",
            "plan": plan,
            "key_id": settings.RAZORPAY_KEY_ID,
        }
    except Exception:
        # Demo mode when Razorpay isn't configured
        demo_order_id = f"order_demo_{payment.id}"
        payment.razorpay_order_id = demo_order_id
        db.commit()

        return {
            "success": True,
            "order_id": demo_order_id,
            "amount": config["amount"],
            "currency": "INR",
            "plan": plan,
            "key_id": settings.RAZORPAY_KEY_ID,
            "demo": True,
        }


@router.post("/verify")
def verify_payment(
    payload: PaymentVerify,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Find the payment by order_id
    payment = db.query(Payment).filter(Payment.razorpay_order_id == payload.razorpay_order_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    # Verify HMAC-SHA256 signature (skip in demo mode)
    is_demo = payload.razorpay_order_id.startswith("order_demo_")
    if not is_demo:
        message = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}"
        expected = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            message.encode(),
            hashlib.sha256,
        ).hexdigest()
        if expected != payload.razorpay_signature:
            payment.status = "failed"
            db.commit()
            raise HTTPException(status_code=400, detail="Invalid payment signature")

    # Update payment
    payment.razorpay_payment_id = payload.razorpay_payment_id
    payment.razorpay_signature = payload.razorpay_signature
    payment.status = "completed"
    db.commit()

    # Determine plan from amount
    plan = "pro"
    if payment.amount >= 999:
        plan = "enterprise"

    # Create subscription
    now = datetime.now(timezone.utc)
    subscription = Subscription(
        user_id=current_user.id,
        plan=plan,
        status="active",
        payment_id=payload.razorpay_payment_id or payload.razorpay_order_id,
        expires_at=now + timedelta(days=30),
    )
    db.add(subscription)
    db.commit()
    db.refresh(subscription)

    return {
        "success": True,
        "message": "Payment verified and subscription activated",
        "subscription": {
            "id": subscription.id,
            "plan": subscription.plan,
            "status": subscription.status,
            "expires_at": str(subscription.expires_at),
        },
    }


@router.get("/status")
def get_subscription_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    subscription = (
        db.query(Subscription)
        .filter(Subscription.user_id == current_user.id, Subscription.status == "active")
        .order_by(Subscription.created_at.desc())
        .first()
    )
    if not subscription:
        return {"success": True, "active": False, "plan": "free", "subscription": None}

    # Check if expired
    if subscription.expires_at and subscription.expires_at < datetime.utcnow():
        subscription.status = "expired"
        db.commit()
        return {"success": True, "active": False, "plan": "free", "subscription": None}

    return {
        "success": True,
        "active": True,
        "plan": subscription.plan,
        "subscription": {
            "id": subscription.id,
            "plan": subscription.plan,
            "status": subscription.status,
            "expires_at": str(subscription.expires_at),
        },
    }
