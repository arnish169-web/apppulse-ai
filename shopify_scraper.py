import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import datetime
import re
import os

class ShopifyScraper:
    def __init__(self, browsers_path=None):
        if browsers_path:
            os.environ["PLAYWRIGHT_BROWSERS_PATH"] = browsers_path
            
    async def get_page_html(self, url):
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            # Set user agent to avoid bot detection
            await page.set_extra_http_headers({
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
            })
            await page.goto(url, wait_until="networkidle")
            # Wait a bit more for dynamic content
            await asyncio.sleep(2)
            html = await page.content()
            await browser.close()
            return html

    def parse_search_results(self, html):
        soup = BeautifulSoup(html, 'html.parser')
        apps = []
        
        # Look for all links that point to apps
        # Based on my investigation, app links are a good starting point
        links = soup.find_all('a', href=re.compile(r'/([^/?#]+)(\?|$)'))
        
        seen_slugs = set()
        for link in links:
            href = link['href']
            # Normalize href to absolute if relative
            if href.startswith('/'):
                href = 'https://apps.shopify.com' + href
            
            # Extract slug
            match = re.search(r'https://apps\.shopify\.com/([^/?#]+)', href)
            if not match:
                continue
            slug = match.group(1)
            if slug in seen_slugs or slug in ['search', 'categories', 'stories', 'sitemap', 'login', 'cart', 'auth']:
                continue
            
            seen_slugs.add(slug)
            
            # Extract rank from href if present (surface_intra_position)
            rank_match = re.search(r'surface_intra_position=(\d+)', href)
            rank = int(rank_match.group(1)) if rank_match else len(apps) + 1
            
            # Try to find app name in the text
            name = link.get_text(strip=True)
            # If name is empty, try to find it in nested elements
            if not name:
                p_tag = link.find('p')
                if p_tag:
                    name = p_tag.get_text(strip=True)
            
            if not name:
                name = slug.replace('-', ' ').title()
                
            apps.append({
                'slug': slug,
                'name': name,
                'rank': rank,
                'url': href
            })
        
        return apps

    def parse_reviews(self, html):
        soup = BeautifulSoup(html, 'html.parser')
        reviews = []
        
        # Review containers have many classes, but tw-relative.tw-pb-md seems common
        containers = soup.find_all('div', class_=re.compile(r'tw-relative.*tw-pb-md'))
        
        for container in containers:
            try:
                # Rating
                rating_img = container.find('image', alt=re.compile(r'out of 5 stars'))
                if not rating_img:
                    rating_img = container.find('img', alt=re.compile(r'out of 5 stars'))
                
                rating = 5
                if rating_img:
                    rating_match = re.search(r'(\d+) out of 5 stars', rating_img['alt'])
                    if rating_match:
                        rating = int(rating_match.group(1))
                
                # Date
                date_text = ""
                date_elem = container.find(string=re.compile(r'(January|February|March|April|May|June|July|August|September|October|November|December) \d+, \d{4}'))
                if date_elem:
                    date_text = date_elem.strip()
                
                # Title and Body
                # Title is often in quotes or a strong tag
                # Body is in a paragraph
                p_tags = container.find_all('p')
                body = ""
                title = ""
                if p_tags:
                    body = p_tags[-1].get_text(strip=True)
                    if len(p_tags) > 1:
                        title = p_tags[0].get_text(strip=True)
                
                # Author
                # Author name is often after the body in the text
                full_text = container.get_text(separator='|', strip=True)
                parts = full_text.split('|')
                # Usually: Date | Rating | Title | Body | Author | Country | Duration
                # This is fragile, but let's try to find author.
                # In the eval output: Hadiyah Gifting was at the end.
                author = parts[-3] if len(parts) > 3 else "Anonymous"
                
                # Review ID (from Copy link button or similar)
                review_id = f"rev_{hash(full_text)}"
                copy_btn = container.find('button', {'aria-label': 'Copy link to review'})
                # If we can't find a real ID, use a hash

                reviews.append({
                    'id': review_id,
                    'rating': rating,
                    'date': date_text,
                    'title': title,
                    'body': body,
                    'author': author
                })
            except Exception as e:
                print(f"Error parsing review: {e}")
                continue
                
        return reviews

# Test block
if __name__ == "__main__":
    scraper = ShopifyScraper()
    # To be used with local files for testing
    with open('/home/team/shared/scraper/rendered_search.html', 'r') as f:
        apps = scraper.parse_search_results(f.read())
        print(f"Found {len(apps)} apps")
        for a in apps[:5]:
            print(a)
            
    with open('/home/team/shared/scraper/rendered_reviews.html', 'r') as f:
        reviews = scraper.parse_reviews(f.read())
        print(f"Found {len(reviews)} reviews")
        for r in reviews[:5]:
            print(r)
