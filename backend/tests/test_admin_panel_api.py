"""
Backend API Tests for Dubai Exchange Admin Panel
Tests: Auth, Orders, Blocklist, Stamps/Airports, CMS (Services, Countries, Rates)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials
ADMIN_EMAIL = "developer@khairbaghdad.com"
ADMIN_PASSWORD = "dev@123456"


class TestAuthAPI:
    """Authentication API tests"""
    
    def test_login_success(self):
        """Test successful admin login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["role"] == "developer"
        assert "permissions" in data["user"]
        assert len(data["user"]["permissions"]) > 0
    
    def test_login_invalid_credentials(self):
        """Test login with wrong credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@example.com",
            "password": "wrongpass"
        })
        assert response.status_code == 401
    
    def test_login_wrong_password(self):
        """Test login with correct email but wrong password"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": "wrongpassword"
        })
        assert response.status_code == 401
    
    def test_get_me_with_token(self):
        """Test getting current user info with valid token"""
        # First login
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_response.json()["access_token"]
        
        # Get me
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200
        
        data = response.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "developer"
    
    def test_get_me_without_token(self):
        """Test getting current user without token returns 403"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 403


class TestOrdersAPI:
    """Orders API tests for admin panel"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup: Get auth token"""
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        self.token = login_response.json()["access_token"]
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        self.test_order_id = None
        yield
        # Cleanup
        if self.test_order_id:
            try:
                requests.delete(f"{BASE_URL}/api/orders/{self.test_order_id}", headers=self.headers)
            except:
                pass
    
    def test_list_orders(self):
        """Test listing all orders"""
        response = requests.get(f"{BASE_URL}/api/orders")
        assert response.status_code == 200
        
        data = response.json()
        assert "orders" in data
        assert "total" in data
        assert isinstance(data["orders"], list)
    
    def test_list_orders_by_type_traveler(self):
        """Test filtering orders by traveler type"""
        response = requests.get(f"{BASE_URL}/api/orders?order_type=traveler")
        assert response.status_code == 200
        
        data = response.json()
        for order in data["orders"]:
            assert order["order_type"] == "traveler"
    
    def test_list_orders_by_type_local(self):
        """Test filtering orders by local type"""
        response = requests.get(f"{BASE_URL}/api/orders?order_type=local")
        assert response.status_code == 200
        
        data = response.json()
        for order in data["orders"]:
            assert order["order_type"] == "local"
    
    def test_list_orders_by_type_western_union(self):
        """Test filtering orders by western_union type"""
        response = requests.get(f"{BASE_URL}/api/orders?order_type=western_union")
        assert response.status_code == 200
        
        data = response.json()
        for order in data["orders"]:
            assert order["order_type"] == "western_union"
    
    def test_get_order_stats(self):
        """Test getting order statistics"""
        response = requests.get(f"{BASE_URL}/api/orders/stats/summary")
        assert response.status_code == 200
        
        data = response.json()
        assert "total_orders" in data
        assert "pending_review" in data
        assert "waiting_payment" in data
        assert "under_review" in data
        assert "approved" in data
        assert "rejected" in data
        assert "ignored" in data
        assert "by_type" in data
    
    def test_update_order_status(self):
        """Test updating order status"""
        # Create test order
        create_payload = {
            "order_type": "traveler",
            "customer": {
                "full_name": "TEST_Admin_Update",
                "phone": "+964 770 999 8888"
            },
            "details": {"usdAmount": 500},
            "documents": []
        }
        
        create_response = requests.post(f"{BASE_URL}/api/orders", json=create_payload)
        assert create_response.status_code == 200
        order_id = create_response.json()["order_id"]
        self.test_order_id = order_id
        
        # Update status
        update_payload = {"status": "under_review"}
        update_response = requests.put(f"{BASE_URL}/api/orders/{order_id}", json=update_payload)
        assert update_response.status_code == 200
        
        updated = update_response.json()
        assert updated["status"] == "under_review"
        
        # Verify persistence
        get_response = requests.get(f"{BASE_URL}/api/orders/{order_id}")
        assert get_response.status_code == 200
        assert get_response.json()["status"] == "under_review"
    
    def test_update_order_admin_data(self):
        """Test updating order admin_data field"""
        # Create test order
        create_payload = {
            "order_type": "traveler",
            "customer": {
                "full_name": "TEST_Admin_Data",
                "phone": "+964 770 888 7777"
            },
            "details": {"usdAmount": 1000},
            "documents": []
        }
        
        create_response = requests.post(f"{BASE_URL}/api/orders", json=create_payload)
        assert create_response.status_code == 200
        order_id = create_response.json()["order_id"]
        self.test_order_id = order_id
        
        # Update admin_data
        admin_data = {
            "batch_number": "BATCH-001",
            "batch_date": "2026-02-25",
            "mother_name": "Test Mother",
            "ticket_number": "TKT-12345"
        }
        update_payload = {"admin_data": admin_data}
        update_response = requests.put(f"{BASE_URL}/api/orders/{order_id}", json=update_payload)
        assert update_response.status_code == 200
        
        updated = update_response.json()
        assert updated["admin_data"]["batch_number"] == "BATCH-001"
        assert updated["admin_data"]["mother_name"] == "Test Mother"
        
        # Verify persistence
        get_response = requests.get(f"{BASE_URL}/api/orders/{order_id}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["admin_data"]["batch_number"] == "BATCH-001"


class TestBlocklistAPI:
    """Blocklist API tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup: Get auth token"""
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        self.token = login_response.json()["access_token"]
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        self.test_block_id = None
        yield
        # Cleanup
        if self.test_block_id:
            try:
                requests.delete(f"{BASE_URL}/api/blocklist/{self.test_block_id}", headers=self.headers)
            except:
                pass
    
    def test_list_blocklist(self):
        """Test listing blocked entries"""
        response = requests.get(f"{BASE_URL}/api/blocklist/", headers=self.headers)
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_blocklist_count(self):
        """Test getting blocklist count"""
        response = requests.get(f"{BASE_URL}/api/blocklist/count", headers=self.headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "count" in data
        assert isinstance(data["count"], int)
    
    def test_add_to_blocklist(self):
        """Test adding a customer to blocklist"""
        payload = {
            "full_name": "TEST_Blocked_User",
            "phone": "+964 770 111 0000",
            "reason": "fraud",
            "reason_notes": "Test block entry"
        }
        
        response = requests.post(f"{BASE_URL}/api/blocklist/", json=payload, headers=self.headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "block_id" in data
        assert data["full_name"] == "TEST_Blocked_User"
        assert data["reason"] == "fraud"
        
        self.test_block_id = data["block_id"]
    
    def test_check_if_blocked(self):
        """Test checking if a customer is blocked"""
        # First add to blocklist
        payload = {
            "full_name": "TEST_Check_Blocked",
            "phone": "+964 770 222 3333",
            "reason": "suspicious_activity"
        }
        
        add_response = requests.post(f"{BASE_URL}/api/blocklist/", json=payload, headers=self.headers)
        assert add_response.status_code == 200
        self.test_block_id = add_response.json()["block_id"]
        
        # Check if blocked
        check_response = requests.get(
            f"{BASE_URL}/api/blocklist/check?full_name=TEST_Check_Blocked&phone=+964 770 222 3333"
        )
        assert check_response.status_code == 200
        
        data = check_response.json()
        assert data["blocked"] == True
    
    def test_remove_from_blocklist(self):
        """Test removing a customer from blocklist"""
        # First add to blocklist
        payload = {
            "full_name": "TEST_Remove_Blocked",
            "phone": "+964 770 444 5555",
            "reason": "other"
        }
        
        add_response = requests.post(f"{BASE_URL}/api/blocklist/", json=payload, headers=self.headers)
        assert add_response.status_code == 200
        block_id = add_response.json()["block_id"]
        
        # Remove from blocklist
        delete_response = requests.delete(f"{BASE_URL}/api/blocklist/{block_id}", headers=self.headers)
        assert delete_response.status_code == 200
        
        # Verify removed
        check_response = requests.get(
            f"{BASE_URL}/api/blocklist/check?full_name=TEST_Remove_Blocked&phone=+964 770 444 5555"
        )
        assert check_response.status_code == 200
        assert check_response.json()["blocked"] == False
    
    def test_get_block_reasons(self):
        """Test getting block reasons"""
        response = requests.get(f"{BASE_URL}/api/blocklist/reasons")
        assert response.status_code == 200
        
        data = response.json()
        assert "reasons" in data
        assert isinstance(data["reasons"], list)
        assert len(data["reasons"]) > 0


class TestStampsAirportsAPI:
    """Stamps and Airports API tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup: Get auth token"""
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        self.token = login_response.json()["access_token"]
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        self.test_stamp_id = None
        yield
        # Cleanup
        if self.test_stamp_id:
            try:
                requests.delete(f"{BASE_URL}/api/stamps/{self.test_stamp_id}", headers=self.headers)
            except:
                pass
    
    def test_list_stamps(self):
        """Test listing all stamps"""
        response = requests.get(f"{BASE_URL}/api/stamps/", headers=self.headers)
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
    
    def test_list_airports(self):
        """Test listing airports (public endpoint)"""
        response = requests.get(f"{BASE_URL}/api/stamps/airports")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
    
    def test_list_borders(self):
        """Test listing border crossings (public endpoint)"""
        response = requests.get(f"{BASE_URL}/api/stamps/borders")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_stamp_types(self):
        """Test getting stamp types"""
        response = requests.get(f"{BASE_URL}/api/stamps/types")
        assert response.status_code == 200
        
        data = response.json()
        assert "types" in data
        assert isinstance(data["types"], list)
    
    def test_create_stamp(self):
        """Test creating a new stamp/airport"""
        payload = {
            "name_ar": "TEST_مطار تجريبي",
            "name_en": "TEST Airport",
            "stamp_type": "airport",
            "is_active": True,
            "sort_order": 99
        }
        
        response = requests.post(f"{BASE_URL}/api/stamps/", json=payload, headers=self.headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "stamp_id" in data
        assert data["name_ar"] == "TEST_مطار تجريبي"
        assert data["stamp_type"] == "airport"
        
        self.test_stamp_id = data["stamp_id"]
    
    def test_update_stamp(self):
        """Test updating a stamp"""
        # First create
        create_payload = {
            "name_ar": "TEST_ختم للتعديل",
            "name_en": "TEST Stamp to Update",
            "stamp_type": "company",
            "is_active": True,
            "sort_order": 98
        }
        
        create_response = requests.post(f"{BASE_URL}/api/stamps/", json=create_payload, headers=self.headers)
        assert create_response.status_code == 200
        stamp_id = create_response.json()["stamp_id"]
        self.test_stamp_id = stamp_id
        
        # Update
        update_payload = {
            "name_ar": "TEST_ختم معدل",
            "is_active": False
        }
        
        update_response = requests.put(f"{BASE_URL}/api/stamps/{stamp_id}", json=update_payload, headers=self.headers)
        assert update_response.status_code == 200
        
        updated = update_response.json()
        assert updated["name_ar"] == "TEST_ختم معدل"
        assert updated["is_active"] == False
    
    def test_delete_stamp(self):
        """Test deleting a stamp"""
        # First create
        create_payload = {
            "name_ar": "TEST_ختم للحذف",
            "name_en": "TEST Stamp to Delete",
            "stamp_type": "signature",
            "is_active": True,
            "sort_order": 97
        }
        
        create_response = requests.post(f"{BASE_URL}/api/stamps/", json=create_payload, headers=self.headers)
        assert create_response.status_code == 200
        stamp_id = create_response.json()["stamp_id"]
        
        # Delete
        delete_response = requests.delete(f"{BASE_URL}/api/stamps/{stamp_id}", headers=self.headers)
        assert delete_response.status_code == 200


class TestCMSServicesAPI:
    """CMS Services API tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup: Get auth token"""
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        self.token = login_response.json()["access_token"]
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        self.test_service_id = None
        yield
        # Cleanup
        if self.test_service_id:
            try:
                requests.delete(f"{BASE_URL}/api/cms/services/{self.test_service_id}", headers=self.headers)
            except:
                pass
    
    def test_list_services(self):
        """Test listing all services"""
        response = requests.get(f"{BASE_URL}/api/cms/services")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_service(self):
        """Test getting a specific service"""
        # First list to get an existing service
        list_response = requests.get(f"{BASE_URL}/api/cms/services")
        services = list_response.json()
        
        if len(services) > 0:
            service_id = services[0]["service_id"]
            response = requests.get(f"{BASE_URL}/api/cms/services/{service_id}")
            assert response.status_code == 200
            
            data = response.json()
            assert data["service_id"] == service_id
    
    def test_update_service(self):
        """Test updating a service"""
        # Get existing service
        list_response = requests.get(f"{BASE_URL}/api/cms/services")
        services = list_response.json()
        
        if len(services) > 0:
            service_id = services[0]["service_id"]
            original_name = services[0]["name_ar"]
            
            # Update
            update_payload = {"is_active": True}
            update_response = requests.put(
                f"{BASE_URL}/api/cms/services/{service_id}",
                json=update_payload,
                headers=self.headers
            )
            assert update_response.status_code == 200


class TestCMSCountriesAPI:
    """CMS Countries API tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup: Get auth token"""
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        self.token = login_response.json()["access_token"]
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        self.test_country_code = None
        yield
        # Cleanup
        if self.test_country_code:
            try:
                requests.delete(f"{BASE_URL}/api/cms/countries/{self.test_country_code}", headers=self.headers)
            except:
                pass
    
    def test_list_countries(self):
        """Test listing all countries"""
        response = requests.get(f"{BASE_URL}/api/cms/countries")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_country(self):
        """Test getting a specific country"""
        # First list to get an existing country
        list_response = requests.get(f"{BASE_URL}/api/cms/countries")
        countries = list_response.json()
        
        if len(countries) > 0:
            country_code = countries[0]["country_code"]
            response = requests.get(f"{BASE_URL}/api/cms/countries/{country_code}")
            assert response.status_code == 200
            
            data = response.json()
            assert data["country_code"] == country_code


class TestRatesAPI:
    """Exchange Rates API tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup: Get auth token"""
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        self.token = login_response.json()["access_token"]
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
    
    def test_list_rates(self):
        """Test listing all exchange rates"""
        response = requests.get(f"{BASE_URL}/api/rates")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_rate(self):
        """Test getting a specific rate"""
        # First list to get an existing rate
        list_response = requests.get(f"{BASE_URL}/api/rates")
        rates = list_response.json()
        
        if len(rates) > 0:
            currency_code = rates[0]["currency_code"]
            response = requests.get(f"{BASE_URL}/api/rates/{currency_code}")
            assert response.status_code == 200
            
            data = response.json()
            assert data["currency_code"] == currency_code
            assert "buy_rate" in data
            assert "sell_rate" in data
    
    def test_update_rate(self):
        """Test updating an exchange rate"""
        # Get existing rate
        list_response = requests.get(f"{BASE_URL}/api/rates")
        rates = list_response.json()
        
        if len(rates) > 0:
            currency_code = rates[0]["currency_code"]
            original_buy = rates[0]["buy_rate"]
            original_sell = rates[0]["sell_rate"]
            
            # Update
            update_payload = {
                "buy_rate": original_buy,
                "sell_rate": original_sell
            }
            update_response = requests.put(
                f"{BASE_URL}/api/rates/{currency_code}",
                json=update_payload,
                headers=self.headers
            )
            assert update_response.status_code == 200
            
            updated = update_response.json()
            assert updated["currency_code"] == currency_code


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
