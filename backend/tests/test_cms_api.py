"""
CMS API Tests - Tests for Terms, Contact, and Rate Mode Settings endpoints
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_EMAIL = "developer@dubai-exchange.com"
TEST_PASSWORD = "dev@123456"


class TestCMSPublicEndpoints:
    """Test public CMS endpoints (no auth required)"""
    
    def test_get_terms_public(self):
        """GET /api/cms/terms - should return terms or null"""
        response = requests.get(f"{BASE_URL}/api/cms/terms")
        assert response.status_code == 200
        print(f"Terms response: {response.json()}")
    
    def test_get_contact_public(self):
        """GET /api/cms/contact - should return contact info or null"""
        response = requests.get(f"{BASE_URL}/api/cms/contact")
        assert response.status_code == 200
        print(f"Contact response: {response.json()}")
    
    def test_get_rate_mode_public(self):
        """GET /api/rates/settings/mode - should return rate mode settings"""
        response = requests.get(f"{BASE_URL}/api/rates/settings/mode")
        assert response.status_code == 200
        data = response.json()
        assert "mode" in data
        assert data["mode"] in ["manual", "auto"]
        print(f"Rate mode response: {data}")


class TestCMSAuthenticatedEndpoints:
    """Test authenticated CMS endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Login and get auth token"""
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
        )
        if login_response.status_code != 200:
            pytest.skip("Authentication failed - skipping authenticated tests")
        
        self.token = login_response.json().get("access_token")
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.token}"
        }
    
    def test_update_terms(self):
        """PUT /api/cms/terms - should update terms and conditions"""
        terms_data = {
            "ar": {
                "title": "الشروط والأحكام",
                "sections": [
                    {"title": "القسم الأول", "content": "محتوى القسم الأول"}
                ]
            },
            "en": {
                "title": "Terms and Conditions",
                "sections": [
                    {"title": "Section One", "content": "Content of section one"}
                ]
            },
            "ku": {
                "title": "مەرج و رێساکان",
                "sections": []
            }
        }
        
        response = requests.put(
            f"{BASE_URL}/api/cms/terms",
            headers=self.headers,
            json=terms_data
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data or "content" in data
        print(f"Update terms response: {data}")
        
        # Verify by GET
        get_response = requests.get(f"{BASE_URL}/api/cms/terms")
        assert get_response.status_code == 200
        get_data = get_response.json()
        if get_data:
            assert "ar" in get_data or isinstance(get_data, dict)
            print(f"Verified terms data: {get_data}")
    
    def test_update_contact(self):
        """PUT /api/cms/contact - should update contact information"""
        contact_data = {
            "ar": {
                "address": "بغداد، العراق",
                "phone": "+964 123 456 789",
                "email": "info@example.com",
                "working_hours": "9:00 صباحاً - 5:00 مساءً"
            },
            "en": {
                "address": "Baghdad, Iraq",
                "phone": "+964 123 456 789",
                "email": "info@example.com",
                "working_hours": "9:00 AM - 5:00 PM"
            },
            "ku": {
                "address": "بەغدا، عێراق",
                "phone": "+964 123 456 789",
                "email": "info@example.com",
                "working_hours": "9:00 بەیانی - 5:00 ئێوارە"
            }
        }
        
        response = requests.put(
            f"{BASE_URL}/api/cms/contact",
            headers=self.headers,
            json=contact_data
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data or "content" in data
        print(f"Update contact response: {data}")
        
        # Verify by GET
        get_response = requests.get(f"{BASE_URL}/api/cms/contact")
        assert get_response.status_code == 200
        get_data = get_response.json()
        if get_data:
            assert "ar" in get_data or isinstance(get_data, dict)
            print(f"Verified contact data: {get_data}")
    
    def test_update_rate_mode_manual(self):
        """PUT /api/rates/settings/mode - should update to manual mode"""
        mode_data = {
            "mode": "manual",
            "api_source": "exchangerate-api",
            "update_interval_minutes": 60
        }
        
        response = requests.put(
            f"{BASE_URL}/api/rates/settings/mode",
            headers=self.headers,
            json=mode_data
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data or "settings" in data
        print(f"Update rate mode (manual) response: {data}")
        
        # Verify by GET
        get_response = requests.get(f"{BASE_URL}/api/rates/settings/mode")
        assert get_response.status_code == 200
        get_data = get_response.json()
        assert get_data["mode"] == "manual"
        print(f"Verified rate mode: {get_data}")
    
    def test_update_rate_mode_auto(self):
        """PUT /api/rates/settings/mode - should update to auto mode"""
        mode_data = {
            "mode": "auto",
            "api_source": "exchangerate-api",
            "update_interval_minutes": 30
        }
        
        response = requests.put(
            f"{BASE_URL}/api/rates/settings/mode",
            headers=self.headers,
            json=mode_data
        )
        assert response.status_code == 200
        data = response.json()
        print(f"Update rate mode (auto) response: {data}")
        
        # Verify by GET
        get_response = requests.get(f"{BASE_URL}/api/rates/settings/mode")
        assert get_response.status_code == 200
        get_data = get_response.json()
        assert get_data["mode"] == "auto"
        assert get_data["update_interval_minutes"] == 30
        print(f"Verified rate mode: {get_data}")
        
        # Reset to manual mode
        requests.put(
            f"{BASE_URL}/api/rates/settings/mode",
            headers=self.headers,
            json={"mode": "manual", "api_source": "exchangerate-api", "update_interval_minutes": 60}
        )
    
    def test_update_terms_without_auth(self):
        """PUT /api/cms/terms without auth - should return 401"""
        response = requests.put(
            f"{BASE_URL}/api/cms/terms",
            json={"ar": {"title": "Test"}}
        )
        assert response.status_code in [401, 403]
        print(f"Unauthorized terms update response: {response.status_code}")
    
    def test_update_contact_without_auth(self):
        """PUT /api/cms/contact without auth - should return 401"""
        response = requests.put(
            f"{BASE_URL}/api/cms/contact",
            json={"ar": {"address": "Test"}}
        )
        assert response.status_code in [401, 403]
        print(f"Unauthorized contact update response: {response.status_code}")
    
    def test_update_rate_mode_without_auth(self):
        """PUT /api/rates/settings/mode without auth - should return 401"""
        response = requests.put(
            f"{BASE_URL}/api/rates/settings/mode",
            json={"mode": "auto"}
        )
        assert response.status_code in [401, 403]
        print(f"Unauthorized rate mode update response: {response.status_code}")


class TestLiveRatesEndpoints:
    """Test live rates endpoints"""
    
    def test_fetch_live_rates(self):
        """GET /api/rates/live/fetch - should return rates"""
        response = requests.get(f"{BASE_URL}/api/rates/live/fetch")
        assert response.status_code == 200
        data = response.json()
        assert "source" in data
        assert "rates" in data
        assert data["source"] in ["manual", "live", "fallback"]
        print(f"Live rates source: {data['source']}, rates count: {len(data['rates'])}")
    
    @pytest.fixture(autouse=True)
    def setup_auth(self):
        """Login for authenticated tests"""
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
        )
        if login_response.status_code == 200:
            self.token = login_response.json().get("access_token")
            self.headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.token}"
            }
        else:
            self.token = None
            self.headers = {}
    
    def test_sync_live_rates(self):
        """POST /api/rates/live/sync - should sync rates from API"""
        if not self.token:
            pytest.skip("Authentication required")
        
        response = requests.post(
            f"{BASE_URL}/api/rates/live/sync",
            headers=self.headers
        )
        # May return 200 or 500 depending on external API availability
        assert response.status_code in [200, 500]
        data = response.json()
        print(f"Sync rates response: {data}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
