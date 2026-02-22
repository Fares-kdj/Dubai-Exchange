"""
Backend API Tests for Dubai International Exchange
Tests for exchange rates and live fetch endpoints
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://forex-admin-system.preview.emergentagent.com').rstrip('/')


class TestRatesAPI:
    """Exchange Rates API Tests"""
    
    def test_get_rates_endpoint(self):
        """Test GET /api/rates returns list of exchange rates"""
        response = requests.get(f"{BASE_URL}/api/rates")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Verify rate structure
        first_rate = data[0]
        assert "currency_code" in first_rate
        assert "currency_name_ar" in first_rate
        assert "currency_name_en" in first_rate
        assert "buy_rate" in first_rate
        assert "sell_rate" in first_rate
        assert "flag" in first_rate
        print(f"✓ GET /api/rates returned {len(data)} rates")
    
    def test_get_single_rate(self):
        """Test GET /api/rates/{currency_code} returns single rate"""
        response = requests.get(f"{BASE_URL}/api/rates/USD")
        assert response.status_code == 200
        
        data = response.json()
        assert data["currency_code"] == "USD"
        assert data["currency_name_en"] == "US Dollar"
        assert data["buy_rate"] > 0
        assert data["sell_rate"] > 0
        print(f"✓ GET /api/rates/USD returned: buy={data['buy_rate']}, sell={data['sell_rate']}")
    
    def test_get_nonexistent_rate(self):
        """Test GET /api/rates/{invalid} returns 404"""
        response = requests.get(f"{BASE_URL}/api/rates/INVALID")
        assert response.status_code == 404
        print("✓ GET /api/rates/INVALID correctly returned 404")
    
    def test_live_fetch_endpoint(self):
        """Test GET /api/rates/live/fetch returns rates with source"""
        response = requests.get(f"{BASE_URL}/api/rates/live/fetch")
        assert response.status_code == 200
        
        data = response.json()
        assert "source" in data
        assert "rates" in data
        assert data["source"] in ["manual", "live", "fallback"]
        assert isinstance(data["rates"], list)
        assert len(data["rates"]) > 0
        print(f"✓ GET /api/rates/live/fetch returned source={data['source']}, {len(data['rates'])} rates")
    
    def test_rate_mode_settings(self):
        """Test GET /api/rates/settings/mode returns mode settings"""
        response = requests.get(f"{BASE_URL}/api/rates/settings/mode")
        assert response.status_code == 200
        
        data = response.json()
        assert "mode" in data
        assert data["mode"] in ["manual", "auto"]
        print(f"✓ GET /api/rates/settings/mode returned mode={data['mode']}")


class TestHealthEndpoints:
    """Health and basic endpoint tests"""
    
    def test_api_health(self):
        """Test API is responding"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        print("✓ API health check passed")
    
    def test_cms_contact_endpoint(self):
        """Test CMS contact endpoint (may return 404 if not configured)"""
        response = requests.get(f"{BASE_URL}/api/cms/contact")
        # Either 200 (configured) or 404 (not configured) is acceptable
        assert response.status_code in [200, 404]
        print(f"✓ GET /api/cms/contact returned {response.status_code}")
    
    def test_cms_terms_endpoint(self):
        """Test CMS terms endpoint (may return 404 if not configured)"""
        response = requests.get(f"{BASE_URL}/api/cms/terms")
        # Either 200 (configured) or 404 (not configured) is acceptable
        assert response.status_code in [200, 404]
        print(f"✓ GET /api/cms/terms returned {response.status_code}")


class TestCurrencyConversion:
    """Test currency conversion logic via API"""
    
    def test_usd_to_iqd_rate(self):
        """Verify USD to IQD conversion rate is reasonable"""
        response = requests.get(f"{BASE_URL}/api/rates/USD")
        assert response.status_code == 200
        
        data = response.json()
        buy_rate = data["buy_rate"]
        sell_rate = data["sell_rate"]
        
        # IQD rates should be in reasonable range (1000-2000 per USD)
        assert 1000 <= buy_rate <= 2000, f"USD buy rate {buy_rate} out of expected range"
        assert 1000 <= sell_rate <= 2000, f"USD sell rate {sell_rate} out of expected range"
        assert sell_rate >= buy_rate, "Sell rate should be >= buy rate"
        print(f"✓ USD rates are reasonable: buy={buy_rate}, sell={sell_rate}")
    
    def test_multiple_currencies_available(self):
        """Verify multiple currencies are available"""
        response = requests.get(f"{BASE_URL}/api/rates")
        assert response.status_code == 200
        
        data = response.json()
        currency_codes = [r["currency_code"] for r in data]
        
        # Should have at least USD, EUR, GBP
        expected_currencies = ["USD", "EUR", "GBP"]
        for currency in expected_currencies:
            assert currency in currency_codes, f"{currency} not found in rates"
        
        print(f"✓ Found expected currencies: {expected_currencies}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
