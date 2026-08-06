from flask import Flask, render_template, request, jsonify

import base64
from datetime import datetime

from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes


application = Flask(__name__)


# Generate RSA key pair for the receiver (used for real encryption/decryption)
receiver_private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)

receiver_public_key = receiver_private_key.public_key()


# Generate a separate key pair to simulate an attacker with the wrong key
attacker_private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)

attacker_public_key = attacker_private_key.public_key()


@application.route("/")
def homepage():
    return render_template("index.html")  # Serves the main frontend page


@application.route("/encrypt_message", methods=["POST"])
def encrypt_message():

    request_data = request.get_json()  # Receive JSON data from frontend

    plaintext_message = request_data.get("message")  # Extract user input

    # Encrypt the message using the receiver's public key (E2EE concept)
    encrypted_bytes = receiver_public_key.encrypt(
        plaintext_message.encode("utf-8"),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

    # Encode ciphertext to Base64 for safe transmission/display
    ciphertext_base64 = base64.b64encode(encrypted_bytes).decode("utf-8")

    timestamp_value = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Generate message timestamp

    # Simulated server view showing only metadata and encrypted content
    server_view_data = {
        "sender": "User1",
        "receiver": "User2",
        "timestamp": timestamp_value,
        "message_length": len(plaintext_message),
        "ciphertext_base64": ciphertext_base64
    }

    # Simulated attacker attempt using an incorrect private key (always fails)
    attacker_result = {
        "attacker": "User3",
        "success": False,
        "result": "Decryption failed"
    }

    # Decrypt the message using the correct private key on the receiver side
    decrypted_bytes = receiver_private_key.decrypt(
        encrypted_bytes,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

    decrypted_text = decrypted_bytes.decode("utf-8")  # Convert decrypted bytes back to readable text

    # Return all results to frontend for visualization
    response_data = {
        "plaintext": plaintext_message,
        "ciphertext_base64": ciphertext_base64,
        "server_view": server_view_data,
        "attacker_attempt": attacker_result,
        "decrypted_text": decrypted_text
    }

    return jsonify(response_data)


if __name__ == "__main__":
    application.run(debug=True)  # Run Flask app in debug mode for development