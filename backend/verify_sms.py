import asyncio
import os
import sys
import httpx
from pathlib import Path
from dotenv import load_dotenv

# Add parent directory to path to import services
sys.path.append(str(Path(__file__).parent))

from services.sms_service import sms_service, TWILIO_CONTENT_ORDER_SUBMITTED

async def verify_twilio(phone: str):
    print(f"--- Twilio Verification Start ---")
    print(f"Target Phone: {phone}")
    
    if not sms_service.enabled:
        print("Error: SMS Service is not enabled. Check credentials in .env")
        return

    print("--- Test 1: Content SID (Template) ---")
    print(f"Content SID: {TWILIO_CONTENT_ORDER_SUBMITTED}")
    
    import services.sms_service
    original_check = services.sms_service.is_iraqi_number
    services.sms_service.is_iraqi_number = lambda x: True
    
    try:
        result = await sms_service.send_content_sms(phone, TWILIO_CONTENT_ORDER_SUBMITTED)
        if result["success"]:
            print(f"✅ Template Success! SID: {result.get('message_sid')}")
        else:
            print(f"❌ Template Failed: {result.get('error')}")

        print("\n--- Test 2: Plain Text Body ---")
        async with httpx.AsyncClient(timeout=30.0) as client:
            url = f"https://api.twilio.com/2010-04-01/Accounts/{sms_service.account_sid}/Messages.json"
            payload = {
                "To": phone,
                "MessagingServiceSid": sms_service.messaging_service_sid,
                "Body": "Test message from Dubai Exchange. If you see this, SMS is working."
            }
            response = await client.post(
                url, data=payload, auth=(sms_service.account_sid, sms_service.auth_token)
            )
            data = response.json()
            if response.status_code in [200, 201]:
                print(f"✅ Plain Text Success! SID: {data.get('sid')}")
            else:
                print(f"❌ Plain Text Failed: {data.get('message')}")
                if data.get('code') == 21608:
                    print("⚠️ NOTE: Error 21608 means the number is unverified in a Twilio Trial Account.")
            
    finally:
        services.sms_service.is_iraqi_number = original_check

    print("--- Verification End ---")

if __name__ == "__main__":
    target = "+213784279410"
    if len(sys.argv) > 1:
        target = sys.argv[1]
    
    asyncio.run(verify_twilio(target))
