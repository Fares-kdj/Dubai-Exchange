"""
Twilio SMS Service for Dubai International Exchange
Sends SMS notifications to Iraqi phone numbers using Twilio Content SIDs
"""
import os
import httpx
import logging
import json
from typing import Optional
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv(Path(__file__).parent.parent / '.env')

logger = logging.getLogger(__name__)

# Twilio Configuration
TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")
TWILIO_MESSAGING_SERVICE_SID = os.environ.get("TWILIO_SERVICE", "")

# Content SIDs from Twilio Console
TWILIO_CONTENT_ORDER_SUBMITTED = os.environ.get("TWILIO_CONTENT_ORDER_SUBMITTED", "")
TWILIO_CONTENT_ORDER_APPROVED = os.environ.get("TWILIO_CONTENT_ORDER_APPROVED", "")
TWILIO_CONTENT_ORDER_REJECTED = os.environ.get("TWILIO_CONTENT_ORDER_REJECTED", "")

# Default WhatsApp number
DEFAULT_WHATSAPP = os.environ.get("COMPANY_WHATSAPP", "+964XXXXXXXXXX")

# Iraqi phone number prefixes
IRAQI_PREFIXES = ["+964", "00964", "964"]


def is_iraqi_number(phone: str) -> bool:
    """Check if phone number is Iraqi"""
    if not phone:
        return False
    
    # Clean the phone number
    cleaned = ''.join(filter(str.isdigit, phone))
    if phone.startswith('+'):
        # Keep the plus for prefix matching
        cleaned = '+' + cleaned
    
    # Check for Iraqi prefixes
    for prefix in IRAQI_PREFIXES:
        if cleaned.startswith(prefix):
            return True
    
    # Check if it starts with 07 (Iraqi mobile format without country code)
    if cleaned.startswith("07") and len(cleaned) >= 10:
        return True
    
    # Check if it starts with 7 (Iraqi mobile without leading zero e.g. 7801234567)
    if cleaned.startswith("7") and len(cleaned) == 10:
        return True
    
    return False


def format_phone_number(phone: str) -> str:
    """
    Format phone number to E.164 format.
    Handles Iraqi numbers specifically but also supports other international formats.
    """
    if not phone:
        return ""
    
    # Clean the phone number but keep leading + if present
    is_plus = phone.strip().startswith('+')
    cleaned = ''.join(filter(str.isdigit, phone))
    
    # Special handling for Iraqi numbers
    if is_iraqi_number(phone):
        # Case 1: Starts with 07... -> +9647...
        if cleaned.startswith("07") and len(cleaned) >= 10:
            return f"+964{cleaned[1:]}"
        
        # Case 2: Starts with 7... -> +9647...
        if cleaned.startswith("7") and len(cleaned) == 10:
            return f"+964{cleaned}"
            
        # Case 3: Already has country code 964
        if cleaned.startswith("964"):
            # Ensure no leading zero after 964
            # e.g. 96407... -> 9647...
            rest = cleaned[3:]
            if rest.startswith("0"):
                rest = rest[1:]
            return f"+964{rest}"
            
    # General international format
    # Case: Starts with 00... -> +...
    if cleaned.startswith("00"):
        cleaned = cleaned[2:]
        return f"+{cleaned}"
        
    if is_plus:
        return f"+{cleaned}"
    
    # If no plus but looks like it has a country code (passed as + from frontend but joined here)
    if not is_plus and len(cleaned) > 10:
        return f"+{cleaned}"
        
    return cleaned


def format_iraqi_number(phone: str) -> str:
    """Legacy wrapper for format_phone_number focus on Iraqi numbers"""
    return format_phone_number(phone)


