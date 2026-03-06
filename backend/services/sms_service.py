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
TWILIO_PHONE_NUMBER = os.environ.get("TWILIO_PHONE_NUMBER", "")

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
    """Service for sending SMS via Twilio using Content SIDs"""
    
    def __init__(self):
        self.account_sid = TWILIO_ACCOUNT_SID
        self.auth_token = TWILIO_AUTH_TOKEN
        self.from_phone = TWILIO_PHONE_NUMBER
        self.whatsapp = DEFAULT_WHATSAPP
        self.enabled = bool(self.account_sid and self.auth_token and self.from_phone)
        
        if not self.enabled:
            logger.warning("SMS Service disabled: Twilio credentials missing in .env")
        else:
            logger.info(f"SMS Service enabled with Twilio Account: {self.account_sid}")
    
    def set_whatsapp(self, whatsapp: str):
        """Update WhatsApp number dynamically"""
        self.whatsapp = whatsapp
        logger.info(f"WhatsApp number updated to: {whatsapp}")
    
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
        
        # First check if it's an Iraqi number
        if not is_iraqi_number(phone):
            result["error"] = "Not an Iraqi number - SMS skipped"
            logger.info(f"SMS skipped (non-Iraqi number): {phone}")
            return result
        
        if not self.enabled:
            result["error"] = "SMS service not configured"
            logger.warning(f"SMS not sent (service disabled): {phone}")
            return result
            
        if not content_sid:
            result["error"] = "Empty Content SID"
            logger.warning(f"SMS not sent (empty SID): {phone}")
            return result
        
        # Format the number
        formatted_phone = format_iraqi_number(phone)
        result["formatted_phone"] = formatted_phone
        
        # Default variables if none provided
        if variables is None:
            variables = {"1": self.whatsapp} # Default variable mapping
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                url = f"https://api.twilio.com/2010-04-01/Accounts/{self.account_sid}/Messages.json"
                
                # Build the request payload
                payload = {
                    "To": formatted_phone,
                    "From": self.from_phone,
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
    
    async def send_order_submitted(self, phone: str, whatsapp: str = None) -> dict:
        """Send SMS when order is submitted"""
        vars = {"1": whatsapp or self.whatsapp}
        return await self.send_content_sms(phone, TWILIO_CONTENT_ORDER_SUBMITTED, vars)
    
    async def send_order_approved(self, phone: str, whatsapp: str = None) -> dict:
        """Send SMS when order is approved"""
        vars = {"1": whatsapp or self.whatsapp}
        return await self.send_content_sms(phone, TWILIO_CONTENT_ORDER_APPROVED, vars)
    
    async def send_order_rejected(self, phone: str, whatsapp: str = None) -> dict:
        """Send SMS when order is rejected"""
        vars = {"1": whatsapp or self.whatsapp}
        return await self.send_content_sms(phone, TWILIO_CONTENT_ORDER_REJECTED, vars)


# Create singleton
sms_service = SMSService()


def reinitialize_sms_service():
    """Reinitialize SMS service (call after env changes)"""
    global sms_service
    sms_service = SMSService()
    return sms_service
