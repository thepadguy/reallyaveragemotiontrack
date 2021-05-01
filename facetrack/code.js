function greeter() {
    alert("Welcome to facetrack. Please refer to\n https://github.com/thepadguy/reallyaveragemotiontrack \nfor help.");
}

var framerate;
var constraints = {
    audio: false,
    video: { width: 640, height: 480 }
};
navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);

function success(stream) {
    var video = document.querySelector("#videoElement");
    video.srcObject = stream;
    framerate = stream.getVideoTracks()[0].getSettings().frameRate;
    if (framerate > 30) {
        framerate = 30;
    }
    framerate = 100;
    console.log(framerate);
}

function error(error) {
    console.log(error);
}

//now let's create a canvas
var video = document.querySelector("#videoElement");

var canvas = document.getElementById("canvas");
canvas.width = 640;
canvas.height = 480;
var context = canvas.getContext('2d');
context.translate(640, 0);
context.scale(-1, 1);

//for second canvas position
var incanv = document.getElementById("innercanvas");
var incont = incanv.getContext('2d');
var outcanvtop = canvas.getBoundingClientRect().top;
var topstr = (-1 * (incanv.getBoundingClientRect().top - outcanvtop) + 120).toString() + "px;";
incanv.setAttribute("style", "top: " + topstr);

//for progressbar position
var progressbar = document.getElementById("CalibProgress");
//place it 30px below innercanvas
var progressbartop = progressbar.getBoundingClientRect().top;
var incanvtop = incanv.getBoundingClientRect().top;
var incanvheight = 240;
var incanvbottom = incanvtop + 240;
var topstr = (incanvheight + incanvtop + 30).toString() + "px;"

var widestr = document.getElementById("container").getBoundingClientRect().width.toString() + "px;"
progressbar.setAttribute("style", "top: " + topstr + " width: " + widestr);

//for timebar width
var timebar = document.getElementById("TimeProgress");
var keysarea = document.getElementById("keysarea");
var keysareawidth = keysarea.getBoundingClientRect().width;
var widthstring = keysareawidth.toString() + "px;";
timebar.setAttribute("style", "width: " + widthstring);

//for keyscontainer height
var keysarea = document.getElementById("keysarea");
var textinside = document.getElementById("optionsparagraph");
//for constantly updating text
setInterval(() => {
    var bottomoftextplus = textinside.getBoundingClientRect().height + 50;
    var heightstr = bottomoftextplus.toString() + "px;";
    keysarea.setAttribute("style", "height: " + heightstr);
}, 10);


//do the same thing for the written container
var writtencontainer = document.getElementById("writtencontainer");
var textinsidewritten = document.getElementById("writtenarea");
//for constantly updating text
setInterval(() => {
    var bottomoftextplus = textinsidewritten.getBoundingClientRect().height + 50;
    var heightstr = bottomoftextplus.toString() + "px;";
    writtencontainer.setAttribute("style", "height: " + heightstr);
}, 10);

setInterval(capture, 1000 / framerate);

//vars for processing
var imgData;
var inx = incanv.getBoundingClientRect().x - canvas.getBoundingClientRect().x;
var iny = incanv.getBoundingClientRect().y - canvas.getBoundingClientRect().y;
var inwidth = incanv.getBoundingClientRect().width;
var inheight = incanv.getBoundingClientRect().height;
var i;
var sum = 0;
var average = 0;
var newData;

var prevDatawhites = 0;
var newDatawhites = 0;
var whitedifference;
var prevData = null;
var currData = null;
var threshold = 190; //can detect frowns
var calibrArr = [];
var frownArr = [];

function capture() {
    context.drawImage(video, 0, 0, 640, 480);
    imgData = context.getImageData(inx, iny, inwidth, inheight);
    newData = [...imgData.data];


    //try {
    if (prevData == null) {
        console.log("isnull");
        whitedifference = 0;
    } else {
        //for finding average
        for (i = 0; i < newData.length; i += 4) {
            sum += newData[i] + newData[i + 1] + newData[i + 2];
        }
        average = sum / (0.75 * newData.length);

        for (i = 0; i < newData.length; i += 4) {
            if ((newData[i] + newData[i + 1] + newData[i + 2]) >= (1.3 * average)) {
                newData[i] = 0;
                newData[i + 1] = 0;
                newData[i + 2] = 0;
                newData[i + 3] = 255;
            } else {
                newData[i] = 255;
                newData[i + 1] = 255;
                newData[i + 2] = 255;
                newData[i + 3] = 255;
            }
        }

        if (shouldItCalibrate == true) {
            for (i = 0; i < prevData.length; i += 4) {
                if (prevData[i] == 255) {
                    prevDatawhites += 1;
                }
            }

            for (i = 0; i < newData.length; i += 4) {
                if (newData[i] == 255) {
                    newDatawhites += 1;
                }
            }

            whitedifference = Math.abs(newDatawhites - prevDatawhites);
            calibrArr.push(whitedifference);
        }

        if (shouldItFrown == true) {
            for (i = 0; i < prevData.length; i += 4) {
                if (prevData[i] == 255) {
                    prevDatawhites += 1;
                }
            }

            for (i = 0; i < newData.length; i += 4) {
                if (newData[i] == 255) {
                    newDatawhites += 1;
                }
            }

            whitedifference = Math.abs(newDatawhites - prevDatawhites);
            frownArr.push(whitedifference);
        }


        if (shouldItCalcDifference == true) {
            //for calculating white difference
            for (i = 0; i < prevData.length; i += 4) {
                if (prevData[i] == 255) {
                    prevDatawhites += 1;
                }
            }

            for (i = 0; i < newData.length; i += 4) {
                if (newData[i] == 255) {
                    newDatawhites += 1;
                }
            }

            whitedifference = Math.abs(newDatawhites - prevDatawhites);
            if (whitedifference > threshold) {
                if ((3 < tempmotioncount) && (tempmotioncount <= 8)) {
                    tempmotioncount = 0;
                    console.log("movement");
                    addText();
                } else {
                    tempmotioncount++;
                }
            }
        }

        //setting the stuff
        for (i = 0; i < imgData.data.length; i += 1) {
            imgData.data[i] = newData[i];
        }
    }
    incont.clearRect(0, 0, inwidth, inheight)
    incont.putImageData(imgData, 0, 0);
    average = 0;
    sum = 0;
    prevData = [...imgData.data];
    newDatawhites = 0;
    prevDatawhites = 0;
    whitedifference = 0;
}


