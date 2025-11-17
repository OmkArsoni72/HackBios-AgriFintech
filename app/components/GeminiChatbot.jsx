"use client";
import { useState } from "react";

export default function GeminiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      setLocation("Location not supported");
      return;
    }
    setLocation("Detecting...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Use OpenWeather API to get detailed location
          const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
          );
          const data = await res.json();
          
          if (data && data.length > 0) {
            const locationData = data[0];
            // Create detailed location string with city, state, and country
            const locationName = [
              locationData.name,
              locationData.state,
              locationData.country
            ].filter(Boolean).join(", ");
            
            setLocation(locationName || "Unknown Location");
          } else {
            // Fallback: Use coordinates
            setLocation(`${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`);
          }
        } catch (error) {
          console.error("Location fetch error:", error);
          setLocation(`${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocation("Unable to detect location - Please enable location access");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userInput = input;
    setLoading(true);
    setMessages([...messages, { role: "user", content: userInput }]);
    setInput("");
    
    try {
      const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (!geminiApiKey) {
        setMessages((msgs) => [...msgs, { role: "bot", content: "⚠️ API key missing. Please configure NEXT_PUBLIC_GEMINI_API_KEY in .env.local" }]);
        setLoading(false);
        return;
      }

      const prompt = `You are AgriFinAI's intelligent farming assistant for Indian agriculture. 

**Context:**
- User Location: ${location || "Not specified"}
- Query: "${userInput}"

**Instructions:**
- Provide practical, actionable advice for Indian farmers
- Use simple language with Hindi/local terms where helpful
- Include specific crop varieties, timings, and practices suitable for Indian conditions
- Cite government schemes (PM-KISAN, Soil Health Card, etc.) where relevant
- Keep response between 100-150 words
- Use **bold** for key points

**Response Format:**
Use clear sections with double asterisks for headings like **Recommendation:** or **Key Points:**`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ 
            contents: [{ 
              parts: [{ text: prompt }] 
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 500,
            }
          }),
        }
      );
      
      if (!res.ok) {
        let errorMessage = `API returned ${res.status}`;
        try {
          const errorData = await res.json();
          console.error("API Error:", errorData);
          errorMessage = errorData.error?.message || errorMessage;
        } catch (e) {
          console.error("Could not parse error response");
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log("API Response:", data);
      
      // Check for various response formats
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                     data.candidates?.[0]?.output || 
                     data.text;
      
      if (!answer) {
        console.error("Full API response:", JSON.stringify(data, null, 2));
        throw new Error("No valid response from API. The API key might have exceeded its quota or the model is unavailable.");
      }
      
      setMessages((msgs) => [...msgs, { role: "bot", content: answer }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      
      let errorMsg = err.message;
      if (err.message.includes("quota") || err.message.includes("429")) {
        errorMsg = "🚫 **API Quota Exceeded**\n\nYour Gemini API key has reached its limit.\n\n**Solutions:**\n1. Get a new API key from https://aistudio.google.com/apikey\n2. Wait for quota reset\n3. Upgrade your API plan";
      } else if (err.message.includes("401") || err.message.includes("403")) {
        errorMsg = "🔑 **Invalid API Key**\n\nPlease check your NEXT_PUBLIC_GEMINI_API_KEY in .env.local file";
      }
      
      setMessages((msgs) => [...msgs, { 
        role: "bot", 
        content: `❌ **Error:** ${errorMsg}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-green-700 text-white p-4 rounded-full shadow-xl z-50 hover:scale-105 transition-transform"
        onClick={() => setOpen(true)}
        title="Chat with Agri AI"
      >
        <span className="text-xl">💬</span>
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 bg-white rounded-2xl shadow-2xl w-96 h-[32rem] flex flex-col z-50 border border-green-600">
          <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-green-100 to-green-200 rounded-t-2xl">
            <span className="font-bold text-green-700 text-lg">AgriConnect AI Chatbot</span>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-red-500 text-xl">✖️</button>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border-b">
            <button
              className="bg-green-600 text-white px-3 py-1 rounded shadow hover:bg-green-700"
              onClick={detectLocation}
              type="button"
            >
              {location ? `📍 ${location}` : "Detect Location"}
            </button>
            <span className="text-xs text-gray-500">Location helps with crop/weather queries</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] px-4 py-2 rounded-lg shadow ${
                  msg.role === "user"
                    ? "ml-auto bg-green-200 text-green-900"
                    : "mr-auto bg-white border border-green-100 text-gray-800"
                }`}
              >
                {/* Render markdown for bot messages */}
                {msg.role === "bot" ? (
                  <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>") }} />
                ) : (
                  <span>{msg.content}</span>
                )}
              </div>
            ))}
            {loading && <div className="text-gray-400 text-xs">Typing...</div>}
          </div>
          <div className="p-4 border-t flex gap-2 bg-white">
            <input
              className="flex-1 border rounded-lg px-3 py-2 shadow focus:ring-2 focus:ring-green-500"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about crops, soil, weather, loans..."
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform"
              onClick={sendMessage}
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}