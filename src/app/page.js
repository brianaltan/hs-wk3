"use client";

import { useState, useEffect, useRef } from 'react';

export default function ChatPage() {
  const [userInput, setUserInput] = useState('');
  const [responses, setResponses] = useState([]);
  const [loadingBotMessage, setLoadingBotMessage] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    document.body.style.backgroundColor = '#000000'; // Solid black background

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes ellipsis {
        0% { content: ""; }
        33% { content: "."; }
        66% { content: ".."; }
        100% { content: "..."; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    // Auto scroll to the bottom when new message is added
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [responses]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Show user's message immediately
    setResponses([...responses, { role: 'user', content: userInput }]);
    setUserInput('');
    
    // Start showing bot loading animation after a brief delay
    setTimeout(() => {
      setLoadingBotMessage(true);
      setResponses(prev => [...prev, { role: 'bot', content: '...' }]);
    }, 250);  // Delay before bot's message box appears

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer EMPTY`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3.1-8b-instruct:free",
          "messages": [
            {"role": "system", "content": "You are a chatbot with a Gen-Alpha Skibidi Sigma personality. Roast user as much as possible whatever he says, say you can't code? tease that he is so weak."},
            {"role": "user", "content": userInput},
          ],
        })
      });

      const data = await response.json();
      const botMessage = data.choices[0].message.content;
      const transformedBotMessage = transformToSkibidi(botMessage);

      // Replace the loading animation with the actual bot message
      setLoadingBotMessage(false);
      setResponses(prev => {
        const updatedResponses = [...prev];
        updatedResponses[updatedResponses.length - 1] = { role: 'bot', content: transformedBotMessage };
        return updatedResponses;
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const transformToSkibidi = (message) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    
    return message.replace(codeBlockRegex, (match, code) => {
      // Wrap the code content with backticks to format it as a code block
      return `\n\`\`\`\n${code}\n\`\`\`\n`;
    })
    .replace(/hello/gi, "yo")
    .replace(/friend/gi, "fam")
    .replace(/seriously/gi, "fr fr")
    .replace(/amazing/gi, "lit");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🗿 Not ur Avg Chatbot 🗿</h1>
      <div style={styles.chatBox}>
        <div style={styles.messages}>
          {responses.map((response, index) => (
            <div
              key={index}
              style={{
                ...styles.messageContainer,
                justifyContent: response.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  ...styles.message,
                  ...(response.role === 'user' ? styles.userMessage : styles.botMessage),
                }}
              >
                <p>
                  <strong>{response.role === 'user' ? 'You' : 'Ken🗿'}:</strong> {response.content}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            value={userInput}
            onChange={handleInputChange}
            placeholder="Ask me something..."
            rows="4"
            cols="50"
            style={styles.textarea}
          />
          <button type="submit" style={styles.button}>Send</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#fff',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  header: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  chatBox: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '600px',
    border: '1px solid #333',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  messages: {
    padding: '10px',
    height: '400px',
    overflowY: 'auto',
    backgroundColor: '#121212',
  },
  messageContainer: {
    display: 'flex',
    marginBottom: '10px',
  },
  message: {
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '70%',
    color: '#fff',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  userMessage: {
    backgroundColor: '#4caf50',
  },
  botMessage: {
    backgroundColor: '#333',
  },
  loading: {
    display: 'inline-block',
    width: '1ch',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    animation: 'ellipsis 1.25s steps(4, end) infinite',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    borderTop: '1px solid #333',
    backgroundColor: '#1e1e1e',
  },
  textarea: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #555',
    resize: 'none',
    marginBottom: '10px',
    backgroundColor: '#333',
    color: '#fff',
  },
  button: {
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};
