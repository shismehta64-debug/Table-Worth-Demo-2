# 📩 How to Setup EmailJS For Your Table Worth Website

Hello! I have fully engineered your website's contact form to send automated emails purely from the browser using a service called **EmailJS**. You no longer need a complicated backend server (like PHP or Node) to handle your leads!

Everything in the code is ready. You just need to create an EmailJS account and grab three special text "keys" to connect it to your `info@twhospitality.in` email.

Follow this simple, step-by-step guide below:

---

## Step 1: Create Your Free EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/) and click **Sign Up Free**.
2. Fill in your details (you can use your `info@twhospitality.in` or personal email to register).

## Step 2: Connect Your Webmail via "SMTP"
Since your email (`info@twhospitality.in`) is hosted on Webmail (like cPanel, HostMonster, GoDaddy, etc.) and not Gmail, we will connect it manually via SMTP!

1. Once logged in, click **Email Services** on the left dashboard.
2. Click **Add New Service**.
3. Scroll down and choose **SMTP** as your provider.
4. A configuration window will appear. You will need to fill it in with your Webmail Server Details (you can usually find these inside your Webmail "Connect Devices", "Client Configuration", or "Email Routing" settings):
    * **Name**: Table Worth Webmail
    * **Service ID**: Leave as default (it starts with `service_`) 
    * **Host**: Usually `mail.twhospitality.in` (check your hosting provider)
    * **Port**: `465` (for SSL) or `587` (for TLS)
    * **Username**: `info@twhospitality.in`
    * **Password**: The actual webmail password you use to log in to read emails.
5. Click **Create** or **Connect Account**.
6. Look at the `Service ID` setting generated for this connection (it usually looks like `service_xxxxxx`). 
   👉 **COPY THIS `Service ID` DOWN.** You will need it later. It is your first key!

## Step 3: Create Your Email Template
This step tells EmailJS *what* the email should look like when you receive it in your inbox.
1. Click **Email Templates** on the left dashboard.
2. Click **Create New Template**.
3. You will see a basic email editor. Under the **Content** tab, make your template look exactly like this so the form fields match the website correctly:

**To Email:** 
`info@twhospitality.in`

**Subject:**
`New Inquiry from {{name}}: {{subject}}`

**Message Body:**
```
You got a new lead from the Table Worth Website!

Name: {{name}}
Company: {{company}}
Email: {{email}}
Phone: {{phone}}
Subject: {{subject}}

Message:
{{body}}
```

*Note: The website form uses exactly those names (name, company, email, phone, subject, body). So {{name}} will automatically populate with whatever the user types.*

4. Click **Save** in the top right.
5. Once saved, look at the top left of the screen for the `Template ID` (it usually looks like `template_xxxxxx`). 
   👉 **COPY THIS `Template ID` DOWN.** You will need it later. It is your second key!

## Step 4: Get Your Public Key
1. Go to the **Account** tab on the bottom left of your dashboard.
2. Under the API Keys section, you will see your `Public Key` (it is a long string of random letters and numbers).
   👉 **COPY THIS `Public Key` DOWN.** This is your third and final key!

---

## Step 5: Final Step - Put The Keys In Your Website!
Now that you have your 3 keys, open the project folder and navigate to:
▶️ `js/main.js`

Scroll down to the *very bottom* of the file (around line 144) where you will see the `// --- EmailJS Contact Form Handler ---`.

**Make these 3 changes:**

1. **Replace the Public Key:**
   Find `emailjs.init("YOUR_PUBLIC_KEY_HERE");`
   Change `"YOUR_PUBLIC_KEY_HERE"` to the `Public Key` you copied in Step 4.

2. **Replace the Service and Template IDs:**
   Find `emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)`
   Change `'YOUR_SERVICE_ID'` to the Service ID you copied in Step 2.
   Change `'YOUR_TEMPLATE_ID'` to the Template ID you copied in Step 3.

**Important Note:** Make sure you keep the standard quote marks `' '` around the keys when you paste them!

---
🥂 **YOU'RE DONE!** 

Save the `js/main.js` file, open your website, and try submitting the form! The "Send" button will now automatically change color and state instantly and the email will show up right in `info@twhospitality.in`.
