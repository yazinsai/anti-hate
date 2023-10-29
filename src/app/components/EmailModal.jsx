import React from "react";
import Modal from "@/app/components/Modal";

const SUBJECTS = [
  "Reporting hate speech",
  "Employee inciting violence"
]

function EmailModal({ show, onClose }) {
  const [status, setStatus] = React.useState("busy");
  const [email, setEmail] = React.useState("");

  async function handleStream(response) {
    const data = response.body;
    if (!data) return;

    let content = "";
    let doneReading = false;
    const reader = data.getReader();
    const decoder = new TextDecoder();

    while (!doneReading) {
      const { value, done } = await reader.read();
      doneReading = done;
      const chunk = decoder.decode(value);

      content += chunk;
      setEmail((prev) => prev + chunk);
    }

    return content;
  }

  async function generateEmail() {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const content = await handleStream(response);
      if (content) {
        setStatus("done");
      } else {
        alert("Something went wrong; unable to generate the email");
      }
    } else {
      console.error("Error occurred while generating the email");
    }
  }

  React.useEffect(() => {
    if (show) generateEmail();
  }, [show]);

  function handleClose() {
    const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    window.location.href = `mailto:anup@urbaniconstruct.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(email)}`;

    onClose();
  }

  return (
    <Modal open={show} onClose={onClose}>
      <div
        dangerouslySetInnerHTML={{ __html: email.replace(/\n/g, "<br/>") }}
      ></div>
      <button
        className="w-full mt-4 bg-gray-700 text-white font-semibold px-4 py-2 rounded-md disabled:bg-gray-100 disabled:text-gray-300"
        onClick={handleClose}
        disabled={status !== "done"}
      >
        Send email to HR / Legal &gt;
      </button>
    </Modal>
  );
}

export default EmailModal;
