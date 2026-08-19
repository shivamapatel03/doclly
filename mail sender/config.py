# ==============================================================================
# DOCLLY STUDENT OFFER - EMAIL SENDER CONFIGURATION
# ==============================================================================

# 1. YOUR SENDER EMAIL (e.g. your Gmail or Custom Domain email)
SENDER_EMAIL = "teamdoclly@gmail.com"

# 2. APP PASSWORD / SMTP PASSWORD
# For Gmail: Go to https://myaccount.google.com/apppasswords -> Create an "App Password"
SENDER_PASSWORD = "xfhv locx dkwh rsiq"

# 3. SENDER DISPLAY NAME
SENDER_NAME = "Doclly Student Team"

# 4. SMTP SERVER SETTINGS
# Defaults are configured for Gmail (smtp.gmail.com: 465 SSL or 587 TLS)
# For Hostinger: smtp.hostinger.com (Port 465)
# For Outlook / Office 365: smtp.office365.com (Port 587)
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465
USE_SSL = True  # Set to False if using Port 587 (STARTTLS)

# 5. SENDING SETTINGS
# Delay between each email in seconds (prevents rate-limiting / spam flags)
DELAY_SECONDS = 1.5

# CSV Filename to read students from (searches in current directory)
CSV_FILENAME = "student.csv"
