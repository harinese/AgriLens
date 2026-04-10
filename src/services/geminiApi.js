const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

function cleanJsonResponse(text) {
  let cleaned = text.trim();
  // Strip markdown fences
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  cleaned = cleaned.trim();
  return JSON.parse(cleaned);
}

export async function analyzeCropImage(base64Image, mimeType = 'image/jpeg') {
  const systemPrompt = `You are an expert agronomist AI. Analyze the crop image and return ONLY a valid JSON object (no markdown, no extra text) with these exact fields:
{
  "crop_name": "identified crop name",
  "crop_age_estimate": "seedling | juvenile | mature | harvesting stage",
  "disease_detected": "disease name or Healthy",
  "disease_severity": "mild | moderate | severe | none",
  "disease_description": "what the disease is, how it spreads. If healthy, say so.",
  "treatment_plan": ["step 1", "step 2", "step 3"],
  "recommended_pesticides": [
    {
      "name": "pesticide name",
      "type": "fungicide | insecticide | herbicide",
      "dosage": "amount in ml/litre or grams/litre",
      "application_method": "how to apply",
      "frequency": "how often",
      "precautions": "safety warnings",
      "is_toxic": true or false
    }
  ],
  "organic_alternatives": ["remedy 1", "remedy 2"],
  "fertilizer_suggestions": "what nutrients the crop needs and recommended fertilizers",
  "general_crop_tips": ["tip 1", "tip 2", "tip 3"],
  "urgency_level": "act now | monitor | routine"
}

Be specific with pesticide dosages in ml/litre or grams/litre. If the crop is healthy, still provide care tips and set disease_severity to "none" and urgency_level to "routine".`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: systemPrompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response from Gemini');

    return cleanJsonResponse(text);
  } catch (error) {
    console.error('Crop analysis error:', error);
    throw error;
  }
}

export async function generateIrrigationPlan(cropName, weatherData) {
  const systemPrompt = `You are an expert agronomist AI. Given the crop name and 7-day weather forecast, generate an irrigation and care plan. Return ONLY a valid JSON object (no markdown, no extra text) with this structure:
{
  "crop_name": "${cropName}",
  "daily_plan": [
    {
      "day": "Day 1 - YYYY-MM-DD",
      "temperature_max": number,
      "precipitation": number,
      "irrigation_needed": true/false,
      "water_amount": "amount in litres per plant or mm",
      "best_time": "early morning | evening | not needed",
      "warnings": ["warning 1"] or [],
      "pesticide_spray_ok": true/false,
      "spray_note": "reason if not ok",
      "heat_stress_alert": true/false,
      "heat_stress_note": "details if applicable"
    }
  ],
  "recommended_pesticides": [
    {
      "name": "pesticide name",
      "purpose": "why it's recommended based on the weather (e.g., prevent fungus due to high humidity)",
      "dosage": "exact amount to use"
    }
  ],
  "general_irrigation_tips": ["tip 1", "tip 2"],
  "weekly_summary": "brief overview of the week's plan"
}

Weather forecast data:
${JSON.stringify(weatherData, null, 2)}

Be specific with water quantities. Consider rainfall — if heavy rain is expected, skip or reduce irrigation.`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: systemPrompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response from Gemini');

    return cleanJsonResponse(text);
  } catch (error) {
    console.error('Irrigation plan error:', error);
    throw error;
  }
}

export async function generateCropProfile(cropName) {
  const systemPrompt = `You are an expert agronomist AI. Generate a comprehensive profile for the crop "${cropName}". Return ONLY a valid JSON object (no markdown, no extra text) with this structure:
{
  "crop_name": "${cropName}",
  "scientific_name": "Latin name",
  "description": "Brief description of the crop",
  "growing_season": "when to plant and harvest",
  "ideal_temperature": "temperature range in °C",
  "soil_type": "preferred soil type and pH range",
  "water_needs": "low | moderate | high — with details",
  "sunlight": "full sun | partial shade | shade",
  "spacing": "plant spacing in cm/m",
  "germination_time": "days to germination",
  "harvest_time": "days to harvest from planting",
  "common_diseases": [
    {
      "name": "disease name",
      "symptoms": "brief symptoms",
      "prevention": "how to prevent"
    }
  ],
  "common_pests": ["pest 1", "pest 2"],
  "companion_plants": ["plant 1", "plant 2"],
  "nutritional_needs": "NPK ratio and fertilizer schedule",
  "care_tips": ["tip 1", "tip 2", "tip 3"],
  "yield_estimate": "expected yield per plant/area"
}`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: systemPrompt }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response from Gemini');

    return cleanJsonResponse(text);
  } catch (error) {
    console.error('Crop profile error:', error);
    throw error;
  }
}
