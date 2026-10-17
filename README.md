# 💎 Hidden Gems | Local City Discovery Platform

> **Hackathon Track / Problem Statement:** PS 02 — Visually Appealing Local Discovery Engine  
> **Pilot City:** Mumbai (City-Agnostic Architecture)  
> **Target Audience:** Students & Budget Travelers  
> **Live Demo:** [hidden-gems-eight.vercel.app](https://hidden-gems-eight.vercel.app/)

---

## 📌 Project Overview

**Hidden Gems** is a lightweight, responsive web application designed to help students and budget travelers discover authentic, low-cost local spots without encountering overcrowded tourist traps. 

Traditional recommendation engines push users to already over-hyped venues. **Hidden Gems** solves this using an automated dynamic scoring mechanism called **The Hidden Score**, which incentivizes users to explore lesser-known locations and redistributes foot traffic across the city.

---

## ⚡ Key Features

- **📍 Interactive Spatial Mapping:** High-performance interactive map powered by Leaflet and Esri World Street Map tiles with custom location pins.
- **🔥 Dynamic "Hidden Score" Algorithm:** Real-time crowd-mitigation score decay. As users log visits, the spot's score drops, dynamically triggering a red warning badge (*"Getting Popular, try these next!"*).
- **🏷️ Budget & Category Filtering:** Instant client-side filtering for **Cheap Eats**, **Study Spots**, **Viewpoints**, and **Hidden Spots**.
- **🌐 City-Agnostic Architecture:** Modular data schema allowing quick expansion to other cities (e.g., Pune, Delhi) without changing UI or map logic.
- **📱 High-Performance UI:** Built with Vite, React, and Tailwind CSS for near-zero load times and responsive mobile layout.

---

## 🧮 The Core Hook: "The Hidden Score"

The platform uses a dynamic ranking formula to keep hidden spots truly hidden:

$$\text{Current Score} = \max\left(10, \text{Base Score} - (\text{Visits} \times 5) - \text{Budget Penalty}\right)$$

- **Base Score:** Initial obscurity ranking (out of 100).
- **Visits Weight:** Reduces score by 5 points per user check-in.
- **Budget Penalty:** Deducts points for expensive locations to keep the platform student-first.
- **Threshold Warning:** Once a score drops below **50**, the system flags the spot as *Getting Popular* to divert traffic to higher-scoring alternatives.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 (Vite)
- **Styling Framework:** Tailwind CSS v3
- **Mapping Library:** Leaflet & React-Leaflet
- **Map Tile Provider:** Esri World Street Map (ArcGIS)
- **Deployment:** Vercel

---

## 📁 Project Structure

```text
hidden-gems/
├── public/
├── src/
│   ├── App.jsx          # Main application component & state management
│   ├── index.css        # Tailwind directives & Leaflet styling overrides
│   ├── main.jsx         # Application entry point
│   └── placesData.js    # Consolidated Mumbai spot dataset & JSON schema
├── index.html
├── package.json
├── tailwind.config.js   # Tailwind configuration
└── README.md
