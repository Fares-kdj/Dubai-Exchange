"""
Backend API Tests for Dubai International Exchange - Orders Module
Tests: Create Order, Track Order, Update Order, List Orders, Stats
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestOrdersAPI:
    """Orders API endpoint tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test data"""
        self.test_order_id = None
        yield
        # Cleanup: Delete test order if created
        if self.test_order_id:
            try:
                requests.delete(f"{BASE_URL}/api/orders/{self.test_order_id}")
            except:
                pass
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Dubai International" in data["message"]
    
    def test_create_order_traveler(self):
        """Test creating a traveler order"""
        payload = {
            "order_type": "traveler",
            "customer": {
                "full_name": "TEST_User_Traveler",
                "phone": "+964 770 111 2222",
                "email": "test_traveler@example.com"
            },
            "details": {
                "travelType": "air",
                "destination": "Turkey",
                "travelDate": "2025-03-15",
                "usdAmount": 1500,
                "iqdAmount": 2250000
            },
            "documents": []
        }
        
        response = requests.post(f"{BASE_URL}/api/orders", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert "order_id" in data
        assert data["order_id"].startswith("TRV-")
        assert data["status"] == "waiting_payment"
        assert data["customer"]["full_name"] == "TEST_User_Traveler"
        assert data["order_type"] == "traveler"
        
        self.test_order_id = data["order_id"]
        
        # Verify persistence with GET
        get_response = requests.get(f"{BASE_URL}/api/orders/{self.test_order_id}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["order_id"] == self.test_order_id
        assert fetched["customer"]["full_name"] == "TEST_User_Traveler"
    
    def test_create_order_local(self):
        """Test creating a local transfer order"""
        payload = {
            "order_type": "local",
            "customer": {
                "full_name": "TEST_User_Local",
                "phone": "+964 771 333 4444"
            },
            "details": {
                "senderName": "TEST_User_Local",
                "receiverName": "Receiver Name",
                "amount": "500000",
                "senderProvince": "Baghdad",
                "receiverProvince": "Basra"
            },
            "documents": []
        }
        
        response = requests.post(f"{BASE_URL}/api/orders", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["order_id"].startswith("LOC-")
        assert data["order_type"] == "local"
        
        self.test_order_id = data["order_id"]
    
    def test_create_order_western_union(self):
        """Test creating a Western Union order"""
        payload = {
            "order_type": "western_union",
            "customer": {
                "full_name": "TEST_User_WU",
                "phone": "+964 772 555 6666"
            },
            "details": {
                "senderName": "TEST_User_WU",
                "receiverName": "Receiver WU",
                "amount": "300",
                "currency": "USD"
            },
            "documents": []
        }
        
        response = requests.post(f"{BASE_URL}/api/orders", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["order_id"].startswith("WU-")
        assert data["order_type"] == "western_union"
        
        self.test_order_id = data["order_id"]
    
    def test_track_order_success(self):
        """Test tracking an existing order"""
        # Use known test order
        payload = {
            "order_id": "TRV-71694EB7",
            "order_type": "traveler"
        }
        
        response = requests.post(f"{BASE_URL}/api/orders/track", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["order_id"] == "TRV-71694EB7"
        assert data["order_type"] == "traveler"
        assert "customer" in data
        assert "status" in data
    
    def test_track_order_wrong_type(self):
        """Test tracking with wrong order type returns 404"""
        payload = {
            "order_id": "TRV-71694EB7",
            "order_type": "local"  # Wrong type
        }
        
        response = requests.post(f"{BASE_URL}/api/orders/track", json=payload)
        assert response.status_code == 404
        
        data = response.json()
        assert "detail" in data
    
    def test_track_order_not_found(self):
        """Test tracking non-existent order returns 404"""
        payload = {
            "order_id": "TRV-NOTEXIST",
            "order_type": "traveler"
        }
        
        response = requests.post(f"{BASE_URL}/api/orders/track", json=payload)
        assert response.status_code == 404
    
    def test_update_order_status(self):
        """Test updating order status"""
        # First create an order
        create_payload = {
            "order_type": "traveler",
            "customer": {
                "full_name": "TEST_Update_User",
                "phone": "+964 773 777 8888"
            },
            "details": {"usdAmount": 500},
            "documents": []
        }
        
        create_response = requests.post(f"{BASE_URL}/api/orders", json=create_payload)
        assert create_response.status_code == 200
        order_id = create_response.json()["order_id"]
        self.test_order_id = order_id
        
        # Update status
        update_payload = {
            "status": "under_review",
            "admin_notes": "Test update note"
        }
        
        update_response = requests.put(f"{BASE_URL}/api/orders/{order_id}", json=update_payload)
        assert update_response.status_code == 200
        
        updated = update_response.json()
        assert updated["status"] == "under_review"
        assert updated["admin_notes"] == "Test update note"
        
        # Verify persistence
        get_response = requests.get(f"{BASE_URL}/api/orders/{order_id}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["status"] == "under_review"
        assert fetched["admin_notes"] == "Test update note"
    
    def test_update_order_not_found(self):
        """Test updating non-existent order returns 404"""
        update_payload = {"status": "approved"}
        
        response = requests.put(f"{BASE_URL}/api/orders/NOTEXIST-123", json=update_payload)
        assert response.status_code == 404
    
    def test_list_orders(self):
        """Test listing all orders"""
        response = requests.get(f"{BASE_URL}/api/orders")
        assert response.status_code == 200
        
        data = response.json()
        assert "orders" in data
        assert "total" in data
        assert "page" in data
        assert "page_size" in data
        assert isinstance(data["orders"], list)
    
    def test_list_orders_with_filters(self):
        """Test listing orders with status filter"""
        response = requests.get(f"{BASE_URL}/api/orders?status=under_review")
        assert response.status_code == 200
        
        data = response.json()
        for order in data["orders"]:
            assert order["status"] == "under_review"
    
    def test_list_orders_with_type_filter(self):
        """Test listing orders with type filter"""
        response = requests.get(f"{BASE_URL}/api/orders?order_type=traveler")
        assert response.status_code == 200
        
        data = response.json()
        for order in data["orders"]:
            assert order["order_type"] == "traveler"
    
    def test_list_orders_pagination(self):
        """Test orders pagination"""
        response = requests.get(f"{BASE_URL}/api/orders?page=1&page_size=2")
        assert response.status_code == 200
        
        data = response.json()
        assert data["page"] == 1
        assert data["page_size"] == 2
        assert len(data["orders"]) <= 2
    
    def test_get_order_stats(self):
        """Test getting order statistics"""
        response = requests.get(f"{BASE_URL}/api/orders/stats/summary")
        assert response.status_code == 200
        
        data = response.json()
        assert "total_orders" in data
        assert "waiting_payment" in data
        assert "under_review" in data
        assert "approved" in data
        assert "rejected" in data
        assert "by_type" in data
        assert isinstance(data["by_type"], dict)
    
    def test_get_single_order(self):
        """Test getting a single order by ID"""
        response = requests.get(f"{BASE_URL}/api/orders/TRV-71694EB7")
        assert response.status_code == 200
        
        data = response.json()
        assert data["order_id"] == "TRV-71694EB7"
        assert "customer" in data
        assert "details" in data
    
    def test_get_single_order_not_found(self):
        """Test getting non-existent order returns 404"""
        response = requests.get(f"{BASE_URL}/api/orders/NOTEXIST-123")
        assert response.status_code == 404


class TestSettingsAPI:
    """Settings API endpoint tests"""
    
    def test_get_company_settings(self):
        """Test getting company settings"""
        response = requests.get(f"{BASE_URL}/api/settings/company")
        assert response.status_code == 200
        
        data = response.json()
        assert "company_name_ar" in data
        assert "company_name_en" in data
        assert "phone" in data
    
    def test_get_exchange_rates(self):
        """Test getting exchange rates"""
        response = requests.get(f"{BASE_URL}/api/settings/exchange-rates")
        assert response.status_code == 200
        
        data = response.json()
        assert "mode" in data
        assert "rates" in data
        assert isinstance(data["rates"], list)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