//vars for initializer
var isInitialized = false;
var shouldItCalcDifference = false;
var isCalibBarStarted = false;
var isFrownBarStarted = false;
var shouldItCalibrate = false;
var shouldItFrown = false;
var tempmotioncount = 0;

//let's create the initializer function
function initializer() {
    console.log("initializing");
    setTimeout(() => {
        alert("Initialized successfully");
        isInitialized = true;
        console.log(isInitialized);
        setTimeout(() => {
            shouldItCalibrate = true;
            moveCalibBar();
        }, 50);

    }, 1000);
}

//move calibration progress bar
function moveCalibBar() {
    if (isCalibBarStarted == false) {
        isCalibBarStarted = true;
        var elem = document.getElementById("CalibBar");
        var width = 0;
        var id = setInterval(frame, 1000 / 100);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
                elem.style.width = "0%";
                shouldItCalibrate = false;
                console.log(calibrArr);
                processing();
            } else {
                width += 2;
                elem.style.width = width + "%";
            }
        }
    }
}

var maxcalib = 0;
function processing() {
    //find max difference
    for (const dif of calibrArr) {
        if (dif >= maxcalib) {
            maxcalib = dif;
        }
    }
    console.log(maxcalib);
    alert("Please move repeatedly.");
    setTimeout(() => {
        shouldItFrown = true;
        moveCalibFrown();
    }, 50);

}

function moveCalibFrown() {
    if (isFrownBarStarted == false) {
        isFrownBarStarted = true;
        var elem = document.getElementById("CalibBar");
        var width = 0;
        var id = setInterval(frame, 1000 / 100);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
                elem.style.width = "0%";
                shouldItFrown = false;
                console.log(calibrArr);
                processFrown();
            } else {
                width += 2;
                elem.style.width = width + "%";
            }
        }
    }
}

function processFrown() {
    var maxfrown = 0;
    for (const frown of frownArr) {
        if (frown >= maxfrown) {
            maxfrown = frown;
        }
    }
    console.log(maxfrown);
    if (maxfrown <= maxcalib) {
        alert("We got a problem here, max frown <= max calib. Please reload the screen to recalibrate.");
        return;
    }
    //else we find the average and go on
    threshold = (0.75 * (maxfrown - maxcalib)) + maxcalib;
    console.log("maxcalib: " + maxcalib.toString() + " maxfrown: " + maxfrown.toString() + " threshold: " + threshold.toString())
    shouldItCalcDifference = true;
    initTheText();
}



//for letter choosing
var commandsList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "SPACE"];
//for writting the text and doing all that
var shouldTimerRun = false;
var shouldTextBeDisplayed = false;
var letterNum = 0; //from 0 to 27 for every command in commandsList
var isMovementDetected = false;
function initTheText() {
    moveTheTime();
    var commandsPar = document.getElementById("optionsparagraph");
    //create an interval for constantly updating the text, update time equal to all update times to sync it
    var updaterInterval = setInterval(() => {
        commandsPar.innerHTML = commandsList[letterNum];
    }, 10);
}
var width = 0;
var id;
function moveTheTime() {
    var elem = document.getElementById("TimeBar");
    id = setInterval(frame, 10);
    function frame() {
        if (width >= 100) {
            elem.style.width = "0%";
            if (letterNum == 26) {
                letterNum = 0;
            } else {
                letterNum++;
            }
            clearInterval(id);
            width = 0;
            moveTheTime();
        } else {
            width += 1.5;
            elem.style.width = width.toString() + "%";
        }
    }
}

function addText() {
    var writtenarea = document.getElementById("writtenarea");
    if (letterNum == 26) {
        writtenarea.innerHTML = writtenarea.innerHTML + " ";
    } else {
        writtenarea.innerHTML = writtenarea.innerHTML + commandsList[letterNum];
    }
    width = 0;
    letterNum = 0;
    clearInterval(id);
    moveTheTime();
}