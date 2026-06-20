import React, { useState, useEffect, useMemo, useRef } from 'react';
import Layout from './components/Layout';
import Card from './components/Card';
import Button from './components/Button';
import ToastContainer from './components/Toast';
import { 
  analyzeResumeATS, 
  ACTION_VERBS, 
  FRAMEWORKS_AND_LANGUAGES 
} from './utils/atsAnalyzer';
import { 
  Sparkles, 
  FileText, 
  Target, 
  BrainCircuit, 
  ArrowRight, 
  RefreshCw, 
  Search, 
  Copy, 
  Download, 
  Check, 
  AlertCircle, 
  BookOpen, 
  Layers, 
  TrendingUp,
  Settings
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import UploadZone from './components/UploadZone';
import { extractTextFromFile } from './utils/fileParser';

export default function App() {
  // Input states
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeInputMode, setResumeInputMode] = useState('text'); // 'text' | 'file'
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [uploadZoneKey, setUploadZoneKey] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState('');
  
  // App UX states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'highlighted'
  const [highlightTab, setHighlightTab] = useState('resume'); // 'resume' | 'jd'
  const [currentView, setCurrentView] = useState('analyzer'); // 'analyzer' | 'tailor' | 'guidelines' | 'settings'
  const [customEmail, setCustomEmail] = useState(() => localStorage.getItem('resume_ats_email') || 'radhikatriv0712@gmail.com');
  const [minScoreThreshold, setMinScoreThreshold] = useState(() => Number(localStorage.getItem('resume_ats_threshold')) || 70);

  // Ref for scrolling to results
  const resultsRef = useRef(null);

  // Loading animation state transitions
  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= 3) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Toast utilities
  const addToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Input validation
  const validateInputs = () => {
    if (!resumeText.trim() && !jobDescription.trim()) {
      addToast('error', 'Both Resume and Job Description inputs are empty.');
      return false;
    }
    if (!resumeText.trim()) {
      addToast('error', 'Please enter your Resume text to start analysis.');
      return false;
    }
    if (!jobDescription.trim()) {
      addToast('error', 'Please enter the Job Description to compare against.');
      return false;
    }
    return true;
  };

  // Perform Analysis
  const handleAnalyze = () => {
    if (!validateInputs()) return;

    setIsAnalyzing(true);
    setResults(null);

    // Simulate premium AI processing stages
    setTimeout(() => {
      try {
        const analysis = analyzeResumeATS(resumeText, jobDescription);
        setResults(analysis);
        setIsAnalyzing(false);
        addToast('success', 'ATS Analysis completed successfully!');
        
        // Scroll to results after short timeout to allow rendering
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } catch (err) {
        setIsAnalyzing(false);
        addToast('error', 'An error occurred during analysis. Please try again.');
      }
    }, 2400);
  };

  // File selection and extraction handlers
  const handleFileSelect = async (file) => {
    setIsParsingFile(true);
    setUploadedFileName(file.name);
    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      addToast('success', `Extracted ${wordCount} words from "${file.name}"`);
    } catch (err) {
      setUploadedFileName('');
      addToast('error', `Failed to parse file: ${err.message}`);
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleFileRemove = () => {
    setResumeText('');
    setUploadedFileName('');
    addToast('info', 'Resume file cleared.');
  };

  // Reset inputs and dashboard
  const handleReset = () => {
    setResumeText('');
    setJobDescription('');
    setResults(null);
    setSearchQuery('');
    setActiveTab('summary');
    setUploadZoneKey((prev) => prev + 1);
    setUploadedFileName('');
    addToast('info', 'Fields reset successfully.');
  };

  // Copy Missing Keywords to Clipboard
  const handleCopyMissing = () => {
    if (!results || results.missingKeywords.length === 0) {
      addToast('info', 'No missing keywords to copy.');
      return;
    }
    const text = results.missingKeywords.join(', ');
    navigator.clipboard.writeText(text);
    addToast('success', 'Missing keywords copied to clipboard.');
  };

  // Copy Full Report to Clipboard
  const handleCopyReport = () => {
    if (!results) return;
    const reportText = `ATS COMPATIBILITY REPORT
=====================================
Overall ATS Score: ${results.score}%
Total Target Keywords: ${results.totalKeywords}
Matched Keywords Count: ${results.matchedCount}
Missing Keywords Count: ${results.missingCount}

MATCHED KEYWORDS:
${results.matchedKeywords.join(', ') || 'None'}

MISSING KEYWORDS:
${results.missingKeywords.join(', ') || 'None'}

AI RECCOMENDATIONS & ACTION ITEMS:
${results.suggestions.map((sug, idx) => `${idx + 1}. ${sug.title}\n   ${sug.desc}`).join('\n\n')}
`;
    navigator.clipboard.writeText(reportText);
    addToast('success', 'Full compatibility report copied.');
  };

  // PDF Export
  const handleDownloadPDF = () => {
    if (!results) return;
    try {
      const doc = new jsPDF();
      
      // Page styling
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42); // Slate 900
      doc.text("ATS COMPATIBILITY REPORT", 20, 25);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Slate 500
      doc.text(`Generated on: ${new Date().toLocaleDateString()} | ResumeIQ Intelligence`, 20, 32);
      
      // Divider
      doc.setDrawColor(226, 232, 240); // Slate 200
      doc.line(20, 36, 190, 36);
      
      // Match Details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("Match Performance", 20, 48);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`ATS Compatibility Score: ${results.score}%`, 20, 56);
      doc.text(`Total Keywords Counted: ${results.totalKeywords}`, 20, 63);
      doc.text(`Matched Keywords: ${results.matchedCount}`, 20, 70);
      doc.text(`Missing Keywords: ${results.missingCount}`, 20, 77);
      
      // Compatibility Badge Box
      doc.setFillColor(241, 245, 249); // Slate 100
      doc.rect(140, 46, 50, 34, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(30);
      doc.setTextColor(99, 102, 241); // Indigo 500
      doc.text(`${results.score}%`, 146, 68);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text("MATCH SCORE", 146, 75);
      
      // Divider
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 88, 190, 88);
      
      // Matched Keywords
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(16, 185, 129); // Emerald
      doc.text(`Matched Keywords (${results.matchedCount})`, 20, 98);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      const matchedText = results.matchedKeywords.join(", ") || "None";
      const matchedLines = doc.splitTextToSize(matchedText, 170);
      doc.text(matchedLines, 20, 105);
      
      // Calculate layout vertical position
      let currentY = 105 + (matchedLines.length * 5) + 8;
      
      // Missing Keywords
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(244, 63, 94); // Rose
      doc.text(`Missing Keywords (${results.missingCount})`, 20, currentY);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      const missingText = results.missingKeywords.join(", ") || "None";
      const missingLines = doc.splitTextToSize(missingText, 170);
      doc.text(missingLines, 20, currentY + 7);
      
      currentY = currentY + 7 + (missingLines.length * 5) + 8;
      
      // Suggestions
      doc.setDrawColor(226, 232, 240);
      doc.line(20, currentY - 3, 190, currentY - 3);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text("AI Actionable Suggestions", 20, currentY + 5);
      
      let suggestionY = currentY + 12;
      results.suggestions.forEach((sug, idx) => {
        if (suggestionY > 270) {
          doc.addPage();
          suggestionY = 25;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(`${idx + 1}. ${sug.title}`, 20, suggestionY);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(71, 85, 105);
        const descLines = doc.splitTextToSize(sug.desc, 165);
        doc.text(descLines, 25, suggestionY + 5);
        suggestionY += 5 + (descLines.length * 4.5) + 5;
      });
      
      doc.save("ATS_Compatibility_Report.pdf");
      addToast('success', 'PDF Compatibility report downloaded.');
    } catch (err) {
      addToast('error', 'Could not generate PDF report.');
    }
  };

  // Word extraction counter
  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Dynamic Keyword Filtering
  const filteredKeywords = useMemo(() => {
    if (!results) return { matched: [], missing: [] };
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return { 
        matched: results.matchedKeywords, 
        missing: results.missingKeywords 
      };
    }
    return {
      matched: results.matchedKeywords.filter((word) => word.includes(query)),
      missing: results.missingKeywords.filter((word) => word.includes(query))
    };
  }, [results, searchQuery]);

  // Keyword highlighting logic inside visual preview panels
  const highlightTextContent = (text, matchedList, missingList) => {
    if (!text) return <p className="text-gray-500 italic">No text provided.</p>;
    
    const matchedSet = new Set(matchedList);
    const missingSet = new Set(missingList);
    
    // Split by sequences of alphanumeric strings (including dots and hyphens like next.js or ci-cd)
    const parts = text.split(/([a-zA-Z0-9_\-\.]+)/g);
    
    return (
      <div className="whitespace-pre-wrap leading-relaxed text-sm font-sans break-words text-gray-300">
        {parts.map((part, index) => {
          if (!/^[a-zA-Z0-9_\-\.]+$/.test(part)) {
            return part;
          }
          // Remove trailing period (e.g. at end of sentence) for matching
          const cleanWord = part.toLowerCase().replace(/\.+$/, '');
          
          if (matchedSet.has(cleanWord)) {
            return (
              <mark 
                key={index} 
                className="bg-emerald-500/20 text-emerald-400 border-b border-emerald-500/40 px-0.5 rounded-sm font-medium transition-all duration-200"
                title="Matched keyword"
              >
                {part}
              </mark>
            );
          } else if (missingSet.has(cleanWord)) {
            return (
              <mark 
                key={index} 
                className="bg-rose-500/20 text-rose-400 border-b border-rose-500/40 px-0.5 rounded-sm font-medium transition-all duration-200"
                title="Missing keyword"
              >
                {part}
              </mark>
            );
          }
          return part;
        })}
      </div>
    );
  };

  // SVGs / Circular Progress calculations
  const circumference = 2 * Math.PI * 45; // r=45 -> 282.74
  const strokeDashoffset = useMemo(() => {
    if (!results) return circumference;
    return circumference - (results.score / 100) * circumference;
  }, [results, circumference]);

  // Custom steps for loading text
  const loadingStepsText = [
    'Parsing resume structure & sections...',
    'Tokenizing words & cleaning punctuation...',
    'Removing stop words & identifying technical keywords...',
    'Cross-referencing resume with job description requirements...'
  ];

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView} customEmail={customEmail}>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Main Multi-View Routing */}
      {currentView === 'analyzer' && (
        <>
          {/* Hero Section */}
          <section className="text-center max-w-3xl mx-auto mb-12 relative z-10" aria-labelledby="hero-title">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-indigo/10 border border-brand-indigo/25 text-brand-indigo text-xs font-semibold mb-5 animate-pulse">
              <Sparkles size={12} />
              <span>Real-time ATS Analytics Engine</span>
            </div>
            <h1 id="hero-title" className="text-4xl sm:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight mb-4">
              Compare Your Resume Against Any <span className="gradient-text">Job Description</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Identify missing keywords, check your alignment score, and modify your text in seconds to bypass applicant tracking filters.
            </p>
          </section>

          {/* Input Form Dashboard */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-10 relative z-10" aria-label="Input Dashboard">
            {/* Resume Input Box */}
            <Card
              title={resumeInputMode === 'text' ? "Resume Plain Text" : "Upload Resume File"}
              description={resumeInputMode === 'text' ? "Paste your formatted resume contents below" : "Upload your resume in PDF, Word, or text format"}
              headerIcon={FileText}
              actions={
                <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setResumeInputMode('text')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                      resumeInputMode === 'text'
                        ? 'bg-brand-indigo text-white shadow-sm shadow-brand-indigo/25'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Paste Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeInputMode('file')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                      resumeInputMode === 'file'
                        ? 'bg-brand-indigo text-white shadow-sm shadow-brand-indigo/25'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Upload File
                  </button>
                </div>
              }
            >
              {resumeInputMode === 'text' ? (
                <div className="relative">
                  <textarea
                    id="resume-textarea"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume work history, skills summary, and education details here..."
                    rows={12}
                    className={`w-full rounded-xl p-4 text-sm text-gray-200 placeholder-gray-500 font-sans glass-input resize-none h-[300px] ${
                      !resumeText.trim() && results ? 'border-rose-500/40 focus:border-rose-500' : ''
                    }`}
                    aria-label="Resume Plain Text Input"
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] text-gray-500 font-bold bg-dark-950/80 px-2.5 py-1 rounded border border-white/5">
                    {getWordCount(resumeText)} words
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {isParsingFile ? (
                    <div className="border-2 border-dashed border-brand-indigo/30 bg-brand-indigo/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-[300px]">
                      <div className="relative flex items-center justify-center mb-4">
                        <div className="w-12 h-12 rounded-full border-4 border-brand-indigo/20 border-t-brand-indigo animate-spin" />
                        <FileText className="absolute text-brand-indigo animate-pulse" size={18} />
                      </div>
                      <h4 className="text-white font-medium text-sm mb-1">Parsing Resume File...</h4>
                      <p className="text-xs text-gray-400 max-w-xs">Extracting textual content and skills vocabulary</p>
                    </div>
                  ) : (
                    <div className="min-h-[300px] flex flex-col justify-between">
                      <UploadZone
                        key={uploadZoneKey}
                        onFileSelect={handleFileSelect}
                        onFileRemove={handleFileRemove}
                        acceptedTypes={['.pdf', '.docx', '.txt']}
                      />
                      
                      {resumeText.trim() && uploadedFileName && (
                        <div className="mt-4 p-4 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.02] animate-fade-in-up">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-emerald-400 font-semibold mb-1">Successfully Parsed Content</p>
                              <p className="text-[11px] text-gray-400 leading-relaxed">
                                Extracted <span className="text-white font-bold">{getWordCount(resumeText)}</span> words from your resume. You can switch to the <strong className="text-brand-indigo cursor-pointer hover:underline" onClick={() => setResumeInputMode('text')}>Paste Text</strong> tab to review and make edits.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {!resumeText.trim() && (
                        <div className="mt-4 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                          <p className="text-[11px] text-gray-400 leading-relaxed text-center">
                            Upload a PDF, Word document (.docx), or plain text (.txt) file. Text extraction runs entirely locally in your browser.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Job Description Text Box */}
            <Card
              title="Target Job Description"
              description="Paste the target job opening posting requirements"
              headerIcon={Target}
            >
              <div className="relative">
                <textarea
                  id="job-textarea"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job posting details, qualifications, and core requirements here..."
                  rows={12}
                  className={`w-full rounded-xl p-4 text-sm text-gray-200 placeholder-gray-500 font-sans glass-input resize-none h-[300px] ${
                    !jobDescription.trim() && results ? 'border-rose-500/40 focus:border-rose-500' : ''
                  }`}
                  aria-label="Job Description Input"
                />
                <div className="absolute bottom-3 right-3 text-[10px] text-gray-500 font-bold bg-dark-950/80 px-2.5 py-1 rounded border border-white/5">
                  {getWordCount(jobDescription)} words
                </div>
              </div>
            </Card>
          </section>

          {/* Control Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14 relative z-10">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAnalyze}
              loading={isAnalyzing}
              icon={isAnalyzing ? null : BrainCircuit}
              className="w-full sm:w-auto shadow-xl"
            >
              Analyze Resume
            </Button>
            <Button
              variant="glass"
              size="lg"
              onClick={handleReset}
              icon={RefreshCw}
              className="w-full sm:w-auto hover:text-white"
            >
              Reset Fields
            </Button>
          </div>

          {/* Loading Dashboard State */}
          {isAnalyzing && (
            <div className="max-w-xl mx-auto mb-16 relative z-10 animate-fade-in-up">
              <Card className="p-8 text-center glass-panel border-brand-indigo/30">
                <div className="flex flex-col items-center justify-center space-y-6">
                  {/* Spinner */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-brand-indigo/20 border-t-brand-indigo animate-spin" />
                    <BrainCircuit className="absolute text-brand-indigo animate-pulse" size={24} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">AI Analyzer Processing</h3>
                    <div className="h-6 overflow-hidden relative w-80 mx-auto text-xs text-gray-400 font-medium">
                      <div 
                        className="absolute inset-x-0 transition-transform duration-500 flex flex-col justify-start"
                        style={{ transform: `translateY(-${loadingStep * 24}px)` }}
                      >
                        {loadingStepsText.map((step, idx) => (
                          <span key={idx} className="h-6 flex items-center justify-center truncate">
                            {step}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Before Analysis Empty State Guidance */}
          {!results && !isAnalyzing && (
            <section className="max-w-2xl mx-auto mb-16 relative z-10 animate-fade-in-up" aria-label="Instructions">
              <Card
                title="How to optimize your resume"
                description="Follow these simple guidelines to increase compatibility"
                headerIcon={BookOpen}
                interactive={true}
              >
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <li className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3.5 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-blue/15 text-brand-blue flex items-center justify-center font-bold">1</span>
                    <div>
                      <h4 className="font-semibold text-white mb-0.5">Paste Resume & Job Text</h4>
                      <p className="text-gray-400 leading-relaxed">Copy the text contents directly from your PDF/Word resume and paste into the inputs above.</p>
                    </div>
                  </li>
                  <li className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3.5 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-indigo/15 text-brand-indigo flex items-center justify-center font-bold">2</span>
                    <div>
                      <h4 className="font-semibold text-white mb-0.5">Identify Missing Keywords</h4>
                      <p className="text-gray-400 leading-relaxed">Our parser compares the core vocabularies and highlights missing skills in rose.</p>
                    </div>
                  </li>
                  <li className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3.5 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-purple/15 text-brand-purple flex items-center justify-center font-bold">3</span>
                    <div>
                      <h4 className="font-semibold text-white mb-0.5">Review Action Suggestions</h4>
                      <p className="text-gray-400 leading-relaxed">Implement actionable suggestions directly targeting formatting and keyword density.</p>
                    </div>
                  </li>
                  <li className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3.5 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-emerald/15 text-brand-emerald flex items-center justify-center font-bold">4</span>
                    <div>
                      <h4 className="font-semibold text-white mb-0.5">Export Optimized Report</h4>
                      <p className="text-gray-400 leading-relaxed">Download a professional PDF summary to verify your edits before applying.</p>
                    </div>
                  </li>
                </ul>
              </Card>
            </section>
          )}

          {/* Results Dashboard Panel */}
          {results && !isAnalyzing && (
            <section 
              ref={resultsRef} 
              id="results-section" 
              className="space-y-8 relative z-10 animate-fade-in-up scroll-mt-24"
              aria-label="Analysis Results"
            >
              {/* Top Tabs */}
              <div className="flex border-b border-white/10 max-w-md mx-auto justify-center gap-4">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`pb-3 text-sm font-semibold tracking-wide border-b-2 px-4 cursor-pointer transition-all ${
                    activeTab === 'summary' 
                      ? 'border-brand-indigo text-white' 
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Report Summary
                </button>
                <button
                  onClick={() => setActiveTab('highlighted')}
                  className={`pb-3 text-sm font-semibold tracking-wide border-b-2 px-4 cursor-pointer transition-all ${
                    activeTab === 'highlighted' 
                      ? 'border-brand-indigo text-white' 
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Highlighted Match View
                </button>
              </div>

              {activeTab === 'summary' ? (
                <>
                  {/* Summary Score section */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Score Circle Card */}
                    <div className="lg:col-span-5 h-full">
                      <Card className="flex flex-col items-center justify-center text-center p-8 h-full bg-dark-900/60">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
                          ATS Compatibility Score
                        </h3>

                        {/* Circular Score Indicator */}
                        <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              className="stroke-white/5 fill-transparent"
                              strokeWidth="8"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              className="stroke-brand-indigo fill-transparent transition-all duration-1000 ease-out"
                              strokeWidth="8"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-4xl font-extrabold text-white leading-none font-heading">
                              {results.score}%
                            </span>
                            <span className="text-[10px] text-gray-400 mt-1 font-bold tracking-widest uppercase">
                              {results.score >= minScoreThreshold ? 'Excellent' : results.score >= Math.max(40, minScoreThreshold - 20) ? 'Moderate' : 'Low Match'}
                            </span>
                          </div>
                        </div>

                        {/* Animated Progress Bar */}
                        <div className="w-full max-w-xs space-y-2 mb-6">
                          <div className="flex justify-between text-xs text-gray-400 font-bold">
                            <span>Keyword Alignment Progress</span>
                            <span>{results.score}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-purple rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${results.score}%` }}
                            />
                          </div>
                        </div>

                        {/* Numerical stats counts */}
                        <div className="grid grid-cols-3 gap-2 w-full pt-6 border-t border-white/5">
                          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                            <span className="block text-xl font-bold text-white leading-tight font-heading">
                              {results.totalKeywords}
                            </span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                              JD Keywords
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                            <span className="block text-xl font-bold text-emerald-400 leading-tight font-heading">
                              {results.matchedCount}
                            </span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                              Matched
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-center">
                            <span className="block text-xl font-bold text-rose-400 leading-tight font-heading">
                              {results.missingCount}
                            </span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                              Missing
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Suggestions and Reporting Actions */}
                    <div className="lg:col-span-7 space-y-6">
                      {/* Action items Card */}
                      <Card
                        title="Report Operations"
                        description="Actions to export analysis outputs"
                        headerIcon={Layers}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <Button
                            variant="glass"
                            onClick={handleCopyMissing}
                            icon={Copy}
                            fullWidth={true}
                            className="py-3 hover:text-white border-white/10 hover:border-brand-indigo"
                          >
                            Copy Missing
                          </Button>
                          <Button
                            variant="glass"
                            onClick={handleCopyReport}
                            icon={FileText}
                            fullWidth={true}
                            className="py-3 hover:text-white border-white/10 hover:border-brand-indigo"
                          >
                            Copy Report
                          </Button>
                          <Button
                            variant="primary"
                            onClick={handleDownloadPDF}
                            icon={Download}
                            fullWidth={true}
                            className="py-3"
                          >
                            Download PDF
                          </Button>
                        </div>
                      </Card>

                      {/* Suggestions list */}
                      <Card
                        title="ATS Optimization Suggestions"
                        description="Actionable recommendations generated by parsing alignment"
                        headerIcon={TrendingUp}
                      >
                        <div className="space-y-4">
                          {results.suggestions.map((suggestion) => (
                            <div 
                              key={suggestion.id}
                              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-4 transition-all hover:bg-white/[0.04]"
                            >
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo" />
                                  {suggestion.title}
                                </h4>
                                <p className="text-xs text-gray-400 leading-relaxed pr-2">
                                  {suggestion.desc}
                                </p>
                              </div>
                              <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-brand-indigo/10 text-brand-indigo text-[10px] font-bold uppercase tracking-wider shrink-0 border border-brand-indigo/20">
                                {suggestion.action}
                              </span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Keywords Section */}
                  <div className="space-y-6">
                    {/* Search / Filter keywords bar */}
                    <div className="flex items-center gap-3 max-w-md bg-white/[0.03] border border-white/15 px-3.5 py-2.5 rounded-xl shadow-inner group focus-within:border-brand-indigo transition-all">
                      <Search size={16} className="text-gray-400 group-focus-within:text-brand-indigo" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search keywords (e.g. react, python)..."
                        className="bg-transparent border-none outline-none text-xs text-white placeholder-gray-500 w-full"
                        aria-label="Filter keywords"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="text-gray-500 hover:text-white text-[10px] font-bold uppercase cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Matched Keywords */}
                      <Card
                        title={`Matched Keywords (${filteredKeywords.matched.length})`}
                        description="Core terms found in both inputs"
                        headerIcon={Check}
                        className="border-emerald-500/10"
                      >
                        {filteredKeywords.matched.length > 0 ? (
                          <div className="flex flex-wrap gap-2.5">
                            {filteredKeywords.matched.map((word) => (
                              <span 
                                key={word}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm transition-all hover:scale-[1.03]"
                              >
                                {word}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="py-6 text-center text-xs text-gray-500 font-medium">
                            {searchQuery ? 'No matched keywords match search filter' : 'No matched keywords detected'}
                          </div>
                        )}
                      </Card>

                      {/* Missing Keywords */}
                      <Card
                        title={`Missing Keywords (${filteredKeywords.missing.length})`}
                        description="Terms in target job but not in resume"
                        headerIcon={AlertCircle}
                        className="border-rose-500/10"
                      >
                        {filteredKeywords.missing.length > 0 ? (
                          <div className="flex flex-wrap gap-2.5">
                            {filteredKeywords.missing.map((word) => (
                              <span 
                                key={word}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-sm transition-all hover:scale-[1.03]"
                              >
                                {word}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="py-6 text-center text-xs text-gray-500 font-medium">
                            {searchQuery ? 'No missing keywords match search filter' : 'No missing keywords! Excellent!'}
                          </div>
                        )}
                      </Card>
                    </div>
                  </div>
                </>
              ) : (
                /* Highlighted Match View Tab */
                <div className="space-y-6">
                  {/* Highlight Toggles */}
                  <div className="flex justify-start gap-3 bg-white/[0.02] border border-white/5 p-1 rounded-xl max-w-sm">
                    <button
                      onClick={() => setHighlightTab('resume')}
                      className={`flex-grow py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        highlightTab === 'resume'
                          ? 'bg-brand-indigo text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Resume Highlight
                    </button>
                    <button
                      onClick={() => setHighlightTab('jd')}
                      className={`flex-grow py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        highlightTab === 'jd'
                          ? 'bg-brand-indigo text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Job Description Highlight
                    </button>
                  </div>

                  {/* Highlighting Panel Container */}
                  <Card
                    title={highlightTab === 'resume' ? 'Resume Keyword Highlights' : 'Job Description Keyword Highlights'}
                    description={
                      highlightTab === 'resume' 
                        ? 'Highlighted words match core keywords (emerald).' 
                        : 'Matched words are highlighted in emerald, missing items in rose.'
                    }
                    headerIcon={FileText}
                  >
                    <div className="p-4 rounded-xl border border-white/5 bg-dark-950/70 max-h-[480px] overflow-y-auto font-sans leading-relaxed text-sm select-text">
                      {highlightTab === 'resume' 
                        ? highlightTextContent(resumeText, results.matchedKeywords, [])
                        : highlightTextContent(jobDescription, results.matchedKeywords, results.missingKeywords)
                      }
                    </div>
                  </Card>
                </div>
              )}
            </section>
          )}
        </>
      )}

      {/* Tailor Tool View */}
      {currentView === 'tailor' && (
        <div className="space-y-8 animate-fade-in-up">
          <section className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/25 text-brand-purple text-xs font-semibold mb-5">
              <Sparkles size={12} />
              <span>AI-Powered Resume Tailoring</span>
            </div>
            <h1 className="text-4xl font-heading font-extrabold text-white tracking-tight mb-4">
              Tailor Your Resume
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Automatically optimize your resume alignment by generating a structured core competencies section containing missing keywords.
            </p>
          </section>

          {resumeText.trim() && jobDescription.trim() ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column: Metrics & Custom Added Keywords */}
              <div className="space-y-6">
                <Card
                  title="Tailoring Insights"
                  description="Optimize your match rate by appending target skills"
                  headerIcon={Target}
                >
                  {(() => {
                    const analysis = analyzeResumeATS(resumeText, jobDescription);
                    const missing = analysis.missingKeywords;
                    if (missing.length === 0) {
                      return (
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center gap-2">
                            <Check size={18} />
                            Your resume already contains all keywords from the job description!
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            No additional tailoring is needed for this role. Your keyword alignment is 100%.
                          </p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="space-y-5">
                        <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                          <div>
                            <span className="text-xs text-gray-400 font-bold block">CURRENT SCORE</span>
                            <span className="text-2xl font-heading font-extrabold text-white">{analysis.score}%</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 font-bold block">PROJECTED SCORE</span>
                            <span className="text-2xl font-heading font-extrabold text-emerald-400">100%</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Keywords to Append ({missing.length})</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Appending these missing core keywords directly inside a dedicated skills summary section:
                          </p>
                          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-white/[0.01] rounded-lg border border-white/5">
                            {missing.map(word => (
                              <span key={word} className="px-2 py-1 bg-rose-500/10 border border-rose-500/20 rounded text-[11px] font-semibold text-rose-400">
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Button
                          variant="primary"
                          onClick={() => {
                            const optimizedResumeText = `${resumeText.trim()}\n\n### CORE COMPETENCIES & KEYWORDS\n${missing.join(' | ')}`;
                            navigator.clipboard.writeText(optimizedResumeText);
                            addToast('success', 'Optimized tailored resume copied to clipboard!');
                          }}
                          icon={Copy}
                          fullWidth={true}
                        >
                          Copy Tailored Resume
                        </Button>
                      </div>
                    );
                  })()}
                </Card>
              </div>

              {/* Right Column: Optimized Output View */}
              <div className="space-y-6">
                <Card
                  title="Tailored Resume Output"
                  description="Optimized text with custom core competencies appended"
                  headerIcon={FileText}
                >
                  {(() => {
                    const analysis = analyzeResumeATS(resumeText, jobDescription);
                    const missing = analysis.missingKeywords;
                    const tailoredText = missing.length > 0 
                      ? `${resumeText.trim()}\n\n### CORE COMPETENCIES & KEYWORDS\n${missing.join(' | ')}`
                      : resumeText.trim();
                    
                    return (
                      <div className="space-y-4">
                        <textarea
                          readOnly
                          value={tailoredText}
                          rows={14}
                          className="w-full rounded-xl p-4 text-xs text-gray-300 font-sans glass-input resize-none bg-dark-950/40 border border-white/5 h-[340px]"
                        />
                        <p className="text-[10px] text-gray-500 leading-normal italic text-left">
                          * A clean "CORE COMPETENCIES & KEYWORDS" section has been appended to the bottom, containing all missing skills. This allows the ATS parser to successfully index your profile for this job posting without altering the accuracy of your job history.
                        </p>
                      </div>
                    );
                  })()}
                </Card>
              </div>
            </div>
          ) : (
            /* Empty State for Tailor Tool */
            <div className="max-w-md mx-auto text-center py-12">
              <Card className="p-8 border border-white/5">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                    <Target size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">No Inputs Provided</h3>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-sm mb-4">
                    Please paste your Resume and the target Job Description in the Analyzer tab before trying to generate a tailored profile.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setCurrentView('analyzer')}
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Go to Analyzer
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* ATS Guidelines View */}
      {currentView === 'guidelines' && (
        <div className="space-y-8 animate-fade-in-up">
          <section className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/25 text-brand-blue text-xs font-semibold mb-5">
              <Sparkles size={12} />
              <span>ATS Navigation Strategies</span>
            </div>
            <h1 className="text-4xl font-heading font-extrabold text-white tracking-tight mb-4">
              Applicant Tracking System Guidelines
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Automated parser engines filter over 75% of applications before a recruiter ever reviews them. Follow these design and formatting standards.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="File Formats & Naming" headerIcon={FileText}>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Always save files in <strong>PDF</strong> or <strong>DOCX</strong> formats. PDF is best for layout stability, but some older systems parse Word documents better.
              </p>
              <ul className="text-xs text-gray-400 space-y-1.5 pl-4 list-disc">
                <li>Name your file: <code>Firstname_Lastname_Resume.pdf</code></li>
                <li>Avoid saving as images, which parsers cannot read.</li>
              </ul>
            </Card>

            <Card title="Experience Layout" headerIcon={Layers}>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Stick to linear layouts and standardized headings. Multi-column grids look nice to humans but often cause parsers to read rows out of order.
              </p>
              <ul className="text-xs text-gray-400 space-y-1.5 pl-4 list-disc">
                <li>Use headers like "Work Experience", "Education".</li>
                <li>Write dates clearly: <code>MM/YYYY - MM/YYYY</code>.</li>
              </ul>
            </Card>

            <Card title="Keyword Optimization" headerIcon={Target}>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Match the vocabulary in the job description closely. If a job posting lists "React Native", write "React Native" rather than just "mobile development".
              </p>
              <ul className="text-xs text-gray-400 space-y-1.5 pl-4 list-disc">
                <li>Do not hide keywords in white font (spam filters detect it).</li>
                <li>Aim for natural keyword integration of 1-3 times each.</li>
              </ul>
            </Card>

            <Card title="Fonts & Typography" headerIcon={BookOpen}>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Use clean, standard sans-serif system fonts. Avoid custom decorative symbols, diagrams, or graphical lines which interrupt parsing.
              </p>
              <ul className="text-xs text-gray-400 space-y-1.5 pl-4 list-disc">
                <li>Use Arial, Inter, Calibri, or Helvetica.</li>
                <li>Do not mix more than two font families.</li>
              </ul>
            </Card>

            <Card title="Quantify Achievements" headerIcon={TrendingUp}>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Parsers search for indicators of value. Experience bullets that feature numbers, volume metrics, and currency ratios score much higher.
              </p>
              <ul className="text-xs text-gray-400 space-y-1.5 pl-4 list-disc">
                <li>Instead of "improved sales", write "boosted sales by 24%".</li>
                <li>Incorporate dollars, percentages, or time saved.</li>
              </ul>
            </Card>

            <Card title="Contact Info Placement" headerIcon={Settings}>
              <p className="text-xs text-gray-400 leading-relaxed mb-3">
                Place your phone number, email, and social links in the main body text, not inside document header and footer margins.
              </p>
              <ul className="text-xs text-gray-400 space-y-1.5 pl-4 list-disc">
                <li>Many parsers skip the top and bottom margins completely.</li>
                <li>Always include a link to your active LinkedIn profile.</li>
              </ul>
            </Card>
          </div>

          <div className="flex justify-center pt-6">
            <Button
              variant="primary"
              onClick={() => setCurrentView('analyzer')}
              icon={ArrowRight}
              iconPosition="right"
            >
              Start Analyzing Now
            </Button>
          </div>
        </div>
      )}

      {/* Settings View */}
      {currentView === 'settings' && (
        <div className="space-y-8 animate-fade-in-up">
          <section className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-indigo/10 border border-brand-indigo/25 text-brand-indigo text-xs font-semibold mb-5">
              <Settings size={12} className="animate-spin" style={{ animationDuration: '4s' }} />
              <span>User & Analysis Configurations</span>
            </div>
            <h1 className="text-4xl font-heading font-extrabold text-white tracking-tight mb-4">
              Application Settings
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Configure analysis parameters, custom footer email details, and layout theme preferences.
            </p>
          </section>

          <div className="max-w-2xl mx-auto space-y-6">
            <Card
              title="Personal Information"
              description="Customize information displayed throughout the scanner"
              headerIcon={FileText}
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="settings-email" className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                    Contact Email Address (Footer Link)
                  </label>
                  <input
                    id="settings-email"
                    type="email"
                    value={customEmail}
                    onChange={(e) => {
                      setCustomEmail(e.target.value);
                      localStorage.setItem('resume_ats_email', e.target.value);
                    }}
                    placeholder="Enter your email address..."
                    className="w-full rounded-xl p-3.5 text-xs text-white glass-input font-sans bg-slate-900/50"
                  />
                </div>
              </div>
            </Card>

            <Card
              title="Analysis Preferences"
              description="Adjust strictness thresholds for ATS compatibility scoring"
              headerIcon={Target}
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="settings-threshold" className="text-xs font-bold text-gray-300 uppercase tracking-wide flex justify-between">
                    <span>Minimum Passing Match Score</span>
                    <span className="text-brand-indigo">{minScoreThreshold}%</span>
                  </label>
                  <input
                    id="settings-threshold"
                    type="range"
                    min="40"
                    max="90"
                    step="5"
                    value={minScoreThreshold}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setMinScoreThreshold(val);
                      localStorage.setItem('resume_ats_threshold', val.toString());
                    }}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-indigo"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                    <span>40% (Lenient)</span>
                    <span>70% (Default)</span>
                    <span>90% (Strict)</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Save Confirmation Button */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <p className="text-[11px] text-gray-500 italic">
                * Preferences are saved automatically to your browser's local storage.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="glass"
                  onClick={() => {
                    localStorage.removeItem('resume_ats_email');
                    localStorage.removeItem('resume_ats_threshold');
                    setCustomEmail('radhikatriv0712@gmail.com');
                    setMinScoreThreshold(70);
                    addToast('info', 'Settings reset to system defaults.');
                  }}
                  className="hover:text-white"
                >
                  Reset Defaults
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setCurrentView('analyzer');
                    addToast('success', 'Configurations saved successfully.');
                  }}
                  icon={Check}
                >
                  Back to Analyzer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
