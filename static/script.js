const sendButton = document.getElementById("send_button");
const messageInput = document.getElementById("message_input");

const plaintextOutput = document.getElementById("plaintext_output");
const ciphertextOutput = document.getElementById("ciphertext_output");

const serverSender = document.getElementById("server_sender");
const serverReceiver = document.getElementById("server_receiver");
const serverTimestamp = document.getElementById("server_timestamp");
const serverLength = document.getElementById("server_length");
const serverCiphertext = document.getElementById("server_ciphertext");

const attackerResult = document.getElementById("attacker_result");
const decryptedOutput = document.getElementById("decrypted_output");

const floatingStepBubble = document.getElementById("floating_step_bubble");
const bubbleStepNumber = document.getElementById("bubble_step_number");
const bubbleStepTitle = document.getElementById("bubble_step_title");
const bubbleStepText = document.getElementById("bubble_step_text");

const senderFlowBox = document.getElementById("sender_flow_box");
const serverFlowBox = document.getElementById("server_flow_box");
const receiverFlowBox = document.getElementById("receiver_flow_box");
const interceptorFlowBox = document.getElementById("interceptor_flow_box");

const pauseButton = document.getElementById("pause_button");
const pauseMessage = document.getElementById("pause_message");

const catRunner = document.getElementById("cat_runner");
const catStatusText = document.getElementById("cat_status_text");

const unlockButton = document.getElementById("unlock_button");
const unlockHintText = document.getElementById("unlock_hint_text");
const celebrationText = document.getElementById("celebration_text");

let isFlowPaused = false;
let savedDecryptedMessage = "";
let isUnlockAvailable = false;

