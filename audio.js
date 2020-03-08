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
			var cl = this.randomClganerate();
			this.recorder.start();
			//for(var i = this.randomcl.length; i>0; i--){
			//	document.getElementById("random").innerHTML = '<h1 class="btn btn-primary"><div id="bigfont">『'+this.randomcl[0]+'』</div></h1>';
			//	this.randomcl=this.randomcl.replace(this.randomcl[0],"")
			//	this.Sleep(0.1)
			//}

			gn=this
			document.getElementById("random").innerHTML = '<h1 class="btn btn-primary"><div id="bigfont">『'+cl[0]+'』</div></h1>';
			document.getElementById("random2").innerHTML = '<h2>'+1+'/'+cl.length+'</h2>';
			var i = 1;
			var id = setInterval(function(){
				document.getElementById("random").innerHTML = '<h1 class="btn btn-primary"><div id="bigfont">『'+cl[i]+'』</div></h1>';
				document.getElementById("random2").innerHTML = '<h2>'+(i+1)+'/'+cl.length+'</h2>';
				i++;
				if(i > cl.length-1){
					clearInterval(id);//idをclearIntervalで指定している
					gn.stopRecording();
			}}, 2500);
			//this.stopRecording();
		},

		stopRecording() {
			//this.recorder.requestData();
			//this.recorder.pause();
			this.recorder.stop();
			this.status = 'end';
			document.getElementById("set").innerHTML = ''
			document.getElementById("set2").innerHTML = ''
			document.getElementById("random").innerHTML = '<h1>ご協力</h1>';
			document.getElementById("random2").innerHTML = '<h1>ありがとうございました</h1>';
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
			var cls = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
			var ncls = ''

			for(var i = cls.length; i > 0; i--){
				var r = Math.floor(Math.random() * i);
				ncls+=cls[r];
				cls=cls.replace(cls[r],"")
			}
			return ncls;
		},

		relode() {
			window.location.reload();
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
				this.recorder.addEventListener('stop', () => {
					console.log("stop")
					let audioBlob = new Blob(this.audioData);

					//Dropboxにアップロード
					let dbx = new Dropbox.Dropbox({ accessToken: this.apihash });
					dbx.filesUpload({path:'/'+this.randomcl+String(Date())+this.audioExtension,contents:audioBlob,mode:'overwrite' })

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
