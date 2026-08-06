import json
import base64
from datetime import datetime

from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes


def generate_rsa_key_pair():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )
    public_key = private_key.public_key()
    return private_key, public_key


def encrypt_message(public_key, message_text):
    encrypted_bytes = public_key.encrypt(
        message_text.encode("utf-8"),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return encrypted_bytes


def decrypt_message(private_key, encrypted_bytes):
    decrypted_bytes = private_key.decrypt(
        encrypted_bytes,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return decrypted_bytes.decode("utf-8")


def main():
    user1_name = "User1"
    user2_name = "User2"
    user3_name = "User3"

    plaintext_message = "Hello User2, this is a private end-to-end encrypted message."

    user2_private_key, user2_public_key = generate_rsa_key_pair()
    user3_private_key, user3_public_key = generate_rsa_key_pair()

    encrypted_message_bytes = encrypt_message(user2_public_key, plaintext_message)
    ciphertext_base64 = base64.b64encode(encrypted_message_bytes).decode("utf-8")

    timestamp_value = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    server_view = {
        "sender": user1_name,
        "receiver": user2_name,
        "timestamp": timestamp_value,
        "message_length": len(plaintext_message),
        "ciphertext_base64": ciphertext_base64
    }

    try:
        user3_attempt_text = decrypt_message(user3_private_key, encrypted_message_bytes)
        attacker_attempt = {
            "attacker": user3_name,
            "success": True,
            "result": user3_attempt_text
        }
    except Exception as error:
        attacker_attempt = {
            "attacker": user3_name,
            "success": False,
            "result": "Decryption failed",
            "error": str(error)
        }

    decrypted_text = decrypt_message(user2_private_key, encrypted_message_bytes)

    final_output = {
        "plaintext": plaintext_message,
        "ciphertext_base64": ciphertext_base64,
        "metadata": {
            "sender": user1_name,
            "receiver": user2_name,
            "timestamp": timestamp_value,
            "message_length": len(plaintext_message)
        },
        "server_view": server_view,
        "attacker_attempt": attacker_attempt,
        "decrypted_text": decrypted_text
    }

    with open("demo_output.json", "w", encoding="utf-8") as json_file:
        json.dump(final_output, json_file, indent=4)

    print("demo_output.json has been generated successfully.")


if __name__ == "__main__":
    main()