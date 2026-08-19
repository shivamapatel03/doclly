import os
import sys
import csv
import time
import ssl
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

# Import local configuration
try:
    import config
except ImportError:
    print("[ERROR] config.py not found. Please ensure config.py exists in the same folder.")
    sys.exit(1)

LOG_FILE = "sent_log.csv"

def get_already_sent_emails():
    """Reads sent_log.csv to avoid duplicate sending."""
    sent = set()
    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE, "r", encoding="utf-8") as f:
                reader = csv.reader(f)
                for row in reader:
                    if row:
                        sent.add(row[0].strip().lower())
        except Exception as e:
            print(f"[WARN] Error reading log file: {e}")
    return sent

def log_sent_email(email, name, status="SENT"):
    """Logs sent email to sent_log.csv."""
    try:
        file_exists = os.path.exists(LOG_FILE)
        with open(LOG_FILE, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(["Email", "Name", "Timestamp", "Status"])
            writer.writerow([email, name, time.strftime("%Y-%m-%d %H:%M:%S"), status])
    except Exception as e:
        print(f"[WARN] Could not log email: {e}")

def detect_csv_file():
    """Finds CSV file in the current directory."""
    target = config.CSV_FILENAME
    if os.path.exists(target):
        return target
    
    # Search for any .csv file in current folder
    csv_files = [f for f in os.listdir(".") if f.endswith(".csv") and f != LOG_FILE]
    if csv_files:
        return csv_files[0]
    return None

def find_column(headers, possible_names):
    """Finds column index matching possible name variations."""
    for idx, h in enumerate(headers):
        clean = h.strip().lower().replace(" ", "").replace("_", "").replace("-", "")
        for target in possible_names:
            if target in clean:
                return idx
    return None

def load_students_from_csv(csv_path):
    """Parses students list with automatic column detection."""
    students = []
    with open(csv_path, "r", encoding="utf-8-sig", errors="ignore") as f:
        reader = csv.reader(f)
        headers = next(reader, None)
        if not headers:
            return []

        email_col = find_column(headers, ["email", "mail", "studentemail"])
        name_col = find_column(headers, ["name", "studentname", "fullname", "firstname"])

        if email_col is None:
            print("[INFO] Scanning for email pattern in first column...")
            email_col = 0

        for row in reader:
            if not row or len(row) <= email_col:
                continue
            email = row[email_col].strip()
            name = row[name_col].strip() if (name_col is not None and len(row) > name_col) else "Student"
            if "@" in email and "." in email:
                students.append({"email": email, "name": name if name else "Student"})

    return students

def generate_email_content(name):
    """Generates modern, high-converting HTML email with Button 20 CSS and official Doclly logo."""
    display_name = name.strip() if name and name.lower() != "student" else "Student"
    
    subject = f"🎓 {display_name}, your 1-Year Doclly Pro pass for ₹19 (98% Off)"
    
    html_body = f"""<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Doclly Student Offer</title>
</head>
<body style="margin:0; padding:24px 10px; background-color:#F8FAFC; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#0F172A;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:540px; background-color:#FFFFFF; border:1px solid #E2E8F0; border-radius:18px; box-shadow:0 4px 20px rgba(0,0,0,0.04); overflow:hidden;">
          
          <!-- Top Header with Official Logo & Button 20 Styled Badge -->
          <tr>
            <td style="padding:22px 28px; background-color:#FFFFFF; border-bottom:1px solid #F1F5F9;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" valign="middle">
                    <a href="https://student.doclly.online" target="_blank" style="text-decoration:none;">
                      <img src="https://www.doclly.online/logo/text.png" alt="Doclly" height="28" style="display:block; height:28px; width:auto; border:0;" />
                    </a>
                  </td>
                  <td align="right" valign="middle">
                    <!-- Button 20 Tactile Badge -->
                    <span style="display:inline-block; font-size:11.5px; font-weight:800; background-color:#FFC800; background-image:linear-gradient(180deg, #FFD84D 0%, #FFC800 100%); color:#111111; padding:6px 14px; border-radius:9999px; text-transform:uppercase; letter-spacing:0.4px; border:1px solid #DC9F00; box-shadow:inset 0 1px 0 rgba(255,255,255,0.45), 0 2px 4px rgba(0,0,0,0.08);">
                      🎓 Student Pass
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:32px 28px 24px 28px;">
              <!-- Headline -->
              <h1 style="font-size:22px; font-weight:900; color:#0F172A; margin:0 0 6px 0; line-height:1.3; letter-spacing:-0.5px;">
                Get 1 Year of Doclly Pro for Just ₹19
              </h1>
              
              <div style="font-size:12.5px; font-weight:700; color:#D97706; margin-bottom:18px;">
                ⚡ Limited 2-Month Promotional Offer • Save 98% (Regular ₹799/yr)
              </div>

              <!-- Greeting & Intro -->
              <p style="font-size:14px; line-height:1.6; color:#475569; margin:0 0 20px 0;">
                Hi <strong>{display_name}</strong>,<br />
                We know how expensive PDF software is during college semesters. For the next 2 months, all verified students can unlock <strong>365 days of full Doclly Pro features</strong> for a one-time ₹19 pass.
              </p>

              <!-- Feature Highlights Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:14px; margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <div style="font-size:11px; font-weight:800; color:#64748B; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px;">
                      What's Included in your 1-Year Pass:
                    </div>
                    
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:6px 0; font-size:13.5px; color:#1E293B; line-height:1.4;">
                          ✍️ <strong>Edit Scanned PDFs</strong> — In-place text editing directly on the page like MS Word
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; font-size:13.5px; color:#1E293B; line-height:1.4;">
                          📉 <strong>Extreme &lt;200 KB Compression</strong> — Shrink large PDFs for university &amp; exam portals
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; font-size:13.5px; color:#1E293B; line-height:1.4;">
                          🔄 <strong>Universal Conversions</strong> — PDF &harr; Word (.docx), Excel (.xlsx), PPT, &amp; JPG
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; font-size:13.5px; color:#1E293B; line-height:1.4;">
                          ⚡ <strong>100+ Batch Queue</strong> — Convert or merge all lecture notes simultaneously in 1 click
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0; font-size:13.5px; color:#1E293B; line-height:1.4;">
                          🔒 <strong>100% Client-Side Privacy</strong> — Files never leave your browser memory
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Call To Action Button (Button 20 Tactile CSS) -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:26px 0 16px 0;">
                <tr>
                  <td align="center">
                    <a href="https://student.doclly.online" target="_blank" style="background-color:#FFC800; background-image:linear-gradient(180deg, #FFD84D 0%, #FFC800 100%); color:#111111; font-size:15px; font-weight:900; text-decoration:none; padding:14px 42px; border-radius:9999px; border:1.5px solid #DC9F00; display:inline-block; box-shadow:inset 0 1px 0 rgba(255,255,255,0.45), 0 3px 8px rgba(0,0,0,0.12); letter-spacing:-0.2px;">
                      Claim 1-Year Pro for ₹19 &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:12px; text-align:center; color:#64748B; margin:0;">
                Instant UPI Payment (GPay, PhonePe, Paytm) &bull; 1-Click ID Verification
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#F8FAFC; padding:20px 28px; text-align:center; border-top:1px solid #F1F5F9; font-size:11.5px; color:#94A3B8; line-height:1.6;">
              &copy; {time.strftime('%Y')} Doclly Document Suite &bull; Made with ❤️ in India<br />
              <a href="https://student.doclly.online" style="color:#64748B; text-decoration:underline;">student.doclly.online</a> &bull; 
              <a href="https://www.doclly.online/terms" style="color:#64748B; text-decoration:underline;">Terms</a> &bull; 
              <a href="https://www.doclly.online/privacy" style="color:#64748B; text-decoration:underline;">Privacy</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    plain_text = f"""Hi {display_name},

We know how expensive PDF software is during college semesters. For the next 2 months, all verified students can unlock 365 days of full Doclly Pro features (worth ₹799) for a one-time ₹19 pass.

✨ What's included in your 1-Year Pass:
• ✍️ Edit Scanned PDFs — In-place text editing like MS Word
• 📉 Extreme <200 KB Compression — For university & exam portal uploads
• 🔄 Universal Conversions — PDF <-> Word (.docx), Excel (.xlsx), PPT & JPG
• ⚡ 100+ Batch Queue — Convert or merge all lecture notes in 1 click
• 🔒 100% Client-Side Privacy — Documents are processed in-memory

👉 Claim your ₹19 Student Pro Plan here:
https://student.doclly.online

Best regards,
The Doclly Team
https://www.doclly.online"""

    return subject, html_body, plain_text

def send_single_email(server, recipient_email, recipient_name):
    """Sends a single personalized email via active SMTP connection."""
    subject, html_content, plain_content = generate_email_content(recipient_name)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = formataddr((config.SENDER_NAME, config.SENDER_EMAIL))
    msg["To"] = formataddr((recipient_name, recipient_email))

    part1 = MIMEText(plain_content, "plain", "utf-8")
    part2 = MIMEText(html_content, "html", "utf-8")
    msg.attach(part1)
    msg.attach(part2)

    server.sendmail(config.SENDER_EMAIL, recipient_email, msg.as_string())

def main():
    print("=" * 65)
    print("       🚀 DOCLLY BULK EMAIL SENDER (STUDENT OFFER ₹19)")
    print("=" * 65)

    # 1. Validation Checks
    if not config.SENDER_EMAIL or "your-email" in config.SENDER_EMAIL:
        print("\n❌ Error: Please configure SENDER_EMAIL and SENDER_PASSWORD in 'config.py'.")
        print("💡 Open 'mail sender/config.py' and enter your sender email credentials.")
        return

    csv_path = detect_csv_file()
    if not csv_path:
        print("\n❌ Error: No CSV file found in 'mail sender' directory!")
        print("👉 Please copy your student CSV file into this folder and name it 'students.csv'.")
        return

    print(f"\n📂 Found student list file: {csv_path}")
    students = load_students_from_csv(csv_path)
    if not students:
        print("❌ Error: No valid email records found in CSV.")
        return

    already_sent = get_already_sent_emails()
    pending = [s for s in students if s["email"].lower() not in already_sent]

    print(f"📊 Total Records in CSV : {len(students)}")
    print(f"✅ Already Sent Previously: {len(already_sent)}")
    print(f"📬 Remaining to Send    : {len(pending)}")

    if not pending:
        print("\n🎉 All students in this CSV have already received emails! Nothing left to send.")
        return

    # 2. Test Email Prompt
    print("\n" + "-" * 65)
    test_choice = input("👉 Would you like to send a TEST email to your own inbox first? (y/n) [Default: y]: ").strip().lower()
    if test_choice != "n":
        test_email = input(f"Enter test recipient email [Default: {config.SENDER_EMAIL}]: ").strip()
        if not test_email:
            test_email = config.SENDER_EMAIL
        
        print(f"\n📨 Connecting to SMTP ({config.SMTP_HOST}:{config.SMTP_PORT}) to send test email...")
        try:
            if config.USE_SSL:
                ctx = ssl.create_default_context()
                with smtplib.SMTP_SSL(config.SMTP_HOST, config.SMTP_PORT, context=ctx) as s:
                    s.login(config.SENDER_EMAIL, config.SENDER_PASSWORD)
                    send_single_email(s, test_email, "Test Student")
            else:
                with smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT) as s:
                    s.starttls()
                    s.login(config.SENDER_EMAIL, config.SENDER_PASSWORD)
                    send_single_email(s, test_email, "Test Student")
            print(f"✅ Test email successfully sent to {test_email}! Check your inbox/spam.")
        except Exception as e:
            print(f"\n❌ SMTP Connection Failed: {e}")
            print("💡 Tip for Gmail: Ensure you are using an 'App Password' from https://myaccount.google.com/apppasswords")
            return

    # 3. Confirm Bulk Blast
    print("\n" + "-" * 65)
    confirm = input(f"🚀 Ready to send {len(pending)} student emails? Type 'yes' to proceed: ").strip().lower()
    if confirm != "yes":
        print("🛑 Sending cancelled by user.")
        return

    print("\n⚡ Starting Bulk Sending...")
    success_count = 0
    fail_count = 0

    try:
        # Open persistent SMTP connection
        if config.USE_SSL:
            ctx = ssl.create_default_context()
            server = smtplib.SMTP_SSL(config.SMTP_HOST, config.SMTP_PORT, context=ctx)
        else:
            server = smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT)
            server.starttls()
        
        server.login(config.SENDER_EMAIL, config.SENDER_PASSWORD)

        for idx, student in enumerate(pending, 1):
            email = student["email"]
            name = student["name"]
            try:
                print(f"[{idx}/{len(pending)}] Sending to {name} <{email}>...", end="", flush=True)
                send_single_email(server, email, name)
                log_sent_email(email, name, "SENT")
                success_count += 1
                print(" ✅ Sent")
            except Exception as e:
                log_sent_email(email, name, f"FAILED: {e}")
                fail_count += 1
                print(f" ❌ Failed ({e})")
            
            time.sleep(config.DELAY_SECONDS)

        server.quit()
        print("\n" + "=" * 65)
        print(f"🎉 Campaign Complete!")
        print(f"✅ Successfully Sent: {success_count}")
        if fail_count > 0:
            print(f"❌ Failed Deliveries: {fail_count}")
        print(f"📄 Delivery log saved to: {LOG_FILE}")
        print("=" * 65)

    except Exception as e:
        print(f"\n❌ SMTP Session Error: {e}")

if __name__ == "__main__":
    main()
