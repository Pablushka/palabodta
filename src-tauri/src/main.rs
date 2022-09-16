#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn create_words_database() {
    // :memory: is a special filename that tells SQLite to create an in-memory database
    let connection = sqlite::open("./palabras.dat").unwrap();
    connection
        .execute("CREATE TABLE words (word VARCHAR(255))")
        .unwrap();

    // read a word from the palabras.json file
    let words: Vec<String> = serde_json::from_str(include_str!("palabras.json")).unwrap();

    println!("Start word insertion");
    for word in words {
        connection
            .execute(format!("INSERT INTO words VALUES ('{}')", word).as_str())
            .unwrap();
    }
    println!("Word insertion finished");
}

fn get_random_word() -> String {
    // https://palabras-aleatorias-public-api.herokuapp.com/random-by-length?length=6

    // Forma 1
    // 1. leer cada palabra del archivo y contar la cantidad de letras (ALTO)
    // 2. crear un archivo nuevo que tenga como key la cantidad de letras de la pabras y la pabra

    // archivo[] = ["banana",...]
    // archivo[] = [ { "6": "banana" }, ... ] (ALTO)

    // Forma 2
    // 1. leer cada palabra del archivo e insertala en un bade de datos
    // 2. hacer la busqueda de palabras por cantidad de letras en la base de datos

    // BASE DE DATOS

    // 1. La app nunca debe depender del motor de base de datos
    // 2. Crear interfaces de conexion a la base de datos

    // Interface de conexion a la base de datos
    //
    // Una funcion para obtener los datos: get_data()
    // Una funcion para insertar los datos: insert_data()
    // Una funcion para actualizar los datos: update_data()
    // Una funcion para eliminar los datos: delete_data()

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
