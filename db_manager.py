import subprocess
import json

def escape(s):
    if s is None:
        return "NULL"
    if isinstance(s, str):
        return "'" + s.replace("'", "''") + "'"
    return str(s)

def run_query(query):
    try:
        result = subprocess.check_output(['team-db', query], stderr=subprocess.STDOUT)
        return json.loads(result)
    except subprocess.CalledProcessError as e:
        print(f"Error running query: {e.output.decode()}")
        return None
    except json.JSONDecodeError:
        return None

def upsert_app(app_id, name, developer_name=None, icon_url=None, current_rating=None, review_count=None):
    query = f"""
    INSERT INTO apps (id, name, developer_name, icon_url, current_rating, review_count)
    VALUES ({escape(app_id)}, {escape(name)}, {escape(developer_name)}, {escape(icon_url)}, {current_rating if current_rating is not None else 'NULL'}, {review_count if review_count is not None else 'NULL'})
    ON CONFLICT(id) DO UPDATE SET
        name=excluded.name,
        developer_name=excluded.developer_name,
        icon_url=excluded.icon_url,
        current_rating=excluded.current_rating,
        review_count=excluded.review_count;
    """
    return run_query(query)

def get_or_create_keyword(term):
    # Try to find keyword
    result = run_query(f"SELECT id FROM keywords WHERE term = {escape(term)}")
    if result and len(result) > 0:
        return result[0]['id']
    
    # Create if not exists
    run_query(f"INSERT INTO keywords (term) VALUES ({escape(term)})")
    result = run_query(f"SELECT id FROM keywords WHERE term = {escape(term)}")
    return result[0]['id'] if result else None

def record_ranking(app_id, keyword_id, rank):
    query = f"INSERT INTO rankings (app_id, keyword_id, rank) VALUES ({escape(app_id)}, {keyword_id}, {rank})"
    return run_query(query)

def record_review(review_id, app_id, author, rating, title, body, date, sentiment=None):
    query = f"""
    INSERT INTO reviews (id, app_id, author, rating, title, body, date, sentiment)
    VALUES ({escape(review_id)}, {escape(app_id)}, {escape(author)}, {rating}, {escape(title)}, {escape(body)}, {escape(date)}, {escape(sentiment)})
    ON CONFLICT(id) DO NOTHING;
    """
    return run_query(query)
