import asyncio
import sys
import os
from shopify_scraper import ShopifyScraper
import db_manager

async def main():
    scraper = ShopifyScraper()
    
    # 1. Get keywords from DB
    keywords_data = db_manager.run_query("SELECT id, term FROM keywords")
    if not keywords_data:
        print("No keywords found in database.")
        return

    for kw in keywords_data:
        keyword_id = kw['id']
        term = kw['term']
        print(f"Scraping rankings for: {term}")
        
        url = f"https://apps.shopify.com/search?q={term.replace(' ', '+')}"
        try:
            html = await scraper.get_page_html(url)
            apps = scraper.parse_search_results(html)
            
            print(f"Found {len(apps)} apps for '{term}'")
            
            for app in apps:
                # Upsert app metadata
                db_manager.upsert_app(
                    app_id=app['slug'],
                    name=app['name']
                )
                # Record ranking
                db_manager.record_ranking(
                    app_id=app['slug'],
                    keyword_id=keyword_id,
                    rank=app['rank']
                )
                
                # For the top 3 apps, let's also grab reviews
                if app['rank'] <= 3:
                    print(f"  Scraping reviews for: {app['slug']}")
                    reviews_url = f"https://apps.shopify.com/{app['slug']}/reviews"
                    try:
                        reviews_html = await scraper.get_page_html(reviews_url)
                        reviews = scraper.parse_reviews(reviews_html)
                        print(f"    Found {len(reviews)} reviews")
                        for rev in reviews:
                            db_manager.record_review(
                                review_id=rev['id'],
                                app_id=app['slug'],
                                author=rev['author'],
                                rating=rev['rating'],
                                title=rev['title'],
                                body=rev['body'],
                                date=rev['date']
                            )
                    except Exception as e:
                        print(f"    Error scraping reviews for {app['slug']}: {e}")
                        
        except Exception as e:
            print(f"Error scraping keyword '{term}': {e}")

    # 2. Run analysis
    print("Running analysis pipeline...")
    import analyze_data
    analyze_data.analyze_sentiment()
    analyze_data.generate_playbook()
    
    # 3. Send reports (if it's a reporting day, here we just run it)
    print("Running reporting pipeline...")
    import send_reports
    send_reports.send_weekly_reports()

if __name__ == "__main__":
    # Ensure we use the correct browsers path for Playwright if needed
    # (Though we installed it in the venv earlier)
    asyncio.run(main())
