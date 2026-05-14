# Garv Urja Solutions — Lead Management & CRM Setup Plan

## Objective

Create a professional no-code / low-code lead management system for:

* Contact Us forms
* Book Consultation forms
* Quote Requests
* Newsletter subscriptions

while keeping the existing premium website UI unchanged.

---

# Recommended Architecture

```txt
Custom Website Form UI
        ↓
Webhook Submission
        ↓
Zoho Flow
        ↓
Zoho CRM
        ↓
1. Lead Storage
2. Sales Notifications
3. Auto Email Replies
4. Newsletter Audience
5. CRM Pipeline
```

---

# Recommended Stack

| Purpose                  | Tool                      |
| ------------------------ | ------------------------- |
| Forms UI                 | Existing Next.js frontend |
| Automation Layer         | Zoho Flow                 |
| CRM                      | Zoho CRM                  |
| Forms/Workflow           | Zoho Flow Webhook         |
| Newsletter Emails        | Zoho Campaigns            |
| Optional Marketing Later | Brevo                     |

---

# Why This Architecture

## Keep Existing UI

The current website already has:

* premium design
* cinematic branding
* custom animations
* mobile responsiveness

Replacing forms with embedded CRM forms would reduce design quality.

---

# What Happens When User Submits Form

## Example

User fills:

* Name
* Phone
* Email
* Project Type
* Message

and clicks:

```txt
Send Enquiry
```

---

# Automated Workflow

## 1. Lead Stored in Zoho CRM

Lead appears automatically inside CRM dashboard.

Example statuses:

* New
* Contacted
* Site Visit
* Proposal Sent
* Won/Lost

---

## 2. Customer Gets Automatic Email

Example:

```txt
Subject: Thank You for Contacting Garv Urja Solutions

Thank you for reaching out.

Our solar consultant will contact you shortly.
```

---

## 3. Sales Team Gets Notification

Example:

```txt
New Solar Lead Received

Name: Rahul Sharma
Phone: 98XXXXXX
Project: Residential Solar
```

Recipients:

* [sales@garvurja.com](mailto:sales@garvurja.com)
* [founder@garvurja.com](mailto:founder@garvurja.com)
* regional managers

---

## 4. Newsletter / Marketing Audience

Customer automatically added to:

* Zoho Campaigns
* future email campaigns
* educational newsletters
* promotional updates

---

# Recommended Zoho Products

## 1. Zoho CRM

Website:
[https://www.zoho.com/crm/](https://www.zoho.com/crm/)

Purpose:

* lead management
* sales pipeline
* customer database
* team collaboration

---

## 2. Zoho Flow

Website:
[https://www.zoho.com/flow/](https://www.zoho.com/flow/)

Purpose:

* connect website forms to CRM
* automate workflows
* reduce coding effort

---

## 3. Zoho Campaigns

Website:
[https://www.zoho.com/campaigns/](https://www.zoho.com/campaigns/)

Purpose:

* newsletters
* email marketing
* subscription campaigns

---

# Technical Flow

## Frontend

Current custom form remains unchanged.

---

## Submission Logic

Frontend sends form data to:

```txt
Zoho Flow Webhook URL
```

using:

```txt
POST request
```

---

# Example Payload

```json
{
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "email": "rahul@gmail.com",
  "projectType": "Residential",
  "message": "Need rooftop solar consultation"
}
```

---

# Benefits of This Setup

## Immediate Benefits

✅ No heavy backend setup
✅ Keep premium website design
✅ CRM operational workflow
✅ Automated emails
✅ Sales notifications
✅ Newsletter system
✅ Scalable architecture

---

# Future Scalability

Later you can add:

* WhatsApp automation
* quotation systems
* lead assignment
* regional routing
* field engineer scheduling
* analytics dashboards
* AI lead scoring
* customer portals

without redesigning frontend architecture.

---

# Recommended Implementation Order

## Phase 1

* Setup Zoho CRM
* Setup Zoho Flow
* Create webhook
* Connect website form
* Configure email notifications

---

## Phase 2

* Setup Zoho Campaigns
* Create newsletter audience
* Setup subscription emails

---

## Phase 3

* Add lead pipeline workflows
* Add sales tracking
* Add operational automations

---

# Final Recommendation

This architecture gives the best balance between:

* premium frontend experience
* operational efficiency
* low engineering overhead
* scalability
* CRM ownership

while avoiding early overengineering with tools like:

* HubSpot
* Salesforce
* Customer.io
* heavy enterprise automation stacks.
