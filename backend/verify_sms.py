import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add parent directory to path to import services
sys.path.append(str(Path(__file__).parent))

from services.sms_service import sms_service

async def verify_all_sms(phone: str):
    """اختبار الرسائل الثلاث على الرقم المعطى باستخدام SMS.to"""

    print("=" * 55)
    print(f"🧪 اختبار SMS على الرقم (SMS.to): {phone}")
    print("=" * 55)

    if not sms_service.enabled:
        print("❌ خطأ: SMS Service غير مفعّل. تأكد من وجود SMSTO_API_KEY في .env")
        return

    print(f"  Sender ID    : {sms_service.sender_id}")
    print(f"  WhatsApp     : {sms_service.whatsapp}")
    print()

    try:
        # اختبار 1: رسالة الحجز (Order Submitted)
        print("📩 رسالة 1 — طلب جديد (حجز):")
        res1 = await sms_service.send_order_submitted(phone, "TEST-123")
        if res1["success"]:
            print(f"  ✅ Order Submitted => نجح!")
        else:
            print(f"  ❌ Order Submitted => فشل! {res1.get('error')}")

        # اختبار 2: رسالة القبول (Order Approved)
        print("\n📩 رسالة 2 — طلب مقبول (قبول):")
        res2 = await sms_service.send_order_approved(phone, "TEST-123")
        if res2["success"]:
            print(f"  ✅ Order Approved => نجح!")
        else:
            print(f"  ❌ Order Approved => فشل! {res2.get('error')}")

        # اختبار 3: رسالة الرفض (Order Rejected)
        print("\n📩 رسالة 3 — طلب مرفوض (رفض):")
        res3 = await sms_service.send_order_rejected(phone, "TEST-123")
        if res3["success"]:
            print(f"  ✅ Order Rejected => نجح!")
        else:
            print(f"  ❌ Order Rejected => فشل! {res3.get('error')}")

        # اختبار 4: رسالة نصية بسيطة (للتحقق من الاتصال الأساسي)
        print("\n📩 رسالة 4 — نص حر مباشر:")
        res4 = await sms_service.send_plain_sms(phone, "Test direct plain text from Dubai Exchange via SMS.to.")
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
    target = "+213784279410"
    if len(sys.argv) > 1:
        target = sys.argv[1]

    asyncio.run(verify_all_sms(target))
