"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { FiLoader, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import SoilHealthForm from '../../components/SoilHealthForm';
import SoilHealthReport from '../../components/SoilHealthReport';

export default function SoilHealthPage() {
  const { t } = useTranslation();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalysisRequest = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate soil health analysis
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAnalysis = {
        soilHealth: Math.round(Math.random() * 40 + 60), // 60-100
        pH: parseFloat((Math.random() * 2 + 6).toFixed(1)), // 6-8
        nitrogen: Math.round(Math.random() * 200 + 100), // 100-300 mg/kg
        phosphorus: Math.round(Math.random() * 100 + 20), // 20-120 mg/kg
        potassium: Math.round(Math.random() * 300 + 100), // 100-400 mg/kg
        recommendations: [
          'Apply nitrogen-rich fertilizer for better crop yield',
          'Increase organic matter through composting',
          'Maintain soil pH between 6.5-7.5 for optimal growth',
          'Implement crop rotation to prevent nutrient depletion'
        ],
        crops: formData.cropName,
        location: formData.location
      };
      
      setAnalysis(mockAnalysis);
    } catch (err) {
      setError('Failed to analyze soil health. Please try again.');
      console.error('Analysis error:', err);
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
          
          {/* Status Badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800">
            <FiCheckCircle className="text-green-600" />
            <span className="text-sm font-medium">✓ Analysis Ready</span>
          </div>
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
              <div className="p-6 bg-red-50 border-2 border-red-400 rounded-xl">
                <div className="flex items-start gap-3">
                  <FiAlertTriangle className="text-red-500 w-8 h-8 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-red-800 mb-2">Error</h3>
                    <p className="text-sm text-red-700">{error}</p>
                    <button
                      onClick={() => {
                        setError('');
                        setAnalysis(null);
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
}
