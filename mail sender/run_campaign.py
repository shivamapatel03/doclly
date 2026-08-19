import os
import sys
import time
import ssl
import smtplib
import config
import send_mails

# Force UTF-8 encoding
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

def main():
    print("=" * 65)
    print("       🚀 DOCLLY BULK EMAIL CAMPAIGN (STUDENT OFFER ₹19)")
    print("=" * 65)

    students = send_mails.load_students_from_csv(config.CSV_FILENAME)
    if not students:
        print("❌ Error: No valid students found in CSV.")
        return

    already_sent = send_mails.get_already_sent_emails()
    pending = [s for s in students if s["email"].lower() not in already_sent]

    print(f"📊 Total Records in CSV : {len(students)}")
    print(f"✅ Already Sent Previously: {len(already_sent)}")
    print(f"📬 Pending to Send      : {len(pending)}")

    if not pending:
        print("\n🎉 All students in this CSV have already received emails!")
        return

    print(f"\n⚡ Starting Automated Sending to {len(pending)} students...")
    print(f"⏱️ Delay between emails: {config.DELAY_SECONDS}s")
    print("-" * 65)

    success_count = 0
    fail_count = 0

    # Batch connection to prevent session timeout
    BATCH_SIZE = 50
    
    for i in range(0, len(pending), BATCH_SIZE):
        batch = pending[i:i + BATCH_SIZE]
        print(f"\n🔄 Connecting SMTP for Batch {i + 1} - {min(i + len(batch), len(pending))} of {len(pending)}...")
        
        try:
            if config.USE_SSL:
                ctx = ssl.create_default_context()
                server = smtplib.SMTP_SSL(config.SMTP_HOST, config.SMTP_PORT, context=ctx)
            else:
                server = smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT)
                server.starttls()
            
            server.login(config.SENDER_EMAIL, config.SENDER_PASSWORD)

            for idx, student in enumerate(batch, i + 1):
                email = student["email"]
                name = student["name"]
                try:
                    print(f"[{idx}/{len(pending)}] Sending to {name} <{email}>...", end="", flush=True)
                    send_mails.send_single_email(server, email, name)
                    send_mails.log_sent_email(email, name, "SENT")
                    success_count += 1
                    print(" ✅ Sent")
                except Exception as e:
                    send_mails.log_sent_email(email, name, f"FAILED: {e}")
                    fail_count += 1
                    print(f" ❌ Failed ({e})")
                
                time.sleep(config.DELAY_SECONDS)

            server.quit()
        except Exception as e:
            print(f"❌ Batch Connection Error: {e}")
            time.sleep(5)

    print("\n" + "=" * 65)
    print("🎉 Campaign Complete!")
    print(f"✅ Successfully Sent: {success_count}")
    if fail_count > 0:
        print(f"❌ Failed Deliveries: {fail_count}")
    print(f"📄 Delivery log saved to: {send_mails.LOG_FILE}")
    print("=" * 65)

if __name__ == "__main__":
    main()
