(function() {
    const qrcode = window.qrcode;
  
    const video = document.createElement("video");
    const canvasElement = document.getElementById("qr-canvas");
    const canvas = canvasElement.getContext("2d");
    
    const qrResult = document.getElementById("qr-result");
    const outputData = document.getElementById("outputData");
    const btnScanQR = document.getElementById("btn-scan-qr");

    const idSearchInput = document.querySelector('input[name="id_search"]');
    const form = document.querySelector('form');

    let scanning = false;
  
    qrcode.callback = (res) => {
      if (res) {
        outputData.innerText = res;
        scanning = false;
  
        video.srcObject.getTracks().forEach(track => track.stop());
  
        qrResult.hidden = true;
        btnScanQR.hidden = false;
        canvasElement.hidden = true;
        
        idSearchInput.value = res;
        form.submit();
      }
    };
  
    btnScanQR.onclick = () =>
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          scanning = true;
          qrResult.hidden = true;
          btnScanQR.hidden = true;
          canvasElement.hidden = false;
          video.setAttribute("playsinline", true); // iOS Safari
          video.srcObject = stream;
          video.play();
          tick();
          scan();
        });
  
    function tick() {
      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
  
      scanning && requestAnimationFrame(tick);
    }
  
    function scan() {
      try {
        qrcode.decode();
      } catch (e) {
        setTimeout(scan, 300);
      }
    }
  })();
  