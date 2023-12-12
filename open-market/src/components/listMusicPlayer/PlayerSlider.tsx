import styled from "@emotion/styled";
import { Common } from "@/styles/common";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";

const SliderContainer = styled("div")`
	width: 700px;
	height: auto;
	background-color: transparent;
	position: relative;

	/*  Hide Original */
	.range {
		-webkit-appearance: none;
		margin: 0 auto;
		background-color: ${Common.colors.gray2};
		width: 100%;
		height: 24px;
		opacity: 0;
		border-radius: 10px;
		cursor: pointer;
	}

	.slider-container {
		--progress-bar-height: 4px;
		position: relative;
		width: 100%;
	}

	.slider-container::before {
		content: "";
		background-color: ${Common.colors.gray};
		width: 99%;
		height: 24px;
		display: block;
		position: absolute;
		border-radius: 10px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		opacity: 1;
	}

	/* Custom Progress Bar */
	.progress-bar-cover {
		background-color: ${Common.colors.emphasize};
		width: 80%;
		height: 24px;
		display: block;
		position: absolute;
		border-radius: 10px;
		top: 50%;
		transform: translateY(-50%);
		z-index: 1;
		user-select: none;
		pointer-events: none;
	}

	/* thumb */
	.range::-webkit-slider-thumb {
		-webkit-appearance: none;
		background-color: white;
		width: 20px;
		height: 20px;
	}

	.thumb {
		z-index: 10;
		position: absolute;
		border-radius: 50%;
		top: 50%;
		transform: translate(0%, -50%);
		pointer-events: none;
		user-select: none;
	}
`;

function PlayerSlider({
	onChange,
	percentage,
}: {
	onChange: ChangeEventHandler;
	percentage: number;
}) {
	const [position, setPosition] = useState(0);
	const [marginLeft, setMarginLeft] = useState(0);
	const [progressBarWidth, setProgressBarWidth] = useState(0);

	const rangeRef = useRef(null);
	const thumbRef = useRef(null);

	useEffect(() => {
		const rangeWidth = (rangeRef.current! as Element).getBoundingClientRect()
			.width;
		const thumbWidth = (thumbRef.current! as Element).getBoundingClientRect()
			.width;
		const centerThumb = (thumbWidth / 100) * percentage * -1;
		const centerProgressBar =
			thumbWidth +
			(rangeWidth / 100) * percentage -
			(thumbWidth / 100) * percentage;
		setPosition(percentage);
		setMarginLeft(centerThumb);
		setProgressBarWidth(centerProgressBar);
	}, [percentage]);

	return (
		<SliderContainer>
			<div className="slider-container">
				<div
					className="progress-bar-cover"
					style={{ width: `${progressBarWidth}px` }}
				></div>
				<div
					className="thumb"
					ref={thumbRef}
					style={{
						left: `${position}%`,
						marginLeft: `${marginLeft}px`,
					}}
				></div>
				<input
					type="range"
					value={position}
					ref={rangeRef}
					step={0.01}
					className="range"
					onChange={onChange}
				/>
			</div>
		</SliderContainer>
	);
}

export default PlayerSlider;
