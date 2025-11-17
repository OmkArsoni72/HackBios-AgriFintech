"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { FiLoader, FiAlertTriangle } from 'react-icons/fi';
import SoilHealthForm from '../../components/SoilHealthForm';
import SoilHealthReport from '../../components/SoilHealthReport';

const SoilHealthPage = () => {
  const { t } = useTranslation();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalysisRequest = async (formData) => {
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      // Call our backend API for image analysis
      const response = await fetch('/api/analyze-crop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cropName: formData.cropName,
          soilType: formData.soilType,
          soilPH: formData.soilPH,
          symptoms: formData.symptoms,
          location: formData.location,
          imageBase64: formData.image // Send image as base64
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI analysis.');
      }

      const data = await response.json();
      
      if (!data.analysis) {
        throw new Error("Received an empty response from the AI.");
      }

      setAnalysis(data.analysis);

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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <SoilHealthForm onSubmit={handleAnalysisRequest} loading={loading} />
          
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 min-h-[400px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('Analysis Report')}</h2>
            {loading && (
              <div className="flex flex-col items-center justify-center h-full">
                <FiLoader className="animate-spin text-green-600 w-12 h-12" />
                <p className="mt-4 text-gray-600">{t('Analyzing... Please wait.')}</p>
              </div>
            )}
            {error && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <FiAlertTriangle className="text-red-500 w-12 h-12" />
                <p className="mt-4 text-red-600 font-semibold">{t('An error occurred')}</p>
                <p className="text-gray-500 text-sm">{error}</p>
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