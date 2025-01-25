var MusicStatus = cc.Enum({
    None: 1,
    Playing: 2,
    Pause: 3,
});

module.exports =
{
    audioList: {},
    musicState: 0,
    audioState: 0,

    isMusicPlaying: false,
    bomb: "bomb",
    mute: "mute",
    music: "bgm",
    hit1: "hit4",
    shootAudio: "hit3",
    click: "click",
    bindAudio: "Rising Combo Hit 0",
    lightning: "lightning",
    bindAudioIndex: 0,

    audioTimes: [],
    audioRuntimeTimes: [],

    audioInteral: 30,//毫秒
    lastAudioTime: 0,
    audioCntInFrame: 0,
    frame: 0,

    audioSource: null,

    init(audioSource, bgmAudioSource) {

        if (audioSource) this.audioSource = audioSource;
    },


    playAudio(url, loop, isMusic) {

        return;
        if (!url) return;


        if (url == this.bindAudio) {
            this.bindAudioIndex++;
            if (this.bindAudioIndex > 5) this.bindAudioIndex = 1;
            url = this.bindAudio + this.bindAudioIndex;
        }

        let clip = this.audioList[url];

        if (cc.isValid(clip)) {

            this.realPlayAudio(clip, loop, isMusic);
            return;
        }

        let url1 = 'Audio/' + url;

        cc.resources.load(url1, cc.AudioClip, (err, clip) => {
            if (err) {
                console.log("music error : " + url1)
                console.log(err);
                return;
            }

            this.audioList[url] = clip;

            this.realPlayAudio(clip, loop, isMusic);
        });
    },

    realPlayAudio(clip, loop, isMusic) {
        
        return;
        
        let volume = 1;

         if (isMusic) {
            volume = 0.4;
            if (!this.musicState) {
                volume = 0;
                return;
            }
        }
        else if (!this.audioState) {

            volume = 0;
            return;
        }

        if (isMusic) {
            if (this.bgmAudioSource) {
                this.bgmAudioSource.volume = volume;
                this.bgmAudioSource.loop = loop;
                this.bgmAudioSource.clip = clip;
                this.bgmAudioSource.play();
            }
        }
        else {
            if (this.audioSource) this.audioSource.playOneShot(clip);
        }
    },
}