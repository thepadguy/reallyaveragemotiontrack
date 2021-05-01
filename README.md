# reallyaveragemotiontrack

## Welcome to face track (a really average motion tracker)
https://facetrack-2d110.web.app
(Hosted on firebase)

### About
Just a simple project. By moving in front of the webcamera, you can select a letter and after some time you will have made a whole sentence!
Yes, it has average to bad design. Yes, it has problems. Yes, it lags on my Android too. Yes, it still has console outputs (probably, don't remember if I erased them). Yes, it can be improved a LOT. Yes, it serves no practical use. Yes, it could have text-to-speech (I thought about that too, but I did not want to use any third-party libraries in this project). Yes, there (possibly) are a lot of issues and bugs and poor choices in the code and so on. But who cares?
There are many products out there that do the exact same thing but a million times better. So there is no need to judge as if this is the code our future depends on.
Facetrack was created for the developer to pass his time in a fun way, whithout being there any pressure in the form of "Yeah, but did I choose the correct color palette? Am I protected from cyber-attacks? Can my code run 10ms faster?", and it pretty much served its purpose, I honestly enjoyed this week.

### How to use
Upon opening the site you will be greeted by a black screen. Please allow camera access because the whole thing depends on the camera. Those white areas in the camera area (canvas), are the darker colors in the video feed, and everything else are the lighter colors, please note, the camera is no the whole screen, it is a 640x480 px window. The way facetrack works is that it calculates the number of white pixels in each frame and compares them with the previous number, if the difference is above a certain threshold we got movement. Please move your head (and/or camera) so that there are as less whites as possible in the camera area (you can do this by moving your eye close to the camera). When you are ready left-click on the camera area and click ok on the initializing alert, this starts the calibration process where facetrack calculates the number of white pixels created by noise so please stay still until the second alert appears. After a few seconds another alert will appear, here it callibrates motion, please move your head slightly as if you are nodding or looking to the side. If everything goes well, you will see no alert when the progressbar finishes (if an alert appears please reload the page and try everything again), then a letter (A) will appear and a new progress bar. If no motion is detected 'till the progressbar finishes, the letter will change. If motion is detected then that letter will be added to the already written text. There is a space option after 'z' and there is no backspace option.
