import React, { useState } from 'react';
import './index.less';

const choices = ['Kéo', 'Búa', 'Bao'];

export default function OanTuTi() {
	const [playerChoice, setPlayerChoice] = useState('');
	const [computerChoice, setComputerChoice] = useState('');
	const [result, setResult] = useState('');
	const [history, setHistory] = useState([]);

	const getComputerChoice = () => {
		const randomIndex = Math.floor(Math.random() * 3);
		return choices[randomIndex];
	};

	const getResult = (player, computer) => {
		if (player === computer) return 'Hòa';

		if (
			(player === 'Kéo' && computer === 'Bao') ||
			(player === 'Bao' && computer === 'Búa') ||
			(player === 'Búa' && computer === 'Kéo')
		) {
			return 'Thắng';
		}

		return 'Thua';
	};

	const handlePlay = (choice) => {
		const computer = getComputerChoice();
		const gameResult = getResult(choice, computer);

		setPlayerChoice(choice);
		setComputerChoice(computer);
		setResult(gameResult);

		setHistory([
			...history,
			{
				player: choice,
				computer: computer,
				result: gameResult,
			},
		]);
	};

	return (
		<div className='oan-tu-ti'>
			<h2>🎮 Trò Chơi Oẳn Tù Tì</h2>

			<div className='choices'>
				{choices.map((choice) => (
					<button key={choice} onClick={() => handlePlay(choice)}>
						{choice}
					</button>
				))}
			</div>

			<div className='result'>
				<h3>Kết quả:</h3>
				<p>Người chơi: {playerChoice}</p>
				<p>Máy: {computerChoice}</p>
				<p
					className={
						result === 'Thắng' ? 'status-win' : result === 'Thua' ? 'status-lose' : result === 'Hòa' ? 'status-tie' : ''
					}
				>
					Kết quả: {result}
				</p>
			</div>

			<div className='history'>
				<h3>Lịch sử chơi:</h3>
				<ul>
					{history.map((item, index) => (
						<li key={index}>
							Ván {index + 1}: {item.player} - {item.computer} → {item.result}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
