# 🪔 Shiv Charcha App — Google Play Store Data Safety & Production Release Guide

This document provides exact, step-by-step answers for the **Google Play Console Data Safety Questionnaire**, Privacy Policy recommendations, and the complete checklist for releasing the **Shiv Charcha** app to Production.

---

## 🔒 1. Google Play Console — Data Safety Form Answers

When filling out the **Data Safety** section in Google Play Console (`App Content` ➔ `Data Safety`), answer the questions using the exact selections below:

### Question 1: Data Collection & Security
| Question | Selection | Explanation / Rationale |
| :--- | :--- | :--- |
| **Does your app collect or share any of the required user data types?** | **NO** | The app operates locally on the user's device. No user account, name, email, location, or personal identifier is collected or transmitted to external servers. |
| **Is all of the user data collected by your app encrypted in transit?** | **YES** | All remote media network calls (audio streaming, version checks) use secure HTTPS TLS encryption. |
| **Do you provide a way for users to request that their data be deleted?** | **YES** (or **N/A - App does not collect data**) | Users can clear their local Jap counter and Sadhana data anytime directly inside the app settings, or clear app cache/storage on their device. |

---

### Question 2: Specific Data Types Declaration
Select **NO** for all the following categories:
- ❌ **Location** (Approximate or Precise): **NO**
- ❌ **Personal Info** (Name, Email, Phone, User IDs, Address): **NO**
- ❌ **Financial Info** (Credit Card, Bank Info, Purchase History): **NO**
- ❌ **Health & Fitness**: **NO**
- ❌ **Messages** (SMS, Emails, In-app messages): **NO**
- ❌ **Photos & Videos**: **NO**
- ❌ **Audio Files**: **NO** *(Audio files stream downstream from your server; user audio is not recorded or uploaded)*
- ❌ **Files & Docs**: **NO**
- ❌ **Calendar**: **NO**
- ❌ **Contacts**: **NO**
- ❌ **App Activity** (Page views, in-app searches): **NO**
- ❌ **Web Browsing**: **NO**
- ❌ **Device or Other IDs**: **NO**

---

## 📋 2. Google Play Console — App Content Declarations

Navigate to **Policy and Programs** ➔ **App Content** in Play Console and complete these forms:

### A. Privacy Policy
- **Requirement**: Google Play requires a public URL for your Privacy Policy.
- **Recommended URL**: `https://mahavyomastudio.com/apps/shiv-charcha/privacy-policy.html`
- **Key Clauses to Include in Policy**:
  1. *Shiv Charcha App does not collect, store, or share any personally identifiable information (PII).*
  2. *All spiritual progress (Jap count, Lotus Sadhana) is stored locally on your device via AsyncStorage.*
  3. *Audio content is streamed via secure HTTPS connection from mahavyomastudio.com.*

### B. Target Audience & Content
- **Target Age Group**: **13+** (or **18 and over**)
  - *Selecting 13+ avoids strict Google Play Families Policy requirements like special COPPA disclosures.*
- **Is your app designed for children?**: **NO**

### C. Advertising & Financial Features
- **Contains Ads?**: **NO** *(Select YES if you enable AdMob later)*
- **Financial Features**: **NO** *(The app offers free devotional content without in-app purchases or financial transactions)*
- **Government App**: **NO**

---

## 🚀 3. Step-by-Step Production Release Checklist

### Step 1: Generate Android App Bundle (.aab)
Run the production build command using EAS:
```bash
eas build --platform android --profile production
```
*Or for local building:*
```bash
npx expo run:android --variant release
```

### Step 2: Create a Production Release in Play Console
1. Open [Google Play Console](https://play.google.com/console).
2. Select **Shiv Charcha** ➔ **Production** ➔ **Create new release**.
3. Upload the generated `.aab` file.
4. Set Release Name: `1.0.0 (1)`.
5. Enter Release Notes (Hindi & English):
   ```markdown
   🌸 शिव चर्चा ऐप - प्रथम पावन संस्करण 🌸
   
   - 🔱 शिव संसार: 12 ज्योतिर्लिंग व 51 शक्ति पीठ डिजिटल दर्शन
   - 🎙️ अमृत वाणी: साहब श्री हरिंद्रानंद जी व दीदी माँ नीलम आनंद जी के पावन प्रवचन
   - 📿 108 जाप साधना व 7-दिवसीय कमल साधना ट्रैकर
   - 🪔 पूर्ण हिंदू पंचांग, शिव स्तोत्र, चालीसा व दैनिक शिव संदेश
   ```

### Step 3: Complete Store Listing
- **App Name**: `शिव चर्चा - Shiv Charcha`
- **Short Description**: `शिव शिष्यता, तीन सूत्र, 108 जाप साधना, अमृत वाणी व 12 ज्योतिर्लिंग दर्शन।`
- **Full Description**: Copy detailed devotional features highlighting Sahib Shri Harindranand Ji's 3 Sutras.
- **Category**: `Lifestyle` or `Books & Reference`.
- **Contact Email**: `support@mahavyomastudio.com`

### Step 4: Submit for Review
Review all green checkmarks under **App Content** and click **Start Rollout to Production**! 🎉

---
*Guide generated for Mahavyoma Studio — Shiv Charcha App Release.*
