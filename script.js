var video = document.getElementById('camera');
const canvas = document.getElementById("bbox");
const c = canvas.getContext("2d");

navigator.mediaDevices.getUserMedia({video:true})
    .then(function(stream){
        video.srcObject = stream;
    })
    .catch((err)=>{
        console.log(err);
    })

cocoSsd.load().then(model => {
    setInterval(() => {
        c.clearRect(0,0,canvas.width, canvas.height);
        model.detect(video).then(predictions => {
            if (predictions.length > 0) {
                var bbox = predictions[0].bbox;
                var x = bbox[0];
                var y = bbox[1];
                var width = bbox[2];
                var height = bbox[3];
                var edgeColor = "red";
                var edgeWidth = 2;
                c.strokeStyle = edgeColor;
                c.lineWidth = edgeWidth;
                c.beginPath();
                c.moveTo(x, y);
                c.lineTo(x + width, y);
                c.lineTo(x + width, y + height);
                c.lineTo(x, y + height);
                c.closePath();
                c.stroke();

                
                var detectedObject = predictions[0].class;
                var confidenceScore = predictions[0].score;
                c.font = "20px Arial";
                c.fillText(`${detectedObject} - with ${Math.round(confidenceScore*100)}% confidence`, x,y-10);
            }            
        })
    }, 1000);
})