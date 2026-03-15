import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

async def migrate_kurdish_names():
    load_dotenv()
    mongodb_uri = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongodb_uri)
    db = client.khair_baghdad
    
    countries_collection = db.countries
    
    updates = [
        {
            "code": "TR",
            "name_ku": "تورکیا",
            "methods": {
                "papara": "پاپارا",
                "eft": "EFT",
                "bank": "گواستنەوەی بانکی"
            }
        },
        {
            "code": "EG",
            "name_ku": "میسر",
            "methods": {
                "vodafone_cash": "ڤۆدافۆن کاش",
                "instapay": "ئینستا پەي",
                "bank": "گواستنەوەی بانکی"
            }
        },
        {
            "code": "JO",
            "name_ku": "ئوردن",
            "methods": {
                "cliq": "کلیک",
                "bank": "گواستنەوەی بانکی"
            }
        }
    ]
    
    for update in updates:
        country = await countries_collection.find_one({"country_code": update["code"]})
        if country:
            print(f"Updating Kurdish name for {update['code']}...")
            
            # Update methods
            updated_methods = []
            for m in country.get("transfer_methods", []):
                m_id = m.get("method_id")
                if m_id in update["methods"]:
                    m["name_ku"] = update["methods"][m_id]
                updated_methods.append(m)
            
            await countries_collection.update_one(
                {"country_code": update["code"]},
                {"$set": {
                    "name_ku": update["name_ku"],
                    "transfer_methods": updated_methods
                }}
            )
            print(f"Successfully updated {update['code']}")
        else:
            print(f"Country {update['code']} not found")

    print("Migration complete!")

if __name__ == "__main__":
    asyncio.run(migrate_kurdish_names())
