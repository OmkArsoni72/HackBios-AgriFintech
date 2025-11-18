"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { FiLoader, FiAlertTriangle } from 'react-icons/fi';
import SoilHealthForm from '../../components/SoilHealthForm';
import SoilHealthReport from '../../components/SoilHealthReport';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

const SoilHealthPage = () => {
  const { t } = useTranslation();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tfModel, setTfModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [tfPrediction, setTfPrediction] = useState(null);
  
  // Load TensorFlow model on component mount
  useEffect(() => {
    loadTFModel();
  }, []);

  const loadTFModel = async () => {
    try {
      setModelLoading(true);
      const modelURL = '/tf_models/model.json';
      const metadataURL = '/tf_models/metadata.json';
      
      const model = await tmImage.load(modelURL, metadataURL);
      setTfModel(model);
      console.log('✅ TensorFlow model loaded successfully');
    } catch (err) {
      console.error('❌ Error loading TensorFlow model:', err);
    } finally {
      setModelLoading(false);
    }
  };

  const predictWithTF = async (imageFile) => {
    if (!tfModel) {
      console.error('❌ TensorFlow model not loaded');
      return null;
    }
    
    if (!imageFile) {
      console.error('❌ No image file provided');
      return null;
    }

    try {
      console.log('📸 Processing image:', imageFile.name);
      
      // Create image element
      const img = document.createElement('img');
      const imageUrl = URL.createObjectURL(imageFile);
      
      return new Promise((resolve, reject) => {
        img.onload = async () => {
          try {
            console.log('✅ Image loaded successfully');
            
            // Make prediction
            const prediction = await tfModel.predict(img);
            console.log('🤖 Raw predictions:', prediction);
            
            if (!prediction || prediction.length === 0) {
              throw new Error('No predictions returned from model');
            }
            
            // Get top prediction
            const maxPrediction = prediction.reduce((max, p) => 
              p.probability > max.probability ? p : max
            );
            
            console.log('🎯 Top prediction:', maxPrediction);
            
            // Cleanup
            URL.revokeObjectURL(imageUrl);
            
            // Extract crop type from class name
            const className = maxPrediction.className.toLowerCase();
            let detectedCrop = 'unknown';
            
            if (className.includes('tomato')) {
              detectedCrop = 'tomato';
            } else if (className.includes('healthy')) {
              // Check if it's healthy tomato
              detectedCrop = 'tomato';
            }
            
            const result = {
              className: maxPrediction.className,
              probability: (maxPrediction.probability * 100).toFixed(2),
              allPredictions: prediction.map(p => ({
                class: p.className,
                confidence: (p.probability * 100).toFixed(2)
              })),
              detectedCrop: detectedCrop
            };
            
            console.log('✅ Final result:', result);
            resolve(result);
            
          } catch (err) {
            console.error('❌ Prediction error:', err);
            URL.revokeObjectURL(imageUrl);
            reject(err);
          }
        };
        
        img.onerror = (err) => {
          console.error('❌ Image load error:', err);
          URL.revokeObjectURL(imageUrl);
          reject(new Error('Failed to load image'));
        };
        
        img.src = imageUrl;
      });
      
    } catch (err) {
      console.error('❌ TF Prediction Error:', err);
      return null;
    }
  };

  const validateCropMatch = (userCrop, tfDetectedCrop) => {
    console.log('🔍 Validating:', { userCrop, tfDetectedCrop });
    
    if (!tfDetectedCrop) {
      return { 
        match: false, 
        warning: `❌ Analysis Blocked! Could not detect crop type from image. Please upload a clear image of the plant.` 
      };
    }
    
    const normalizedUserCrop = userCrop.toLowerCase().trim();
    const normalizedDetected = tfDetectedCrop.toLowerCase().trim();
    
    // Check if crops match - STRICT VALIDATION
    if (normalizedDetected === 'unknown') {
      return { 
        match: false, 
        warning: `❌ Analysis Blocked! The uploaded image crop type could not be identified. Please upload a clear image of a Tomato plant.` 
      };
    }
    
    // Check if user crop name matches detected crop
    if (!normalizedUserCrop.includes(normalizedDetected) && 
        !normalizedDetected.includes(normalizedUserCrop)) {
      return {
        match: false,
        warning: `❌ Analysis Blocked! Crop name mismatch detected.\n\nYou entered: "${userCrop}"\nImage shows: "${tfDetectedCrop}"\n\n⚠️ Please ensure:\n1. Upload an image that matches the crop name\n2. Enter the correct crop name\n3. Use a clear, focused photo of the plant\n\n💡 Currently supported: Tomato crops only`
      };
    }
    
    console.log('✅ Validation passed!');
    return { match: true, warning: null };
  };

  const handleAnalysisRequest = async (formData) => {
    setLoading(true);
    setError('');
    setAnalysis(null);
    setTfPrediction(null);

    try {
      // Step 1: TensorFlow Image Analysis (if image provided)
      let tfResult = null;
      
      if (formData.image && tfModel) {
        console.log('🔍 Starting TensorFlow prediction...');
        tfResult = await predictWithTF(formData.image);
        console.log('📊 TF Result:', tfResult);
        
        // Check if TF prediction was successful
        if (!tfResult) {
          setError('❌ Image analysis failed. Please try uploading a different image or continue without image analysis.');
          setLoading(false);
          return;
        }
        
        // Validate crop name matches image - STRICT MODE
        const validation = validateCropMatch(formData.cropName, tfResult.detectedCrop);
        console.log('✅ Validation:', validation);
        
        if (!validation.match) {
          // STOP ANALYSIS - Show error and don't proceed
          setTfPrediction({
            ...tfResult,
            mismatchWarning: validation.warning
          });
          setError(validation.warning);
          setLoading(false);
          return; // Exit without Gemini analysis
        }
        
        // If match is good, proceed
        setTfPrediction(tfResult);
      }

      // Step 2: Gemini AI Analysis
      const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!geminiApiKey) {
        throw new Error("Gemini API key is not configured.");
      }

      const tfAnalysis = tfResult ? `
        - **AI Image Analysis Results:**
          - Detected Disease: ${tfResult.className}
          - Confidence Level: ${tfResult.probability}%
          - All Predictions: ${tfResult.allPredictions.map(p => `${p.class} (${p.confidence}%)`).join(', ')}
      ` : '';

      const prompt = `
        You are an expert agricultural scientist and plant pathologist. A farmer has provided the following information about a crop issue. Analyze the data and provide a detailed report.

        **Farmer's Input:**
        - **Crop:** ${formData.cropName}
        - **Soil Type:** ${formData.soilType}
        - **Soil pH:** ${formData.soilPH || 'Not provided'}
        - **Observed Symptoms:** ${formData.symptoms}
        - **Region/Location:** ${formData.location}
        - **Image of affected plant provided:** ${formData.image ? 'Yes' : 'No'}
        ${tfAnalysis}

        **Your Task:**
        1.  **Potential Diagnosis:** Based on the symptoms and crop type, list the most likely diseases, nutrient deficiencies, or pest infestations. Provide a probability or confidence level for each.
        2.  **Detailed Explanation:** For the most likely cause, explain why you think it's the problem, referencing the farmer's input.
        3.  **Actionable Recommendations:** Provide a clear, step-by-step plan for the farmer to follow. This should include:
            - **Immediate Actions:** What to do right now.
            - **Treatment Options:** Suggest both organic and chemical treatments if applicable, including specific product names or active ingredients and application instructions.
            - **Preventive Measures:** How to prevent this issue in the future.
        4.  **Disclaimer:** Add a disclaimer that this is an AI-generated analysis and consulting a local agricultural expert is recommended for confirmation.

        Format your response using clear headings with Markdown (**Bold** for headings, bullet points for lists).
      `;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error?.message || 'Failed to get AI analysis.');
      }

      const data = await response.json();
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!resultText) {
        throw new Error("Received an empty response from the AI.");
      }

      setAnalysis(resultText);

    } catch (err) {
      console.error("Soil Health Analysis Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-3xl font-bold text-green-700">AgriConnect</Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-green-700 transition-colors font-medium">{t('Home')}</Link>
              <Link href="/weather" className="text-gray-600 hover:text-green-700 transition-colors font-medium">{t('Weather')}</Link>
              <Link href="/loan" className="text-gray-600 hover:text-green-700 transition-colors font-medium">{t('Loan')}</Link>
              <Link href="/soil-health" className="text-green-700 border-b-2 border-green-700 font-semibold">{t('Soil Health')}</Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{t('AI Crop & Soil Health Analysis')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('Provide details about your crop and soil to get an AI-powered health assessment and recommendations.')}</p>
          
          {/* TensorFlow Model Status */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800">
            {modelLoading ? (
              <>
                <FiLoader className="animate-spin" />
                <span className="text-sm font-medium">Loading AI Model...</span>
              </>
            ) : tfModel ? (
              <>
                <span className="text-green-600">✓</span>
                <span className="text-sm font-medium">🤖 TensorFlow Model Ready</span>
              </>
            ) : (
              <>
                <FiAlertTriangle className="text-yellow-600" />
                <span className="text-sm font-medium">AI Model Loading...</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <SoilHealthForm onSubmit={handleAnalysisRequest} loading={loading} />
          
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 min-h-[400px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('Analysis Report')}</h2>
            
            {/* TensorFlow Prediction Results */}
            {tfPrediction && !tfPrediction.mismatchWarning && (
              <div className="mb-6">
                {/* TF Prediction Box - Only show if no mismatch */}
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                  <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                    🤖 TensorFlow Image Analysis
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Detected:</span>
                      <span className="text-xl font-bold text-blue-700">{tfPrediction.className}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Confidence:</span>
                      <span className={`text-lg font-bold ${parseFloat(tfPrediction.probability) > 80 ? 'text-green-600' : parseFloat(tfPrediction.probability) > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {tfPrediction.probability}%
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-600 mb-2">All Predictions:</p>
                      <div className="space-y-1">
                        {tfPrediction.allPredictions.map((pred, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">{pred.class}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full transition-all"
                                  style={{ width: `${pred.confidence}%` }}
                                />
                              </div>
                              <span className="font-medium text-gray-800 w-12 text-right">{pred.confidence}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {loading && (
              <div className="flex flex-col items-center justify-center h-full">
                <FiLoader className="animate-spin text-green-600 w-12 h-12" />
                <p className="mt-4 text-gray-600">{t('Analyzing... Please wait.')}</p>
              </div>
            )}
            {error && (
              <div className="p-6 bg-red-50 border-2 border-red-400 rounded-xl">
                <div className="flex items-start gap-3">
                  <FiAlertTriangle className="text-red-500 w-8 h-8 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-red-800 mb-2">
                      {error.includes('Blocked') ? '🚫 Analysis Stopped' : t('An error occurred')}
                    </h3>
                    <div className="text-sm text-red-700 whitespace-pre-line">{error}</div>
                    
                    {error.includes('mismatch') && (
                      <div className="mt-4 p-3 bg-white rounded-lg border border-red-200">
                        <p className="text-xs font-semibold text-gray-800 mb-2">🔍 How to fix:</p>
                        <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                          <li>Verify you selected the correct crop name</li>
                          <li>Upload a clear image of the actual crop</li>
                          <li>Make sure image shows the plant's leaves/symptoms</li>
                          <li>Try again with matching crop name and image</li>
                        </ul>
                      </div>
                    )}
                    
                    <button
                      onClick={() => {
                        setError('');
                        setTfPrediction(null);
                      }}
                      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      ↺ Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}
            {analysis && !loading && <SoilHealthReport report={analysis} />}
            {!analysis && !loading && !error && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-gray-500">{t('Your report will appear here after you submit the form.')}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SoilHealthPage;