class SMSService:
    """Service for sending SMS via Twilio using Content SIDs"""
    
    def __init__(self):
        self.account_sid = TWILIO_ACCOUNT_SID
        self.auth_token = TWILIO_AUTH_TOKEN
        self.messaging_service_sid = TWILIO_MESSAGING_SERVICE_SID
        self.whatsapp = DEFAULT_WHATSAPP
        self.enabled = bool(self.account_sid and self.auth_token and self.messaging_service_sid)
        
        if not self.enabled:
            logger.warning("SMS Service disabled: Twilio credentials missing in .env")
        else:
            logger.info(f"SMS Service enabled with Twilio Account: {self.account_sid}")
    
    def set_whatsapp(self, whatsapp: str):
        """Update WhatsApp number dynamically"""
        if whatsapp:
            self.whatsapp = whatsapp
            logger.info(f"WhatsApp number updated to: {whatsapp}")
    
    async def sync_whatsapp(self, db):
        """Fetch WhatsApp number from database settings (Prioritizing Contact Information from CMS)"""
        try:
            # 1. Try contact settings (Primary - as requested by user)
            contact = await db.settings.find_one({"type": "contact"})
            if contact and "content" in contact:
                # Use Arabic as source for contact info
                content = contact.get("content", {})
                ar_content = content.get("ar", {})
                whatsapp = ar_content.get("whatsapp") or ar_content.get("phone")
                
                if whatsapp:
                    self.set_whatsapp(whatsapp)
                    logger.info(f"WhatsApp synced from Contact Info: {whatsapp}")
                    return True

            # 2. Try company settings (Fallback)
            company = await db.settings.find_one({"type": "company"})
            if company:
                whatsapp = company.get("whatsapp")
                if not whatsapp:
                    whatsapp = company.get("phone")
                
                if whatsapp:
                    self.set_whatsapp(whatsapp)
                    logger.info(f"WhatsApp synced from Company Settings: {whatsapp}")
                    return True
        except Exception as e:
            logger.error(f"Failed to sync WhatsApp number from DB: {e}")
        return False
    
    async def send_content_sms(self, phone: str, content_sid: str, variables: dict = None) -> dict:
        """
        Send SMS using a Twilio Content SID
        Returns: dict with success status and details
        """
        result = {
            "success": False,
            "phone": phone,
            "content_sid": content_sid,
            "error": None,
            "sent": False
        }
        
        # Format the number
        formatted_phone = format_phone_number(phone)
        result["formatted_phone"] = formatted_phone
        
        logger.info(f"Preparing to send SMS to {phone} (formatted: {formatted_phone})")
        
        # Default variables if none provided
        if variables is None:
            variables = {"1": self.whatsapp} # Default variable mapping
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                url = f"https://api.twilio.com/2010-04-01/Accounts/{self.account_sid}/Messages.json"
                
                # Build the request payload
                payload = {
                    "To": formatted_phone,
                    "MessagingServiceSid": self.messaging_service_sid,
                    "ContentSid": content_sid,
                    "ContentVariables": json.dumps(variables)
                }
                
                response = await client.post(
                    url,
                    data=payload,
                    auth=(self.account_sid, self.auth_token)
                )
                
                data = response.json()
                
                if response.status_code in [200, 201]:
                    result["success"] = True
                    result["sent"] = True
                    result["message_sid"] = data.get("sid")
                    logger.info(f"Twilio SMS sent successfully to {formatted_phone} using SID {content_sid}")
                else:
                    result["error"] = data.get("message", "Twilio API Error")
                    result["error_code"] = data.get("code")
                    logger.error(f"Twilio SMS failed: {data}")
                    
        except Exception as e:
            result["error"] = str(e)
            logger.exception(f"Twilio SMS exception for {phone}: {e}")
        
        return result

    async def send_plain_sms(self, phone: str, body: str) -> dict:
        """
        Send a standard plain text SMS using the 'Body' parameter
        Returns: dict with success status and details
        """
        result = {
            "success": False,
            "phone": phone,
            "body": body,
            "error": None,
            "sent": False
        }
        
        # Format the number
        formatted_phone = format_phone_number(phone)
        result["formatted_phone"] = formatted_phone
        
        logger.info(f"Preparing to send plain SMS to {phone} (formatted: {formatted_phone})")
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                url = f"https://api.twilio.com/2010-04-01/Accounts/{self.account_sid}/Messages.json"
                
                # Build the request payload with Body instead of ContentSid
                payload = {
                    "To": formatted_phone,
                    "MessagingServiceSid": self.messaging_service_sid,
                    "Body": body
                }
                
                response = await client.post(
                    url,
                    data=payload,
                    auth=(self.account_sid, self.auth_token)
                )
                
                data = response.json()
                
                if response.status_code in [200, 201]:
                    result["success"] = True
                    result["sent"] = True
                    result["message_sid"] = data.get("sid")
                    logger.info(f"Twilio Plain SMS sent successfully to {formatted_phone}")
                else:
                    result["error"] = data.get("message", "Twilio API Error")
                    result["error_code"] = data.get("code")
                    logger.error(f"Twilio Plain SMS failed: {data}")
                    
        except Exception as e:
            result["error"] = str(e)
            logger.exception(f"Twilio Plain SMS exception for {phone}: {e}")
        
        return result
    
    async def send_order_submitted(self, phone: str, order_id: str = "", whatsapp: str = None) -> dict:
        """Send SMS when order is submitted (Always Plain Text as requested)"""
        support = whatsapp or self.whatsapp
        body = f"تم استلام طلبكم {order_id} وهو قيد المراجعة. يرجى إكمال الإيداع خلال ساعتين لتجنب إلغاء الطلب. للدعم {support}"
        return await self.send_plain_sms(phone, body)
    
    async def send_order_approved(self, phone: str, order_id: str = "", whatsapp: str = None) -> dict:
        """Send SMS when order is approved (Always Plain Text as requested)"""
        support = whatsapp or self.whatsapp
        body = f"تم قبول طلبكم {order_id}. لإكمال الإجراءات يرجى التواصل مع خدمة العملاء {support}"
        return await self.send_plain_sms(phone, body)
    
    async def send_order_rejected(self, phone: str, order_id: str = "", whatsapp: str = None) -> dict:
        """Send SMS when order is rejected (Always Plain Text as requested)"""
        support = whatsapp or self.whatsapp
        body = f"نعتذر، تم رفض طلبكم {order_id}. للمزيد من التفاصيل يرجى التواصل مع خدمة العملاء {support}"
        return await self.send_plain_sms(phone, body)


# Create singleton
sms_service = SMSService()


def reinitialize_sms_service():
    """Reinitialize SMS service (call after env changes)"""
    global sms_service
    sms_service = SMSService()
    return sms_service
