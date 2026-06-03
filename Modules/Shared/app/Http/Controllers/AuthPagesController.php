<?php

namespace Modules\Shared\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthPagesController extends Controller
{
  public function login()
  {
    return Inertia::render("Login");
  }
  public function loginAdmin(Request $request)
  {
    // validate input
    $credentials = $request->validate([
      'email' => ['required', 'email'],
      'password' => ['required'],
    ]);

    // attempt login
    if (!Auth::attempt($credentials)) {
      throw ValidationException::withMessages([
        'email' => __('auth.failed'),
      ]);
    }

    // regenerate session (important for security)
    $request->session()->regenerate();

    return response()->json([
      'message' => __('auth.login_success'),
    ]);
  }
  public function logout(Request $request)
  {
    // Log out user
    Auth::logout();

    // Clear session
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    // ✅ Redirect to login page via Inertia
    return Inertia::location(route('login'));
  }
}
