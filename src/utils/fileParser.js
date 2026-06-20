// Utility for parsing text from PDF, DOCX, and TXT files using CDN libraries loaded dynamically

const loadScript = (id, src) => {
  return new Promise((resolve, reject) => {
    // If the script already exists, check if the library is loaded
    const existingScript = document.getElementById(id);
    if (existingScript) {
      const isLoaded = id === 'pdfjs-script' ? window.pdfjsLib : window.mammoth;
      if (isLoaded) {
        resolve(isLoaded);
      } else {
        // Wait for onload of existing script
        const prevOnload = existingScript.onload;
        existingScript.onload = (e) => {
          if (prevOnload) prevOnload(e);
          resolve(id === 'pdfjs-script' ? window.pdfjsLib : window.mammoth);
        };
      }
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => {
      resolve(id === 'pdfjs-script' ? window.pdfjsLib : window.mammoth);
    };
    script.onerror = (err) => {
      reject(new Error(`Failed to load script: ${src}`));
    };
    document.head.appendChild(script);
  });
};

const loadPdfJs = async () => {
  const pdfjsLib = await loadScript('pdfjs-script', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    return window.pdfjsLib;
  }
  throw new Error('PDF.js failed to initialize');
};

const loadMammoth = async () => {
  await loadScript('mammoth-script', 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
  if (window.mammoth) {
    return window.mammoth;
  }
  throw new Error('Mammoth failed to initialize');
};

/**
 * Extract text from a File object (.txt, .pdf, .docx)
 * @param {File} file 
 * @returns {Promise<string>}
 */
export const extractTextFromFile = async (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  
  if (extension === 'txt') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  }
  
  if (extension === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = await loadPdfJs();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      let lastY = null;
      let pageText = '';
      for (const item of textContent.items) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += '\n';
        } else if (pageText && !pageText.endsWith('\n') && !pageText.endsWith(' ')) {
          pageText += ' ';
        }
        pageText += item.str;
        lastY = item.transform[5];
      }
      fullText += pageText + '\n';
    }
    return fullText;
  }
  
  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const mammoth = await loadMammoth();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }
  
  throw new Error(`Unsupported file type: .${extension}`);
};
