# 📧 Doclly Bulk Mail Sender (Student Offer ₹19)

A ready-to-use, zero-dependency Python tool to send personalized, high-converting HTML emails to your student email CSV list.

---

### 📁 Files in this Folder:

* **`config.py`**: Your sender email & SMTP password settings.
* **`send_mails.py`**: The main sending script with auto-retry, anti-spam delay, HTML templates, and duplicate prevention.
* **`sample_students.csv`**: Example CSV format.
* **`sent_log.csv`**: Automatically created log file recording all sent emails with timestamps.

---

## ⚡ Quick 3-Step Setup:

### 1️⃣ Paste Your Student CSV File
* Copy your CSV file into this `mail sender` folder and rename it to **`students.csv`** (or any `.csv` name).
* The script automatically detects columns for **Email** and **Name**.

---

### 2️⃣ Configure Your Sender Credentials in `config.py`
Open `config.py` and set:
```python
SENDER_EMAIL = "your-email@gmail.com"
SENDER_PASSWORD = "xxxx xxxx xxxx xxxx"  # Your 16-character Gmail App Password
```

#### 🔑 How to get a Gmail 16-character App Password:
1. Go to **https://myaccount.google.com/security**
2. Turn on **2-Step Verification** (if not already enabled).
3. Search or go to **https://myaccount.google.com/apppasswords**
4. App Name: Type `Doclly Mailer` $\rightarrow$ Click **Create**.
5. Copy the 16-character password (e.g. `abcd efgh ijkl mnop`) and paste into `config.py`.

*(If using Hostinger or Custom domain, set `SMTP_HOST = "smtp.hostinger.com"` and your email password).*

---

### 3️⃣ Run the Sender Script

Open terminal and run:
```bash
python send_mails.py
```

### ✨ Features Included:
* **Test Mode**: Allows you to send a single test email to your own email first to preview the formatting.
* **Deduplication**: Never sends twice to the same email even if you re-run or restart the script.
* **Anti-Spam Delay**: Automatically spaces out emails by 1.5 seconds to protect domain reputation.
* **Mobile-Responsive HTML**: Branded card layout with direct 1-click CTA button linking to `https://student.doclly.online`.
