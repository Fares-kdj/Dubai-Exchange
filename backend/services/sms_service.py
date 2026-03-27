import os
import httpx
import logging
import json
from typing import Dict, Optional
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent.parent / ".env")

logger = logging.getLogger(__name__)

SMSTO_API_KEY = os.environ.get("SMSTO_API_KEY", "")
SMSTO_SENDER_ID = os.environ.get("SMSTO_SENDER_ID", "DubaiExch")
DEFAULT_WHATSAPP = os.environ.get("COMPANY_WHATSAPP", "+964XXXXXXXXXX")

def is_iraqi_number(phone: str) -> bool:
    if not phone:
        return False
    digits = "".join(filter(str.isdigit, phone))
    if any(digits.startswith(p) for p in ["964", "077", "078", "075", "77", "78", "75"]):
        return True
    return False

def format_phone_number(phone: str) -> str:
    if not phone:
        return ""
    
    digits = "".join(filter(str.isdigit, phone))
    
    if is_iraqi_number(phone):
        if digits.startswith("07"):
            digits = digits[1:]
        elif digits.startswith("9640"):
            digits = digits[4:]
        elif digits.startswith("964"):
            digits = digits[3:]
            
        if len(digits) == 10 and digits.startswith("7"):
            return f"+964{digits}"
    
    if phone.strip().startswith("+"):
        return f"+{digits}"
    if digits.startswith("00"):
        return f"+{digits[2:]}"
        
    return f"+{digits}" if len(digits) > 10 else digits

class SMSService:
    def __init__(self):
        self.api_key = SMSTO_API_KEY
        self.sender_id = SMSTO_SENDER_ID
        self.whatsapp = DEFAULT_WHATSAPP

        self.enabled = bool(self.api_key)

        if not self.enabled:
            logger.warning("⚠️ SMS service is disabled: Missing SMS.to API Key")
        else:
            logger.info("🚀 SMS service ready (SMS.to)")

    def set_whatsapp(self, whatsapp: str):
        """Update WhatsApp number dynamically"""
        if whatsapp:
            self.whatsapp = whatsapp
            logger.info(f"WhatsApp number updated to: {whatsapp}")

    async def sync_whatsapp(self, db):
        """Fetch WhatsApp number from database settings"""
        try:
            contact = await db.settings.find_one({"type": "contact"})
            if contact and "content" in contact:
                content = contact.get("content", {})
                ar_content = content.get("ar", {})
                whatsapp = ar_content.get("whatsapp") or ar_content.get("phone")
                if whatsapp:
                    self.set_whatsapp(whatsapp)
                    return True

            company = await db.settings.find_one({"type": "company"})
            if company:
                whatsapp = company.get("whatsapp") or company.get("phone")
                if whatsapp:
                    self.set_whatsapp(whatsapp)
                    return True
        except Exception as e:
            logger.error(f"Failed to sync WhatsApp number from DB: {e}")
        return False

    async def _send_request(self, payload: Dict) -> Dict:
        """Internal unified request handler for SMS.to"""
        result = {"success": False, "sent": False, "error": None, "response": None}
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                url = "https://api.sms.to/sms/send"
                
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
                
                if self.sender_id:
                    payload["sender_id"] = self.sender_id

                # SMS.to usually requires 'bypass_optout' for transactional SMS
                payload["bypass_optout"] = True

                res = await client.post(url, json=payload, headers=headers)
                data = res.json()
                result["response"] = data

                if res.status_code == 200 and data.get("success"):
                    result.update({
                        "success": True,
                        "sent": True,
                        "message_id": data.get("message_id") or data.get("request_id"),
                        "status": "sent"
                    })
                    logger.info(f"✅ SMS Sent Successfully to {payload.get('to')}")
                else:
                    result["error"] = data.get("message") or "Unknown API Error"
                    logger.error(f"❌ SMS.to Error: {result['error']}")

        except Exception as e:
            result["error"] = str(e)
            logger.error(f"🚨 Connection Error: {str(e)}")

        return result

    async def send_plain_sms(self, phone: str, body: str) -> Dict:
        formatted = format_phone_number(phone)
        payload = {
            "to": formatted,
            "message": body
        }
        return await self._send_request(payload)

    async def send_content_sms(self, phone: str, content_sid: str, variables: Optional[Dict] = None) -> Dict:
        # Fallback to plain text for SMS.to
        body = f"Update received. Support: {self.whatsapp}"
        return await self.send_plain_sms(phone, body)

    async def send_order_submitted(self, phone: str, order_id: str = "", customer_name: str = "عميلنا", whatsapp: Optional[str] = None) -> Dict:
        return await self.send_order_status(phone, order_id, "submitted", customer_name, whatsapp)

    async def send_order_approved(self, phone: str, order_id: str = "", customer_name: str = "عميلنا", whatsapp: Optional[str] = None) -> Dict:
        return await self.send_order_status(phone, order_id, "approved", customer_name, whatsapp)

    async def send_order_rejected(self, phone: str, order_id: str = "", customer_name: str = "عميلنا", whatsapp: Optional[str] = None) -> Dict:
        return await self.send_order_status(phone, order_id, "rejected", customer_name, whatsapp)

    async def send_order_status(self, phone: str, order_id: str, status: str, customer_name: str = "عميلنا", whatsapp: Optional[str] = None) -> Dict:
        support = whatsapp or self.whatsapp
        messages = {
            "submitted": (
                f"عميلنا العزيز\n"
                f"{customer_name}\n"
                f"رقم طلبكم {order_id}\n"
                f"تم استلام طلبكم و هو قيد المراجعة يرجى اكمال الايداع خلال فترة زمنية محددة اقصاها ساعتين لتجنب الغاء الطلب\n"
                f"للاستفسار {support}"
            ),
            "approved": f"تم قبول طلبكم {order_id}. لاكمال الاجراءات يرجى التواصل مع خدمة العملاء {support}",
            "rejected": f"نعتذر , تم رفض طلبكم {order_id}.\nللمزيد من التفاصيل يرجى التواصل مع خدمة العملاء {support}"
        }
        body = messages.get(status, f"تحديث للطلب {order_id}. للتواصل: {support}")
        return await self.send_plain_sms(phone, body)

sms_service = SMSService()

def reinitialize_sms_service():
    global sms_service
    sms_service = SMSService()
    return sms_service