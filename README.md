# 🚀 Multi-Threaded DPI Engine with Analytics

A high-performance **Deep Packet Inspection (DPI) engine** built in C++ that processes PCAP files using a multi-threaded pipeline and generates structured analytics for further visualization.

---

## 🧠 Overview

This project implements a **multi-threaded packet processing system** with:

* ⚙️ Load Balancer (LB) threads
* ⚡ Fast Path (FP) worker threads
* 📦 Packet parsing + classification
* 🔍 Deep Packet Inspection using SNI extraction
* 📊 JSON-based analytics output

---

## 🏗️ Architecture

```
PCAP Reader → Load Balancers → Fast Path Threads → Output Writer
```

* **Reader**: Reads packets from `.pcap`
* **Load Balancers**: Distribute packets across workers
* **Fast Path Threads**: Perform DPI, classification, filtering
* **Output Writer**: Writes processed packets to output PCAP

---

## ✨ Features

* ✅ Multi-threaded packet processing
* ✅ Flow-based classification (5-tuple hashing)
* ✅ Application detection (YouTube, Facebook, etc.)
* ✅ SNI extraction for HTTPS traffic
* ✅ Rule-based blocking:

  * Block by IP
  * Block by application
  * Block by domain
* ✅ Real-time statistics collection
* ✅ JSON export (`stats.json`) for dashboard integration

---

## 📊 Example Output (`stats.json`)

```json
{
  "total_packets": 77,
  "tcp_packets": 73,
  "udp_packets": 4,
  "applications": {
    "HTTPS": 39,
    "DNS": 4,
    "YouTube": 1
  },
  "threads": {
    "FP0": 53,
    "FP3": 24
  }
}
```

---

## 🛠️ Build Instructions

### Requirements

* C++17 compatible compiler (g++ ≥ 7 recommended)

### Compile

```bash
g++ -std=c++17 -O2 -I include -o dpi_engine.exe src/*.cpp
```

---

## ▶️ Usage

```bash
./dpi_engine.exe <input.pcap> <output.pcap> [options]
```

### Options

```
--block-ip <ip>        Block source IP  
--block-app <app>      Block application (e.g., YouTube)  
--block-domain <dom>   Block domain  
--lbs <n>              Number of load balancers  
--fps <n>              Fast path threads per LB  
```

### Example

```bash
./dpi_engine.exe test.pcap output.pcap --block-app YouTube
```

---

## 📁 Project Structure

```
.
├── src/                # Source files
├── include/            # Header files (includes json.hpp)
├── stats.sample.json   # Example output
├── .gitignore
└── README.md
```

---

## 📈 Future Improvements

* 📊 Real-time dashboard (React + Node.js)
* ⚖️ Improved load balancing (round-robin / adaptive)
* ⚡ Live packet capture support
* 📉 Performance benchmarking

---

## 🙌 Acknowledgment

This project was inspired by the work of **perryvegehan**.

---

## 📌 Note

* Generated files like `stats.json` and `.exe` are not included in the repository.
* Run the engine to generate fresh analytics data.

---

## 💡 Summary

This project demonstrates:

* Systems programming in C++
* Multi-threaded architecture
* Network traffic analysis
* Extensible backend design for full-stack integration

---

**Built for learning, experimentation, and performance exploration 🚀**
