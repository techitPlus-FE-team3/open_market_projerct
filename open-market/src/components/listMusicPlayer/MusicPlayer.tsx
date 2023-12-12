import ControlPanel from "@/components/listMusicPlayer/ControlPanel";
import PlayerSlider from "@/components/listMusicPlayer/PlayerSlider";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useRef, useState } from "react";

function MusicPlayer({ src }: { src: string }) {
	const [percentage, setPercentage] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);

	function onChange(e) {
		const audio = audioRef.current! as HTMLAudioElement;
		audio.currentTime = (audio.duration / 100) * e.target.value;
		setPercentage(e.target.value);
	}

	const audioRef = useRef(null);

	function handlePlayAndPauseMusic() {
		const audio = audioRef.current! as HTMLAudioElement;
		audio.volume = 0.1;

		if (!isPlaying) {
			setIsPlaying(true);
			audio.play();
		}

		if (isPlaying) {
			setIsPlaying(false);
			audio.pause();
		}
	}

	function getCurrentDuration(e) {
		const percent = (
			(e.currentTarget.currentTime / e.currentTarget.duration) *
			100
		).toFixed(2);
		const time = e.currentTarget.currentTime;

		setPercentage(+percent);
		setCurrentTime(time.toFixed(2));
	}
	return (
		<div>
			<button onClick={handlePlayAndPauseMusic}>
				{isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
			</button>
			<PlayerSlider onChange={onChange} percentage={percentage} />
			<audio
				ref={audioRef}
				onTimeUpdate={getCurrentDuration}
				onLoadedData={(e) => {
					setDuration(+e.currentTarget.duration.toFixed(2));
				}}
				src={src}
			/>
			<ControlPanel duration={duration} currentTime={currentTime} />
		</div>
	);
}

export default MusicPlayer;
