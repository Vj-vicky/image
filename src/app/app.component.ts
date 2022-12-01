import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'image';



  constructor(public http: HttpClient,) {

  }
  // ngOnInit() {
  //   console.log("vicky")
  //   // this.camera();

  // }


  // openCam() {

  // }


  WIDTH = 640;
  HEIGHT = 480;

  @ViewChild("video")
  public video!: ElementRef;

  @ViewChild("canvas")
  public canvas!: ElementRef;

  captures: string[] = [];
  error: any;
  isCaptured!: boolean;

  async ngAfterViewInit() {
    // await this.setupDevices();
  }


  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
          this.capture()
        } else {
          this.error = "You have no output video device";
        }
      } catch (e) {
        this.error = e;
      }
    }
  }

  // capture() {
  //   this.drawImageToCanvas(this.video.nativeElement);
  //   this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
  //   this.isCaptured = true;
  // }

  removeCurrent() {
    this.isCaptured = false;
  }

  setPhoto(idx: number) {
    this.isCaptured = true;
    var image = new Image();
    image.src = this.captures[idx];
    this.drawImageToCanvas(image);
  }

  drawImageToCanvas(image: any) {
    this.canvas.nativeElement
      .getContext("2d")
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }


  /** Timer Used Captured Photo */

  // capture() {
  //   setInterval(() => {
  //     this.drawImageToCanvas(this.video.nativeElement);
  //     this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
  //     console.log(this.captures.length)
  //     this.isCaptured = true;
  //   }, 2000);
  // }

  capture() {
    var timer = setInterval(() => {
      this.drawImageToCanvas(this.video.nativeElement);
      var captureIMage = this.canvas.nativeElement.toDataURL("image/png")
      this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
      console.log(this.captures.length)
      this.uploadeImgDB(captureIMage);
      if (this.captures.length >= 10) {
        clearInterval(timer);
        this.onStop()
      }
      this.isCaptured = true;
    }, 2000);
  }

  /** Stop the Video */
  onStop() {
    this.video.nativeElement.pause();
    (this.video.nativeElement.srcObject as MediaStream).getVideoTracks()[0].stop();
    this.video.nativeElement.srcObject = null;
  }


  uploadeImgDB(captures: any) {
    var baseURL = "http://localhost:8080/MyProjectService/user/fileUpload";
    const formData = new FormData();
    formData.append('proof', captures);
    this.http.post(baseURL, formData).subscribe(resp => {
      console.log(resp);
    })
  }
}
