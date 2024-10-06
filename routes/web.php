<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

Route::get('/', function () {
    return view('welcome'); // Lädt die Blade-Datei welcome.blade.php
});

// Route zum Abrufen der Posts (bereits vorhanden)
Route::get('/posts', function () {
    $filePath = storage_path('posts.json');

    if (!File::exists($filePath)) {
        File::put($filePath, json_encode([]));
    }

    $posts = json_decode(File::get($filePath), true);
    return response()->json($posts);
});

// Route zum Speichern eines neuen Posts (bereits vorhanden)
Route::post('/posts', function (Request $request) {
    $filePath = storage_path('posts.json');
    $posts = json_decode(File::get($filePath), true);

    // Bild-Upload behandeln
    $imagePath = null;
    if ($request->hasFile('image')) {
        $file = $request->file('image');
        $filename = time() . '-' . $file->getClientOriginalName();
        $file->move(public_path('uploads'), $filename);
        $imagePath = '/uploads/' . $filename;
    }

    // Neuen Post hinzufügen
    $newPost = [
        'id' => time(),
        'author' => $request->input('author', 'Anonym'),
        'content' => $request->input('content'),
        'image' => $imagePath // Bildpfad speichern
    ];

    $posts[] = $newPost;

    // Posts wieder in die Datei schreiben
    File::put($filePath, json_encode($posts));

    return response()->json($newPost);
});

Route::post('/clear-posts', function (Request $request) {
    $filePath = storage_path('posts.json');

    // Datei leeren
    File::put($filePath, json_encode([])); // Leere JSON-Datei schreiben

    return response()->json(['message' => 'Alle Posts wurden gelöscht']);
});