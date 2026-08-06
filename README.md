# 🔐 E2EE Visualizer

An interactive educational web application that demonstrates how end-to-end encryption protects a message as it travels from a sender to a receiver.

Instead of displaying only the final ciphertext, the visualizer explains the complete process step by step using animated message delivery, live encryption results, interactive definitions, and a tiny courier cat guiding the packet through the communication flow.

> This project is intended for educational visualization and is not a production messaging system.

## ✨ Features

- RSA public-key encryption demonstration
- Step-by-step encryption flow
- Sender, relay server, receiver, and interceptor roles
- Live plaintext, ciphertext, and decrypted-message results
- Failed interception attempt using a non-matching private key
- Pause and resume controls for reading each stage
- Interactive tooltip definitions for technical terms
- Server metadata view
- Color-coded technical concepts
- Animated courier cat following the encrypted packet
- Custom terminal-inspired interface

## 🧠 How It Works

1. The sender writes a readable plaintext message.
2. The receiver's public key is used to encrypt the message.
3. The relay server forwards the resulting ciphertext without reading the original message.
4. An interceptor attempts to decrypt the ciphertext using a different private key and fails.
5. The receiver uses the matching private key to decrypt and reveal the original message.

The visualizer also displays the metadata available to the relay server, including the sender, receiver, timestamp, message length, and encrypted packet.

## 🛠️ Built With

- Python
- Flask
- HTML
- CSS
- JavaScript
- RSA public-key cryptography

## 📁 Project Structure

```text
e2ee-visualizer/
├── static/
│   ├── script.js
│   └── styles.css
├── templates/
│   └── index.html
├── app.py
├── crypto_demo.py
├── requirements.txt
├── .gitignore
└── README.md
```

## 🚀 Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/fatimaanani/e2ee-visualizer.git
cd e2ee-visualizer
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Activate it on macOS or Linux:

```bash
source venv/bin/activate
```

### 3. Install the required packages

```bash
pip install -r requirements.txt
```

### 4. Run the application

```bash
python app.py
```

Then open:

```text
http://127.0.0.1:5000
```

## 🎯 Educational Purpose

This project was created to make end-to-end encryption easier to understand visually.

It demonstrates the relationship between public and private keys, explains why an intermediary can forward encrypted data without reading it, and shows why an attacker cannot decrypt the message using an unrelated private key.

The project prioritizes clarity, interaction, and beginner-friendly explanations over production-level security architecture.

## 💡 What I Practiced

- Implementing RSA encryption and decryption
- Building a Python and Flask backend
- Connecting frontend interactions to backend operations
- Designing asynchronous step-by-step animations
- Presenting technical concepts through visual explanations
- Creating custom tooltip and pause/resume behaviour
- Designing a responsive terminal-inspired interface

## 🔮 Possible Improvements

- Support additional encryption methods
- Display generated public and private key values
- Add adjustable animation speed
- Add a guided tutorial mode
- Include digital-signature demonstrations
- Add responsive improvements for smaller screens

## ⚠️ Disclaimer

This application is an educational visualizer. It should not be used to protect real sensitive communications or as a replacement for established cryptographic protocols and secure messaging applications.

## 👩‍💻 Author

Created by [Fatima Anani](https://github.com/fatimaanani) as an educational computer security project.
