new Vue({
	el: '#app',
	//変数定義
	data: {
		status: 'ready',     // 状況
		recorder: null,     // 音声にアクセスする "MediaRecorder" のインスタンス
		audioData: [],      // 入力された音声データ
		audioExtension: '',  // 音声ファイルの拡張子
		randomcl: '',		//ランダムな文字
		apihash: location.hash.replace('#','')
	},

	methods: {
		startRecording() {
			this.status = 'recording';
			this.audioData = [];
			this.randomcl = this.randomClganerate();
			document.getElementById("random").innerHTML = '<h1 class="btn btn-primary"><div id="bigfont">『'+this.randomcl+'』</div></h1>';

			if(this.recorder.state==="inactive"){
				this.recorder.start();
			}else if(this.recorder.state==="paused"){
				this.recorder.resume();
			}

			setTimeout(this.stopRecording,2100);//2秒後に停止
		},

		stopRecording() {
			this.recorder.requestData();
			this.recorder.pause();
			//this.recorder.stop();
			this.status = 'ready';
			document.getElementById("random").innerHTML = "";
		},

		getExtension(audioType) {
			let extension = 'wav';
			const matches = audioType.match(/audio\/([^;]+)/);
			if(matches) {
				extension = matches[1];
			}
			return '.'+ extension;
		},

		randomClganerate() {
			let cls = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
			let length = cls.length;
			return cls[Math.floor(Math.random()*length)];
		}
	},

	mounted() {
		navigator.mediaDevices.getUserMedia({ video: false, audio: true })
			.then(stream => {

				this.recorder = new MediaRecorder(stream);

				//オーディオデータ利用可能時
				this.recorder.addEventListener('dataavailable', e => {
					console.log("dataavailable")
					this.audioData.push(e.data);
					this.audioExtension = this.getExtension(e.data.type);
				});

				//オーディオ一時停止時
				this.recorder.addEventListener('pause', () => {
					console.log("pause")
					let audioBlob = new Blob(this.audioData);
					console.log(this.recorder.state)

					//Dropboxにアップロード
					//let dbx = new Dropbox.Dropbox({ accessToken: this.apihash });
					//dbx.filesUpload({path:'/'+this.randomcl+String(Date())+this.audioExtension,contents:audioBlob,mode:'overwrite' })

					//ローカルにダウンロード
					//const url = URL.createObjectURL(audioBlob);
					//let a = document.createElement('a');
					//a.href = url;
					//a.download = Math.floor(Date.now() / 1000) + this.audioExtension;
					//document.body.appendChild(a);
					//a.click();
				});

				//オーディオ一時停止時
				this.recorder.addEventListener('stop', () => {
					console.log("stop")
					let audioBlob = new Blob(this.audioData);

					//Dropboxにアップロード
					//let dbx = new Dropbox.Dropbox({ accessToken: this.apihash });
					//dbx.filesUpload({path:'/'+this.randomcl+String(Date())+this.audioExtension,contents:audioBlob,mode:'overwrite' })

					//ローカルにダウンロード
					//const url = URL.createObjectURL(audioBlob);
					//let a = document.createElement('a');
					//a.href = url;
					//a.download = Math.floor(Date.now() / 1000) + this.audioExtension;
					//document.body.appendChild(a);
					//a.click();
				});

				this.status = 'ready';


			});
	}
});
