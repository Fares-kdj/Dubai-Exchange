from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import getSampleStyleSheet
from bidi.algorithm import get_display
import arabic_reshaper
import io
import os
from datetime import datetime, timezone

from models.user import Permission, UserInDB
from routes.auth import get_current_user, require_permission

router = APIRouter(prefix="/pdf", tags=["PDF Generator"])

from database import db
orders_collection = db.orders
settings_collection = db.settings


def reshape_arabic(text):
    """Reshape Arabic text for proper display in PDF"""
    if not text:
        return ""
    reshaped = arabic_reshaper.reshape(str(text))
    return get_display(reshaped)


def draw_arabic_text(c, x, y, text, font_name="Helvetica", font_size=12, color=colors.black):
    """Draw Arabic text on canvas"""
    c.setFont(font_name, font_size)
    c.setFillColor(color)
    # Arabic text needs to be right-aligned
    text_width = c.stringWidth(reshape_arabic(text), font_name, font_size)
    c.drawString(x - text_width, y, reshape_arabic(text))


@router.get("/receipt/{order_id}")
async def generate_receipt(
    order_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """Generate PDF receipt for an order"""
    
    # Get order
    order = await orders_collection.find_one({"order_id": order_id.upper()}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Get branding settings
    branding = await settings_collection.find_one({"type": "branding"}, {"_id": 0})
    primary_color = colors.HexColor(branding.get("primary_color", "#D4AF37")) if branding else colors.HexColor("#D4AF37")
    
    # Create PDF buffer
    buffer = io.BytesIO()
    
    # Create canvas
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    # Header background
    c.setFillColor(colors.HexColor("#1E293B"))
    c.rect(0, height - 100, width, 100, fill=True, stroke=False)
    
    # Company name
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width / 2, height - 45, "Dubai International Exchange")
    
    c.setFont("Helvetica", 12)
    c.drawCentredString(width / 2, height - 65, "Financial Services & Currency Exchange")
    
    # Receipt title
    c.setFillColor(primary_color)
    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(width / 2, height - 130, "OFFICIAL RECEIPT")
    
    # Order info box
    y = height - 170
    c.setStrokeColor(colors.HexColor("#E2E8F0"))
    c.setFillColor(colors.HexColor("#F8FAFC"))
    c.roundRect(30, y - 80, width - 60, 80, 10, fill=True, stroke=True)
    
    # Order details
    c.setFillColor(colors.HexColor("#64748B"))
    c.setFont("Helvetica", 10)
    c.drawString(45, y - 25, "Order ID:")
    c.drawString(45, y - 45, "Date:")
    c.drawString(45, y - 65, "Status:")
    
    c.setFillColor(colors.HexColor("#1E293B"))
    c.setFont("Helvetica-Bold", 12)
    c.drawString(150, y - 25, order.get("order_id", ""))
    c.drawString(150, y - 45, order.get("created_at", "")[:10])
    
    # Status with color
    status = order.get("status", "")
    status_colors = {
        "waiting_payment": colors.HexColor("#F59E0B"),
        "under_review": colors.HexColor("#3B82F6"),
        "approved": colors.HexColor("#10B981"),
        "rejected": colors.HexColor("#EF4444")
    }
    status_labels = {
        "waiting_payment": "Waiting for Payment",
        "under_review": "Under Review",
        "approved": "APPROVED",
        "rejected": "REJECTED"
    }
    c.setFillColor(status_colors.get(status, colors.gray))
    c.drawString(150, y - 65, status_labels.get(status, status))
    
    # Order type on right side
    order_type_labels = {
        "traveler": "Traveler USD Booking",
        "local": "Local Transfer",
        "western_union": "Western Union",
        "moneygram": "MoneyGram",
        "country_based": "International Transfer"
    }
    c.setFillColor(colors.HexColor("#64748B"))
    c.setFont("Helvetica", 10)
    c.drawRightString(width - 45, y - 25, "Type:")
    c.setFillColor(primary_color)
    c.setFont("Helvetica-Bold", 11)
    c.drawRightString(width - 45, y - 45, order_type_labels.get(order.get("order_type", ""), ""))
    
    # Customer info section
    y = y - 110
    c.setFillColor(colors.HexColor("#1E293B"))
    c.setFont("Helvetica-Bold", 14)
    c.drawString(30, y, "Customer Information")
    
    c.setStrokeColor(primary_color)
    c.setLineWidth(2)
    c.line(30, y - 5, 200, y - 5)
    
    customer = order.get("customer", {})
    y -= 30
    c.setFont("Helvetica", 11)
    c.setFillColor(colors.HexColor("#64748B"))
    c.drawString(30, y, "Name:")
    c.drawString(30, y - 20, "Phone:")
    
    c.setFillColor(colors.HexColor("#1E293B"))
    c.drawString(100, y, customer.get("full_name", "-"))
    c.drawString(100, y - 20, customer.get("phone", "-"))
    
    # Transaction details section
    y -= 60
    c.setFillColor(colors.HexColor("#1E293B"))
    c.setFont("Helvetica-Bold", 14)
    c.drawString(30, y, "Transaction Details")
    
    c.setStrokeColor(primary_color)
    c.line(30, y - 5, 200, y - 5)
    
    details = order.get("details", {})
    y -= 30
    
    # Draw details based on order type
    detail_items = []
    if order.get("order_type") == "traveler":
        detail_items = [
            ("Travel Type", details.get("travelType", "-")),
            ("Destination", details.get("destination", "-")),
            ("Travel Date", details.get("travelDate", "-")),
            ("USD Amount", f"${details.get('usdAmount', '0')}"),
            ("IQD Amount", f"{details.get('iqdAmount', '0')} IQD"),
            ("Pickup Location", details.get("pickupLocation", "-")),
        ]
    elif order.get("order_type") == "local":
        detail_items = [
            ("Sender", details.get("senderName", "-")),
            ("Receiver", details.get("receiverName", "-")),
            ("Amount", f"{details.get('amount', '0')} IQD"),
            ("Service Fee", f"{details.get('serviceFee', '0')} IQD"),
            ("Total", f"{details.get('total', '0')} IQD"),
        ]
    else:
        detail_items = [
            ("Sender", details.get("senderName", "-")),
            ("Receiver", details.get("receiverName", "-")),
            ("Amount", f"{details.get('currency', 'USD')} {details.get('amount', '0')}"),
            ("Service Fee", f"{details.get('serviceFee', '0')} IQD"),
        ]
    
    for label, value in detail_items:
        c.setFillColor(colors.HexColor("#64748B"))
        c.setFont("Helvetica", 11)
        c.drawString(30, y, label + ":")
        c.setFillColor(colors.HexColor("#1E293B"))
        c.setFont("Helvetica-Bold", 11)
        c.drawString(150, y, str(value))
        y -= 20
    
    # Total amount box (if applicable)
    if details.get("total") or details.get("usdAmount"):
        y -= 20
        c.setFillColor(primary_color)
        c.roundRect(30, y - 40, width - 60, 50, 5, fill=True, stroke=False)
        
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y - 20, "TOTAL AMOUNT:")
        
        total = details.get("total") or details.get("usdAmount", "0")
        currency = "IQD" if details.get("total") else "USD"
        c.setFont("Helvetica-Bold", 18)
        c.drawRightString(width - 50, y - 20, f"{total} {currency}")
    
    # Footer
    c.setFillColor(colors.HexColor("#94A3B8"))
    c.setFont("Helvetica", 9)
    c.drawCentredString(width / 2, 80, "This is an official receipt from Dubai International Exchange")
    c.drawCentredString(width / 2, 65, "For inquiries: +964 XXX XXX XXXX | info@dubai-exchange.com")
    
    # Timestamp
    c.setFont("Helvetica", 8)
    c.drawCentredString(width / 2, 40, f"Generated on: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}")
    
    # Watermark if not approved
    if status != "approved":
        c.saveState()
        c.setFillColor(colors.Color(0.9, 0.9, 0.9, alpha=0.3))
        c.setFont("Helvetica-Bold", 60)
        c.translate(width / 2, height / 2)
        c.rotate(45)
        c.drawCentredString(0, 0, status_labels.get(status, "PENDING").upper())
        c.restoreState()
    
    # Save PDF
    c.save()
    buffer.seek(0)
    
    # Return PDF response
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=receipt_{order_id}.pdf"
        }
    )


@router.get("/preview/{order_id}")
async def preview_receipt(order_id: str):
    """Preview receipt (returns PDF inline)"""
    order = await orders_collection.find_one({"order_id": order_id.upper()}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Same generation logic but inline display
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    
    # Simplified preview - just basic info
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width / 2, height - 50, "Dubai International Exchange")
    
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width / 2, height - 100, "RECEIPT")
    
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 150, f"Order ID: {order.get('order_id', '')}")
    c.drawString(50, height - 170, f"Date: {order.get('created_at', '')[:10]}")
    c.drawString(50, height - 190, f"Customer: {order.get('customer', {}).get('full_name', '')}")
    c.drawString(50, height - 210, f"Status: {order.get('status', '')}")
    
    c.save()
    buffer.seek(0)
    
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"inline; filename=preview_{order_id}.pdf"}
    )
