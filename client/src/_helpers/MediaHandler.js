export class MediaHandler {
  constructor() {
    this.stream = null;
  }
  getPremissions() {
    return new Promise((resolve, rej) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(stream => {
          this.stream = stream;
          resolve(stream);
        })
        .catch(err => {
          throw new Error("Unable to fetch stream " + err);
        });
    });
  }
  stopRecoring() {
    this.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
}
