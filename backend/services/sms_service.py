"""
UniMTX SMS Service for Dubai International Exchange
Sends SMS notifications to Iraqi phone numbers only
"""
import os
import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# UniMTX API Configuration
UNIMTX_API_URL = "https://api.unimtx.com"
UNIMTX_ACCESS_KEY = os.environ.get("UNIMTX_ACCESS_KEY", "")

# Iraqi phone number prefixes (country code +964)
IRAQI_PREFIXES = ["+964", "00964", "964"]


def is_iraqi_number(phone: str) -> bool:
    """Check if phone number is Iraqi"""
    if not phone:
        return False
    
    # Clean the phone number
    cleaned = phone.replace(" ", "").replace("-", "")
    
    # Check for Iraqi prefixes
    for prefix in IRAQI_PREFIXES:
        if cleaned.startswith(prefix):
            return True
    
    # Check if it starts with 07 (Iraqi mobile format without country code)
    if cleaned.startswith("07") and len(cleaned) >= 10:
        return True
    
    return False


def format_iraqi_number(phone: str) -> str:
    """Format phone number to E.164 format for Iraqi numbers"""
    if not phone:
        return ""
    
    # Clean the phone number
    cleaned = phone.replace(" ", "").replace("-", "").replace("(", "").replace(")", "")
    
    # If starts with 07, add +964
    if cleaned.startswith("07"):
        return f"+964{cleaned[1:]}"  # Remove leading 0 and add +964
    
    # If starts with 964 (without +), add +
    if cleaned.startswith("964") and not cleaned.startswith("+"):
        return f"+{cleaned}"
    
    # If starts with 00964, replace with +964
    if cleaned.startswith("00964"):
        return f"+{cleaned[2:]}"
    
    # Already in correct format
    if cleaned.startswith("+964"):
        return cleaned
    
    return cleaned


class SMSService:
    """Service for sending SMS via UniMTX"""
    
    def __init__(self):
        self.api_url = UNIMTX_API_URL
        self.access_key = UNIMTX_ACCESS_KEY
        self.enabled = bool(self.access_key)
        
        if not self.enabled:
            logger.warning("SMS Service disabled: UNIMTX_ACCESS_KEY not configured")
    
    async def send_sms(self, phone: str, message: str) -> dict:
        """
        Send SMS to a phone number
        Returns: dict with success status and details
        """
        result = {
            "success": False,
            "phone": phone,
            "message": message,
            "error": None,
            "sent": False
        }
        
        # First check if it's an Iraqi number - skip non-Iraqi numbers regardless of service status
        if not is_iraqi_number(phone):
            result["error"] = "Not an Iraqi number - SMS skipped"
            logger.info(f"SMS skipped (non-Iraqi number): {phone}")
            return result
        
        if not self.enabled:
            result["error"] = "SMS service not configured"
            logger.warning(f"SMS not sent (service disabled): {phone}")
            return result
        
        # Format the number
        formatted_phone = format_iraqi_number(phone)
        result["formatted_phone"] = formatted_phone
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.api_url}/?action=sms.message.send&accessKeyId={self.access_key}",
                    json={
                        "to": formatted_phone,
                        "text": message
                    },
                    headers={"Content-Type": "application/json"}
                )
                
                data = response.json()
                
                if data.get("code") == "0":
                    result["success"] = True
                    result["sent"] = True
                    result["message_id"] = data.get("data", {}).get("messages", [{}])[0].get("id")
                    logger.info(f"SMS sent successfully to {formatted_phone}")
                else:
                    result["error"] = data.get("message", "Unknown error")
                    logger.error(f"SMS failed: {data}")
                    
        except Exception as e:
            result["error"] = str(e)
            logger.exception(f"SMS exception for {phone}: {e}")
        
        return result
    
    async def send_order_submitted(self, phone: str, order_id: str, order_type_label: str) -> dict:
        """Send SMS when order is submitted"""
        message = f"تم استلام طلبك رقم {order_id} ({order_type_label}) بنجاح. سيتم مراجعته قريباً - شركة دبي العالمية للصرافة"
        return await self.send_sms(phone, message)
    
    async def send_order_approved(self, phone: str, order_id: str) -> dict:
        """Send SMS when order is approved"""
        message = f"مبروك! تمت الموافقة على طلبك رقم {order_id}. شكراً لاختياركم شركة دبي العالمية للصرافة"
        return await self.send_sms(phone, message)
    
    async def send_order_rejected(self, phone: str, order_id: str, reason: Optional[str] = None) -> dict:
        """Send SMS when order is rejected"""
        if reason:
            message = f"عذراً، تم رفض طلبك رقم {order_id}. السبب: {reason}. للاستفسار تواصل معنا - شركة دبي العالمية للصرافة"
        else:
            message = f"عذراً، تم رفض طلبك رقم {order_id}. للاستفسار يرجى التواصل معنا - شركة دبي العالمية للصرافة"
        return await self.send_sms(phone, message)


# Singleton instance
sms_service = SMSService()
