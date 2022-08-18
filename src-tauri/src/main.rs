#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn get_random_word() -> String {
    // https://palabras-aleatorias-public-api.herokuapp.com/random-by-length?length=6
    let word: &str = "BANANA";
    word.to_string()
}

/// Valida la cantidad de caracteres de word_guess
fn is_word_guess_len_match(word_guess: &str, word: &str) -> bool {
    let word_guess_len = word_guess.len();
    let word_len = word.len();

    println!(
        "{} {} {}",
        word_guess_len,
        word_len,
        word_guess.chars().last().unwrap()
    );

    if word_guess_len == word_len {
        true
    } else {
        false
    }
}

#[tauri::command]
fn check_word(word_guess: String) -> String {
    let word = get_random_word();

    // while !is_word_guess_len_match(&word_guess, &word) {
    //     println!("La palabra tiene {} caracteres", word.len());
    //     word_guess = input_word();
    // }

    // B A N A N A
    // R A B A N O
    // x o ! o o x
    // B A N A N A    'guess_chars

    // Primer validacion: la cantidad de letras de la palabra es igual a la cantidad de letras del guess

    // Segunda validacion: no puede haber simbolos, numeros o espacios en blanco

    let mut guess_chars: Vec<char> = word.chars().collect();

    word.chars().enumerate().for_each(|(i, c)| {
        let test_char = word_guess.chars().nth(i).unwrap();
        if c == test_char {
            guess_chars[i] = 'o';
        } else {
            match word.find(test_char) {
                Some(_) => guess_chars[i] = '!',
                None => guess_chars[i] = 'x',
            };
        }
    });

    format!("{}", guess_chars.iter().collect::<String>())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![check_word])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
