import React, {useEffect, useCallback, useState} from "react";
import { invoke } from '@tauri-apps/api'

// TODO: separar en otro archivo (types, constants)
interface WordRowProps {
	row: string[],
	index: number
};
interface LetterProps {
	letter: string,
	clueClass: string
};
const InitialRows: string[][] = [
	['', '', '', '', '', ''],
	['', '', '', '', '', ''],
	['', '', '', '', '', ''],
	['', '', '', '', '', ''],
	['', '', '', '', '', ''],
	['', '', '', '', '', ''],
];
const GameContainer = () => {

	// TODO: usar InitialRows cuando termine el testeo
	const [wordRows, setWordRows] = useState([
		['B', 'A', 'A', 'N', 'E', 'F'],
		['', '', '', '', '', ''],
		['', '', '', '', '', ''],
		['', '', '', '', '', ''],
		['', '', '', '', '', ''],
		['', '', '', '', '', ''],
	]);
	// const [wordRows, setWordRows] = useState(InitialRows);
	const [clues, setClues] = useState(InitialRows);

	const handleSubmit = () => {

		// agarrar la palabra correspondiente al turno
		const theWord = wordRows[0].join('');

		invoke('check_word', { wordGuess: theWord })
			.then((response) => {
				let stringResponse: string = response as string;
				let newClues: string[][] = [stringResponse.split('')];
				let oldClues: string[][] = clues.slice(1);
				newClues = newClues.concat(oldClues);
				setClues(newClues);
			})
			.catch((error) => console.log(error))
			.finally(() => {
			})
	}

	const handleKeyDown = useCallback((event: KeyboardEvent) => {
		const { key, keyCode } = event;
		if (keyCode === 13) {
			// TODO: validar cantidad de letras antes del submit o hacer que check_word tire error??
			handleSubmit();
		}
		if (keyCode >= 65 && keyCode <= 90) {
			// TODO: tienen que completar la linea del turno actual
			alert(`Key pressed ${key} \n Key code Value: ${keyCode}`);
		}
	}, []);

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown, false);

		return () => document.removeEventListener("keydown", handleKeyDown, false);
	}, [handleKeyDown]);

	const WordsContainer: React.FunctionComponent = () =>
		<div className='wordsContainer'>
			{wordRows.map((row, index) => <WordRow key={`${index}`} row={row} index={index}/>)}
		</div>;

	const WordRow: React.FunctionComponent<WordRowProps> = ({row, index}) =>
		<div className='wordRow'>
			{row.map((letter, lIndex) => {
				// TODO: separar en funcion o que la funcion del back-end retorne la palabra?
				let clueClass: string = '';
				
				if (clues[index][lIndex]) {
					clueClass = 'green';
					if (clues[index][lIndex] === '!') {
						clueClass = 'yellow';
					}
					if (clues[index][lIndex] === 'x') {
						clueClass = 'red';
					}
				}
				return(
					<Letter key={`${lIndex}`} letter={letter} clueClass={clueClass}/>
				);
			})}
		</div>;

	const Letter: React.FunctionComponent<LetterProps> = ({letter, clueClass}) => 
		<div className={(letter ? 'letter ' : 'emptyLetter ') + clueClass}>{letter}</div>;

	return(
		<div className='gameContainer'>
			<WordsContainer/>
		</div>
	);
}

export default GameContainer;