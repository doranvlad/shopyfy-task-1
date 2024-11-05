export const videoToggler = (play = false) => ({
  poster: true,
  play,
  togglePlay() {
    this.play = !this.play;
    this.poster = false;

    if (this.play) {
      this.$refs.video.play();
    } else {
      this.$refs.video.pause();
    }
  },
  pauseVideo() {
    this.play = false;
    this.$refs.video.pause();
  },
});