function escapeHtml(textValue) {
    return textValue
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function buildTooltipSpan(visibleText, className, tooltipText) {
    return '<span class="tooltip_word ' + className + '">' +
        visibleText +
        '<span class="tooltip_text">' + tooltipText + "</span></span>";
}

function applySyntaxHighlighting(rawText) {
    let highlightedText = escapeHtml(rawText);

    const tooltipRules = [
        {
            className: "syntax-purple",
            tooltipText: "turns a readable message into unreadable form using a key",
            terms: ["encryption", "encrypt", "encrypted", "encrypts"]
        },
        {
            className: "syntax-orange",
            tooltipText: "restores the original message from encrypted data using the correct key",
            terms: ["decryption", "decrypt", "decrypted", "decrypts"]
        },
        {
            className: "syntax-cyan",
            tooltipText: "info about the message like sender, time, or size but not the actual content",
            terms: ["metadata"]
        },
        {
            className: "syntax-blue",
            tooltipText: "a key anyone can use to lock a message for the receiver",
            terms: ["public key"]
        },
        {
            className: "syntax-yellow",
            tooltipText: "a secret key that only the receiver has to unlock the message",
            terms: ["private key"]
        },
        {
            className: "syntax-green",
            tooltipText: "the scrambled version of the message after encryption",
            terms: ["ciphertext"]
        }
    ];

    const normalHighlightRules = [
        {
            className: "syntax-cyan",
            terms: [
                "key pair",
                "matching key"
            ]
        },
        {
            className: "syntax-yellow",
            terms: [
                "encrypted packet",
                "encrypted message",
                "message length",
                "timestamp",
                "packet"
            ]
        },
        {
            className: "syntax-green",
            terms: [
                "unlock",
                "revealed",
                "successfully"
            ]
        },
        {
            className: "syntax-purple",
            terms: [
                "receiver",
                "relay server",
                "server",
                "sender"
            ]
        },
        {
            className: "syntax-red",
            terms: [
                "interceptor",
                "wrong key",
                "fails",
                "failed",
                "does not match",
                "different private key",
                "error"
            ]
        },
        {
            className: "syntax-orange",
            terms: [
                "plaintext",
                "original message",
                "readable message",
                "message"
            ]
        }
    ];

    tooltipRules.forEach(function (ruleObject) {
        ruleObject.terms.forEach(function (termValue) {
            const escapedTerm = termValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regexPattern = new RegExp("\\b" + escapedTerm + "\\b", "gi");

            highlightedText = highlightedText.replace(
                regexPattern,
                function (matchedText) {
                    return buildTooltipSpan(matchedText, ruleObject.className, ruleObject.tooltipText);
                }
            );
        });
    });

    normalHighlightRules.forEach(function (ruleObject) {
        ruleObject.terms.forEach(function (termValue) {
            const escapedTerm = termValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regexPattern = new RegExp("\\b" + escapedTerm + "\\b", "gi");

            highlightedText = highlightedText.replace(
                regexPattern,
                function (matchedText) {
                    return '<span class="' + ruleObject.className + '">' + matchedText + "</span>";
                }
            );
        });
    });

    return highlightedText;
}

function setHighlightedText(elementObject, textValue) {
    elementObject.innerHTML = applySyntaxHighlighting(textValue);
}

function applyHighlightingToStaticText() {
    const staticElements = [
        senderFlowBox.querySelector("p"),
        serverFlowBox.querySelector("p"),
        receiverFlowBox.querySelector("p"),
        interceptorFlowBox.querySelector("p"),
        document.getElementById("public_key_explanation"),
        document.getElementById("private_key_explanation"),
        document.getElementById("wrong_key_explanation"),
        bubbleStepText,
        unlockHintText,
        catStatusText
    ];

    staticElements.forEach(function (elementObject) {
        if (elementObject && !elementObject.querySelector(".tooltip_word")) {
            setHighlightedText(elementObject, elementObject.textContent);
        }
    });
}

function waitForMilliseconds(durationValue) {
    return new Promise(function (resolveFunction) {
        setTimeout(resolveFunction, durationValue);
    });
}

async function waitWithPause(durationValue) {
    let timePassed = 0;
    const checkInterval = 100;

    while (timePassed < durationValue) {
        await waitForMilliseconds(checkInterval);

        if (!isFlowPaused) {
            timePassed += checkInterval;
        }
    }
}

function moveCatToStage(stageName) {
    if (stageName === "sender") {
        catRunner.style.left = "10%";
        setHighlightedText(
            catStatusText,
            "tiny courier is hanging around the sender station with the plaintext ( =ω= )"
        );
    }

    if (stageName === "server") {
        catRunner.style.left = "38%";
        setHighlightedText(
            catStatusText,
            "tiny courier is carrying ciphertext through the relay server like a very serious employee ฅ^•ﻌ•^ฅ"
        );
    }

    if (stageName === "interceptor") {
        catRunner.style.left = "62%";
        setHighlightedText(
            catStatusText,
            "tiny courier spotted the interceptor trying nonsense with the wrong key (￣ω￣;)"
        );
    }

    if (stageName === "receiver") {
        catRunner.style.left = "90%";
        setHighlightedText(
            catStatusText,
            "tiny courier delivered the encrypted packet safely to the receiver (ᵔᴥᵔ)"
        );
    }
}

function triggerBubblePop() {
    floatingStepBubble.classList.remove("bubble_pop");
    void floatingStepBubble.offsetWidth;
    floatingStepBubble.classList.add("bubble_pop");
}

function triggerInterceptorShake() {
    interceptorFlowBox.classList.remove("interceptor_shake");
    void interceptorFlowBox.offsetWidth;
    interceptorFlowBox.classList.add("interceptor_shake");
}

function triggerCatCelebrate() {
    catRunner.classList.remove("cat_bounce");
    void catRunner.offsetWidth;
    catRunner.classList.add("cat_bounce");
}

async function animateDecryptionFailure() {
    const frames = [
        "try your luck...",
        "tr_y y_ur l_ck...",
        "decr_pti_n...",
        "decr_pti_n f_il_d...",
        "decryption failed"
    ];

    for (let i = 0; i < frames.length; i++) {
        setHighlightedText(attackerResult, frames[i]);

        attackerResult.classList.remove("failure_scramble");
        void attackerResult.offsetWidth;
        attackerResult.classList.add("failure_scramble");

        await waitWithPause(200);
    }
}

pauseButton.addEventListener("click", function () {
    isFlowPaused = !isFlowPaused;

    if (isFlowPaused) {
        pauseButton.textContent = "Resume Flow";
        setHighlightedText(
            pauseMessage,
            "paused for a tiny brain sparkle break... now this step can breathe a little (˶ᵔ ᵕ ᵔ˶)"
        );
    } else {
        pauseButton.textContent = "Pause Flow";
        pauseMessage.textContent = "";
    }
});

unlockButton.addEventListener("click", function () {
    if (!isUnlockAvailable) {
        setHighlightedText(
            unlockHintText,
            "The receiver cannot unlock the message yet. Let the encryption flow finish first (˶˃ ᵕ ˂˶)"
        );
        return;
    }

    setHighlightedText(decryptedOutput, savedDecryptedMessage);

    decryptedOutput.classList.remove("revealed_message");
    void decryptedOutput.offsetWidth;
    decryptedOutput.classList.add("revealed_message");

    setHighlightedText(
        unlockHintText,
        "Correct private key detected. The message has been successfully revealed."
    );

    setHighlightedText(
        celebrationText,
        "message revealed successfully... tiny courier completed the mission ₍^. .^₎⟆"
    );

    triggerCatCelebrate();
});

function clearActiveStates() {
    senderFlowBox.classList.remove("active_flow");
    serverFlowBox.classList.remove("active_flow");
    receiverFlowBox.classList.remove("active_flow");
    interceptorFlowBox.classList.remove("active_flow");

    floatingStepBubble.classList.remove("active_bubble");
}

function activateStep(stepNumber, flowBoxElement, stepTitle, stepText) {
    clearActiveStates();

    if (flowBoxElement) {
        flowBoxElement.classList.add("active_flow");
    }

    floatingStepBubble.classList.add("active_bubble");

    bubbleStepNumber.textContent = "Step " + stepNumber;
    bubbleStepTitle.textContent = stepTitle;
    setHighlightedText(bubbleStepText, stepText);

    triggerBubblePop();
}

function resetOutputSections() {
    setHighlightedText(plaintextOutput, "Waiting for input...");
    setHighlightedText(ciphertextOutput, "No encrypted message yet.");

    serverSender.textContent = "-";
    serverReceiver.textContent = "-";
    serverTimestamp.textContent = "-";
    serverLength.textContent = "-";
    setHighlightedText(serverCiphertext, "No ciphertext yet.");

    setHighlightedText(attackerResult, "No attempt yet.");

    setHighlightedText(decryptedOutput, "No decrypted message yet.");
    decryptedOutput.classList.remove("revealed_message");

    bubbleStepNumber.textContent = "Step 0";
    bubbleStepTitle.textContent = "Waiting to begin";
    setHighlightedText(
        bubbleStepText,
        "Type a message and click the button to watch the encryption flow happen step by step."
    );

    isFlowPaused = false;

    pauseButton.textContent = "Pause Flow";
    pauseMessage.textContent = "";

    savedDecryptedMessage = "";
    isUnlockAvailable = false;

    unlockButton.disabled = true;
    unlockButton.textContent = "🔒";

    setHighlightedText(
        unlockHintText,
        "The receiver can unlock the message only after the encryption flow finishes."
    );

    celebrationText.textContent = "";

    catRunner.style.left = "10%";
    setHighlightedText(
        catStatusText,
        "the tiny courier is waiting at the start line ( =ω= )ﾉ"
    );

    catRunner.classList.remove("cat_bounce");
    interceptorFlowBox.classList.remove("interceptor_shake");

    clearActiveStates();
}

async function runEncryptionFlow(responseData, originalMessage) {
    activateStep(
        1,
        senderFlowBox,
        "Plaintext is created",
        'The sender created this plaintext message: "' + originalMessage + '".'
    );

    moveCatToStage("sender");

    setHighlightedText(plaintextOutput, originalMessage);

    await waitWithPause(900);

    activateStep(
        2,
        receiverFlowBox,
        "Receiver public key is used",
        "The sender uses the receiver’s public key to encrypt the message. A public key can lock the message, but it cannot unlock it."
    );

    await waitWithPause(1000);

    activateStep(
        3,
        senderFlowBox,
        "Message becomes ciphertext",
        "The plaintext was transformed into ciphertext. This unreadable output can travel safely across the network."
    );

    setHighlightedText(ciphertextOutput, responseData.ciphertext_base64);

    await waitWithPause(1100);

    activateStep(
        4,
        serverFlowBox,
        "Ciphertext travels through the server",
        "The relay server received the ciphertext and metadata. It can forward the packet, but it cannot read the original message."
    );

    moveCatToStage("server");

    setHighlightedText(serverSender, "Sender");
    setHighlightedText(serverReceiver, "Receiver");
    setHighlightedText(serverTimestamp, responseData.server_view.timestamp);
    setHighlightedText(serverLength, String(responseData.server_view.message_length));
    setHighlightedText(serverCiphertext, responseData.server_view.ciphertext_base64);

    await waitWithPause(1200);

    activateStep(
        5,
        interceptorFlowBox,
        "Interceptor tries the wrong key",
        "The interceptor captured the ciphertext and tried using another private key that belongs to a completely different key pair."
    );

    moveCatToStage("interceptor");

    triggerInterceptorShake();

    await animateDecryptionFailure();

    activateStep(
        6,
        interceptorFlowBox,
        "Decryption fails",
        "The interceptor's private key does not match the receiver's public key used during encryption."
    );

    await waitWithPause(900);

    activateStep(
        7,
        receiverFlowBox,
        "Receiver decrypts successfully",
        "The receiver now has the correct private key. Press the lock button below to reveal the decrypted message."
    );

    moveCatToStage("receiver");

    savedDecryptedMessage = responseData.decrypted_text;

    isUnlockAvailable = true;

    unlockButton.disabled = false;
    unlockButton.textContent = "🔒";

    setHighlightedText(
        unlockHintText,
        "The receiver reached the final step. You can now reveal the message."
    );

    setHighlightedText(
        decryptedOutput,
        "Encrypted message waiting behind the lock..."
    );
}

sendButton.addEventListener("click", async function () {
    const messageText = messageInput.value.trim();

    if (messageText === "") {
        alert("Please type a message first.");
        return;
    }

    resetOutputSections();

    setHighlightedText(plaintextOutput, "Preparing plaintext...");
    setHighlightedText(ciphertextOutput, "Encryption starting...");
    setHighlightedText(attackerResult, "Waiting for ciphertext...");
    setHighlightedText(decryptedOutput, "Waiting for receiver decryption...");

    sendButton.disabled = true;
    sendButton.textContent = "Processing...";

    try {
        const response = await fetch("/encrypt_message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: messageText
            })
        });

        const responseData = await response.json();

        await runEncryptionFlow(responseData, messageText);
    } catch (error) {
        setHighlightedText(plaintextOutput, "Something went wrong.");
        setHighlightedText(ciphertextOutput, "Error");
        setHighlightedText(serverCiphertext, "Error");
        setHighlightedText(attackerResult, "Error");
        setHighlightedText(decryptedOutput, "Error");

        setHighlightedText(
            unlockHintText,
            "Something went wrong during the encryption flow."
        );

        console.log(error);
    }

    sendButton.disabled = false;
    sendButton.textContent = "Encrypt and Send";
});
resetOutputSections();