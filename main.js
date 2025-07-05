const input = document.getElementById('input');
const qrImage = document.getElementById('qr');
const placeholder = document.getElementById('placeholder');
const resultSection = document.getElementById('result-section');
const downloadOptions = document.getElementById('download-options');
const sizeSelect = document.getElementById('size');
const colorSelect = document.getElementById('color');
const bgColorSelect = document.getElementById('bg-color');

// Initially hide download options
downloadOptions.style.display = 'none';

function generateQR() {
    const text = input.value.trim();
    const size = sizeSelect.value;
    const color = colorSelect.value.substring(1); // Remove # for the QRCode library
    const bgColor = bgColorSelect.value.substring(1);
    
    if (!text) {
        alert('Please enter some text or URL to generate QR code');
        return;
    }
    
    // Show loading state
    placeholder.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Generating QR Code...</p>';
    qrImage.style.display = 'none';
    
    // Generate QR code
    QRCode.toDataURL(text, {
        width: size,
        height: size,
        color: {
            dark: `#${color}`,
            light: `#${bgColor}`
        },
        margin: 2
    }, (err, url) => {
        if (err) {
            console.error(err);
            placeholder.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>Error generating QR code</p>';
            return;
        }
        
        // Display QR code
        qrImage.src = url;
        qrImage.style.display = 'block';
        placeholder.style.display = 'none';
        downloadOptions.style.display = 'flex';
        
        // Store the current QR code data for download
        qrImage.dataset.qrUrl = url;
    });
}

function downloadQR(format) {
    if (!qrImage.dataset.qrUrl) return;
    
    const text = input.value.trim() || 'qr-code';
    const filename = `qr-genius-${text.substring(0, 20).replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${format}`;
    
    // Create a temporary link
    const link = document.createElement('a');
    link.href = qrImage.dataset.qrUrl;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show download confirmation
    const originalText = event.target.innerHTML;
    event.target.innerHTML = `<i class="fas fa-check"></i> Downloaded!`;
    setTimeout(() => {
        event.target.innerHTML = originalText;
    }, 2000);
}

// Allow generating QR code with Enter key
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateQR();
    }
});

// Improved color picker labels
colorSelect.addEventListener('input', (e) => {
    document.querySelector('label[for="color"]').innerHTML = `Color: <span style="color: ${e.target.value}">${e.target.value}</span>`;
});

bgColorSelect.addEventListener('input', (e) => {
    document.querySelector('label[for="bg-color"]').innerHTML = `Background: <span style="color: ${e.target.value}">${e.target.value}</span>`;
});