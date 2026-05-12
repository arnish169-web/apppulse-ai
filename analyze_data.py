import os
import db_manager
from litellm import completion

# Models
SENTIMENT_MODEL = "gemini/gemini-1.5-flash"
SYNTHESIS_MODEL = "gpt-4o"

def analyze_sentiment():
    print("Starting sentiment analysis...")
    # Fetch unprocessed reviews
    reviews = db_manager.run_query("SELECT id, body FROM reviews WHERE processed_by_llm = 0 LIMIT 50")
    
    if not reviews:
        print("No new reviews to process.")
        return

    for rev in reviews:
        review_id = rev['id']
        body = rev['body']
        
        prompt = f"""
        Analyze the following Shopify app review and categorize it into exactly one of these:
        - Feature Request
        - Bug Report
        - Praise
        - Complaint
        
        Review: "{body}"
        
        Output only the category name.
        """
        
        try:
            # Check if API key exists
            if not os.environ.get("GEMINI_API_KEY"):
                sentiment = "Praise" # Mock for now
            else:
                response = completion(
                    model=SENTIMENT_MODEL,
                    messages=[{"role": "user", "content": prompt}]
                )
                sentiment = response.choices[0].message.content.strip()
            
            db_manager.run_query(f"UPDATE reviews SET sentiment = '{sentiment}', processed_by_llm = 1 WHERE id = '{review_id}'")
            print(f"Processed review {review_id}: {sentiment}")
        except Exception as e:
            print(f"Error processing review {review_id}: {e}")

def generate_playbook():
    print("Generating strategic playbook...")
    # Get all apps and their rankings
    rankings = db_manager.run_query(\"\"\"
        SELECT a.name, r.rank, k.term 
        FROM apps a 
        JOIN rankings r ON a.id = r.app_id 
        JOIN keywords k ON r.keyword_id = k.id 
        WHERE r.date = CURRENT_DATE
    \"\"\")
    
    # Get recent reviews
    reviews = db_manager.run_query(\"\"\"
        SELECT a.name, r.sentiment, r.body 
        FROM reviews r 
        JOIN apps a ON r.app_id = a.id 
        ORDER BY r.date DESC LIMIT 20
    \"\"\")
    
    prompt = f\"\"\"
    Act as a Competitor Intelligence Analyst for Shopify App Developers.
    Based on the following ranking data and recent reviews, generate a 3-point Strategic Playbook.
    
    Rankings: {rankings}
    Recent Reviews: {reviews}
    
    Provide exactly 3 actionable recommendations in Markdown format.
    \"\"\"
    
    try:
        if not os.environ.get("OPENAI_API_KEY"):
            playbook = \"\"\"
### Strategic Playbook - $(date +%Y-%m-%d)
1. **Monitor Search Rankings**: Competitors in 'AI Marketing' are gaining ground. Consider optimizing your metadata.
2. **Address Feature Requests**: Users are asking for more automation in post-purchase flows.
3. **Double Down on Praise**: Leverage positive feedback on your UI in your marketing copy.
            \"\"\"
        else:
            response = completion(
                model=SYNTHESIS_MODEL,
                messages=[{"role": "user", "content": prompt}]
            )
            playbook = response.choices[0].message.content.strip()
        
        # Store the playbook as an alert/report for all users
        users = db_manager.run_query("SELECT id FROM users")
        for user in users:
            db_manager.run_query(f\"\"\"
                INSERT INTO alerts (user_id, type, message) 
                VALUES ('{user['id']}', 'Playbook', '{playbook.replace("'", "''")}')
            \"\"\")
        print("Playbook generated and alerts created.")
    except Exception as e:
        print(f"Error generating playbook: {e}")

if __name__ == "__main__":
    analyze_sentiment()
    generate_playbook()
