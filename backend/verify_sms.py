import asyncio
import os
import sys
import httpx
import json
from pathlib import Path
from dotenv import load_dotenv

# Add parent directory to path to import services
sys.path.append(str(Path(__file__).parent))

from services.sms_service import (
    sms_service,
    TWILIO_CONTENT_ORDER_SUBMITTED,
    TWILIO_CONTENT_ORDER_APPROVED,
    TWILIO_CONTENT_ORDER_REJECTED,
)
import services.sms_service as sms_module


async def send_test_sms(phone: str, content_sid: str, label: str):
    """Send a single test SMS and print the result"""
    url = f"https://api.twilio.com/2010-04-01/Accounts/{sms_service.account_sid}/Messages.json"

    # Build the payload with ContentSid
    payload = {
        "To": phone,
        "MessagingServiceSid": sms_service.messaging_service_sid,
        "ContentSid": content_sid,
        "ContentVariables": json.dumps({
            "order_number": "TEST-123",
            "support_phone": sms_service.whatsapp
        }),
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            url, data=payload, auth=(sms_service.account_sid, sms_service.auth_token)
        )
        data = response.json()

    if response.status_code in [200, 201]:
        print(f"  ✅ {label} => نجح! SID: {data.get('sid')}")
    else:
        code = data.get("code")
        msg = data.get("message")
        print(f"  ❌ {label} => فشل! (code={code}) {msg}")
        if code == 21608:
            print("     ⚠️  الرقم غير مُتحقق منه في حساب Twilio التجريبي (Trial).")
        elif code == 21703:
            print("     ⚠️  رقم المُرسِل (Sender) غير مدعوم لهذا البلد.")
        elif code == 21211:
            print("     ⚠️  رقم المستقبِل غير صحيح أو غير مدعوم.")
    return response.status_code, data


async def verify_all_sms(phone: str):
    """اختبار الرسائل الثلاث على الرقم المعطى بتجاوز فحص الرقم العراقي"""

    print("=" * 55)
    print(f"🧪 اختبار SMS على الرقم: {phone}")
    print("=" * 55)

    if not sms_service.enabled:
        print("❌ خطأ: SMS Service غير مفعّل. تحقق من .env")
        return

    print(f"  Account SID : {sms_service.account_sid}")
    print(f"  Messaging SID: {sms_service.messaging_service_sid}")
    print(f"  WhatsApp     : {sms_service.whatsapp}")
    print()

    try:
        # اختبار 1: رسالة الحجز (Order Submitted)
        print("📩 رسالة 1 — طلب جديد (حجز):")
        res1 = await sms_service.send_order_submitted(phone, "TEST-123")
        if res1["success"]:
            print(f"  ✅ Order Submitted => نجح! {'(Plain Text Fallback)' if not res1.get('content_sid') else '(Content SID)'}")
        else:
            print(f"  ❌ Order Submitted => فشل! {res1.get('error')}")

        # اختبار 2: رسالة القبول (Order Approved)
        print("\n📩 رسالة 2 — طلب مقبول (قبول):")
        res2 = await sms_service.send_order_approved(phone, "TEST-123")
        if res2["success"]:
            print(f"  ✅ Order Approved => نجح! {'(Plain Text Fallback)' if not res2.get('content_sid') else '(Content SID)'}")
        else:
            print(f"  ❌ Order Approved => فشل! {res2.get('error')}")

        # اختبار 3: رسالة الرفض (Order Rejected)
        print("\n📩 رسالة 3 — طلب مرفوض (رفض):")
        res3 = await sms_service.send_order_rejected(phone, "TEST-123")
        if res3["success"]:
            print(f"  ✅ Order Rejected => نجح! {'(Plain Text Fallback)' if not res3.get('content_sid') else '(Content SID)'}")
        else:
            print(f"  ❌ Order Rejected => فشل! {res3.get('error')}")

        # اختبار 4: رسالة نصية بسيطة (للتحقق من الاتصال الأساسي)
        print("\n📩 رسالة 4 — نص حر مباشر:")
        res4 = await sms_service.send_plain_sms(phone, "Test direct plain text from Dubai Exchange.")
        if res4["success"]:
            print(f"  ✅ نص حر => نجح!")
        else:
            print(f"  ❌ نص حر => فشل! {res4.get('error')}")

    finally:
        pass

    print("\n" + "=" * 55)
    print("انتهى الاختبار.")
    print("=" * 55)


if __name__ == "__main__":
    # رقمك الجزائري افتراضياً — يمكن تغييره من المعطيات
    target = "+213784279410"
    if len(sys.argv) > 1:
        target = sys.argv[1]

    asyncio.run(verify_all_sms(target))
