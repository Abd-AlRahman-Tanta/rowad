<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MyController extends Controller
{
    public function showHome()
    {
        return inertia("Home");
    }
    public function showAbout()
    {
        return inertia("About");
    }
}
