import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { cropName, soilType, soilPH, symptoms, location, imageData } = await request.json();

    // Validate inputs
    if (!cropName || !symptoms || !location) {
      return Response.json(
        { message: 'Missing required fields: cropName, symptoms, location' },
        { status: 400 }
      );
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Create detailed prompt for soil analysis
    const analysisPrompt = `You are an agricultural expert. Analyze the following crop and soil information ${imageData ? 'and the uploaded image' : ''} and provide a detailed soil health assessment in JSON format.

Crop: ${cropName}
Soil Type: ${soilType || 'Not specified'}
Soil pH: ${soilPH || 'Not measured'}
Symptoms: ${symptoms}
Location: ${location}

Provide a JSON response with this exact structure (no markdown, pure JSON):
{
  "soilHealth": <number 0-100>,
  "pH": <number 6-8>,
  "nitrogen": <number mg/kg>,
  "phosphorus": <number mg/kg>,
  "potassium": <number mg/kg>,
  "recommendations": [<array of 4-5 specific recommendations>],
  "crops": "${cropName}",
  "location": "${location}",
  "analysis": "<brief analysis of the condition>"
}

Make the values realistic based on the symptoms, soil type${imageData ? ', and the uploaded soil/plant image' : ''}. Be specific and actionable in recommendations.`;

    // Build content for Gemini API
    let generationContent;
    if (imageData) {
      // Extract base64 data from data URL
      const base64Data = imageData.split(',')[1];
      generationContent = [
        { text: analysisPrompt },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
          },
        },
      ];
    } else {
      generationContent = [{ text: analysisPrompt }];
    }

    // Call Gemini API
    const result = await model.generateContent(generationContent);
    const responseText = result.response.text();

    // Parse JSON response
    let analysisData;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      analysisData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Response:', responseText);
      return Response.json(
        { message: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Validate and ensure all required fields exist
    const validatedData = {
      soilHealth: Math.min(100, Math.max(0, parseInt(analysisData.soilHealth) || 75)),
      pH: parseFloat(analysisData.pH) || 6.8,
      nitrogen: parseInt(analysisData.nitrogen) || 150,
      phosphorus: parseInt(analysisData.phosphorus) || 60,
      potassium: parseInt(analysisData.potassium) || 200,
      recommendations: Array.isArray(analysisData.recommendations) 
        ? analysisData.recommendations.slice(0, 5)
        : ['Monitor soil regularly', 'Maintain proper irrigation', 'Apply balanced fertilizer', 'Check pH levels'],
      crops: cropName,
      location: location,
      analysis: analysisData.analysis || 'Soil analysis completed'
    };

    return Response.json(validatedData);
  } catch (error) {
    console.error('Soil Analysis API Error:', error);
    return Response.json(
      { message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
