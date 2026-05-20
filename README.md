# SafeStep 🩺⌚
### Smart Healthcare Monitoring & Emergency Alert System

SafeStep is a wearable-integrated healthcare monitoring platform designed to improve emergency response for elderly people and patients. 

The system continuously monitors motion data using sensors and automatically sends real-time WhatsApp alerts to caretakers when abnormal activity or falls are detected.

---

## 🚀 Features

- **Real-time motion monitoring** — Live visualization of accelerometer and gyroscope data.
- **Fall detection system** — Automated algorithm to detect sudden impacts or abnormal movement.
- **Automated alerts** — Direct WhatsApp notification to caretakers via Twilio API.
- **Live monitoring dashboard** — Interactive UI with telemetry charts and status indicators.
- **Wearable integration** — Designed to stream sensor data directly from hardware.

---

## 🧠 Problem Statement & Solution

**The Problem:**
In emergency situations, patients or elderly individuals may not always be able to call for help manually. Traditional monitoring systems often involve delays, manual supervision, or complex application flows.

**The Solution:**
SafeStep solves this problem by creating an automated emergency alert ecosystem. By streaming sensor data continuously, it instantly detects abnormalities (like falls) and notifies caretakers through WhatsApp without requiring any action from the wearer.

---

## ⚙️ How It Works

1. **Wear**  
   The user wears the SafeStep wristband (ESP32-based wearable) throughout the day.
2. **Monitor**  
   The wearable streams accelerometer and gyroscope data to the web platform in real time.
3. **Protect**  
   If abnormal movement or a fall is detected, the backend immediately triggers an emergency WhatsApp notification to the caretaker.

---

## 🛠️ Tech Stack

### Frontend & Client
* **Framework:** React.js + TypeScript
* **Styling:** Tailwind CSS + Framer Motion (for animations)
* **Realtime Database:** Firebase Realtime Database
* **HTTP Client:** Supabase JS Client

### Backend & Integrations
* **Database & Auth:** Supabase (Database, Auth, Edge Functions)
* **Edge Functions:** Deno runtime
* **WhatsApp API:** Twilio Messaging API

### Hardware
* **Microcontroller:** ESP32
* **Sensors:** Accelerometer & Gyroscope Sensors (MPU6050 or similar)

---

## 📲 WhatsApp Alert Example

> [!WARNING]
> ### 🚨 Emergency Alert
> **Patient:** Edward Johnson  
> **Patient ID:** SF-2048  
> **Time:** 02:14 PM  
> **Date:** 20 May 2026  
> 
> *Possible fall detected. Immediate attention required.*

---

## 🔧 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DharoonBalajii/mdp2026.git
   cd safestep
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory and define the required keys (refer to `.env.example` for details):
   ```env
   # Supabase
   VITE_SUPABASE_URL="your-supabase-url"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
   VITE_SUPABASE_PROJECT_ID="your-supabase-project-id"

   # Firebase
   VITE_FIREBASE_API_KEY="your-firebase-api-key"
   VITE_FIREBASE_DATABASE_URL="your-firebase-database-url"
   ...
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 🌍 Future Improvements

- [ ] **Heart rate monitoring** — Integrate heart rate sensors for full vitals tracking.
- [ ] **GPS live location tracking** — Include geographic coordinates in the WhatsApp alert for outdoor emergencies.
- [ ] **AI-based anomaly prediction** — Train models to recognize patterns before a fall occurs.
- [ ] **Mobile application support** — Companion iOS/Android app.
- [ ] **Cloud analytics dashboard** — Long-term health metrics tracking.

---

## 👨‍💻 Team

* **Dharoon Balajii** — Website Development
* **Eshna Jain** — Website Development
* **Raguhram** — Hardware Development
* **Nithin** — Hardware Development
* **Kavya** — Research and Development

---

*Built with passion by engineering students focused on creating impactful healthcare technology.*
