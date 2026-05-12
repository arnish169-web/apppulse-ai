from bs4 import BeautifulSoup

with open('/home/team/shared/scraper/rendered_search.html', 'r') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

# Find app cards
# Looking at common classes in the rendered HTML
cards = soup.find_all('div', {'data-test-id': 'app-card'})
if not cards:
    # Try searching for app names we saw in the screenshot
    kaching = soup.find(string=lambda t: t and "Kaching Bundles" in t)
    if kaching:
        parent = kaching.parent
        # Go up until we find a container that looks like a card
        # Commonly app cards are links or divs with specific classes
        for i in range(10):
            parent = parent.parent
            if parent.name in ['div', 'a']:
                print(f"Parent {i}: {parent.name} class={parent.get('class')}")

# Let's try to find all links that go to /apps/
links = soup.find_all('a', href=lambda h: h and '/apps/' in h)
for link in links[:10]:
    print(f"App link: {link['href']} text={link.get_text(strip=True)}")
