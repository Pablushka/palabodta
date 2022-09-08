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
	// const [wordRows, setWordRows] = useState([
	// 	['B', 'A', 'A', 'N', 'E', 'F'],
	// 	['', '', '', '', '', ''],
	// 	['', '', '', '', '', ''],
	// 	['', '', '', '', '', ''],
	// 	['', '', '', '', '', ''],
	// 	['', '', '', '', '', ''],
	// ]);
	const [wordRows, setWordRows] = useState(InitialRows);
	const [clues, setClues] = useState(InitialRows);
	const [letterPos, setLetterPos] = useState(0);
	const [turno, setTurno] = useState(0);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleSubmit = () => {

		// agarrar la palabra correspondiente al turno
		const theWord = wordRows[turno].join('');
		invoke('check_word', { wordGuess: theWord })
			.then((response) => {
				let stringResponse: string = response as string;
				let newClues = swapArray(turno, clues, [stringResponse.split('')])
				setClues(newClues);
				if (stringResponse.split('').every( (e)=> e === 'o') ) {
					// eslint-disable-next-line no-restricted-globals
					let rta = confirm('Gadaste!');
					if (rta === true) {
						setWordRows(InitialRows);
						setClues(InitialRows);
						setTurno(0);
						setLetterPos(0);
					};

				}

			})
			.catch((error) => console.log(error))
			.finally(() => {
			})
	}

	// que hace esta funcion? (se ejecuta cada vez que se cambia el turno)
	const swapArray = (pos: any, theArray: any, item: any): string[][] => {
		let oldArray: string[][] = theArray.slice(0, pos);
		let newArray = oldArray.concat(item, theArray.slice(pos + 1));

		return newArray;
	}

	const handleKeyDown = useCallback((event: KeyboardEvent) => {
		const { key, keyCode } = event;
		// si es ENTER
		if (keyCode === 13) {
			// TODO: validar cantidad de letras antes del submit o hacer que check_word tire error??
			console.log(wordRows[turno]);
			if ((wordRows[turno].join('').length === 6) && (turno < 6)) {
				handleSubmit();
				setLetterPos(0);
				setTurno(turno + 1);			
			}
	
		}

		if (keyCode === 27) {
			// TODO: validar cantidad de letras antes del submit o hacer que check_word tire error??

			let newWord = swapArray(turno, wordRows, [['','','','','','']]);

			// set state change
			setWordRows(newWord);
			setLetterPos(0);


		}

		if (keyCode >= 65 && keyCode <= 90 && letterPos <=5 && turno < 6) {
			// TODO: tienen que completar la linea del turno actual
		  // alert(`Key pressed ${key} \n Key code Value: ${keyCode}`);

			// update wordRows with the new letter
			// wordRows[0][1] = key;

			let newWord: string[] = new Array().concat(wordRows[turno]);
			newWord[letterPos] = key.toUpperCase();
			let newLetterPos = letterPos + 1;
			
			let newWordRows: string[][] = [newWord]; // "xxoxxox" => ['x', 'x', 'o', 'x', 'x', 'o', 'x']
			let oldWordRows: string[][] = wordRows.slice(0, turno);
			newWordRows = oldWordRows.concat(newWordRows, wordRows.slice(turno + 1));

			setLetterPos(newLetterPos);
			setWordRows(newWordRows);
			
		}
	}, [handleSubmit, letterPos, wordRows, turno]);

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