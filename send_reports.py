import os
import resend
import db_manager

# Set API key
resend.api_key = os.environ.get("RESEND_API_KEY")

def send_weekly_reports():
    print("Sending weekly reports...")
    # Get users and their latest playbook alert
    users = db_manager.run_query(\"\"\"
        SELECT u.email, a.message 
        FROM users u 
        JOIN alerts a ON u.id = a.user_id 
        WHERE a.type = 'Playbook' AND a.is_read = 0
        ORDER BY a.created_at DESC
    \"\"\")
    
    if not users:
        print("No new playbooks to send.")
        return

    for user in users:
        email = user['email']
        playbook = user['message']
        
        try:
            if not resend.api_key:
                print(f"Skipping email to {email} (No Resend API Key)")
                continue
                
            params = {
                "from": "AppPulse AI <onboarding@resend.dev>",
                "to": [email],
                "subject": "Your Weekly Strategic Playbook",
                "html": f\"\"\"
                <h1>AppPulse AI: Strategic Playbook</h1>
                <p>Here are your top 3 competitor intelligence moves for the week:</p>
                <div>{playbook.replace('\\n', '<br>')}</div>
                \"\"\"
            }
            
            resend.Emails.send(params)
            print(f"Report sent to {email}")
        except Exception as e:
            print(f"Error sending report to {email}: {e}")

if __name__ == "__main__":
    send_weekly_reports()
