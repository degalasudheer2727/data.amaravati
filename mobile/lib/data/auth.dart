import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../models/models.dart';

/// Session + onboarding state for data.amaravati.
///
/// Wraps real Google Sign-In (`google_sign_in`). On platforms/configurations
/// where Google isn't wired yet, [signInWithGoogle] returns `false` and the UI
/// offers a demo identity so the onboarding flow stays explorable. To go fully
/// live, configure the Google OAuth client for each platform:
///   • Android: add `google-services.json` (OAuth client + SHA-1).
///   • iOS: add the reversed-client-id URL scheme to Info.plist.
///   • Web: add `<meta name="google-signin-client_id" content="…">` to web/index.html.
class AuthController extends ChangeNotifier {
  AuthController();

  final GoogleSignIn _google = GoogleSignIn(scopes: const ['email', 'profile']);

  AppUser? _user;
  AppUser? get user => _user;
  bool get isSignedIn => _user != null;

  /// Attempt real Gmail sign-in. Returns false if cancelled or unavailable
  /// (e.g. the OAuth client isn't configured for this platform yet).
  Future<bool> signInWithGoogle() async {
    try {
      final account = await _google.signIn();
      if (account == null) return false; // user cancelled
      _user = AppUser(
        name: account.displayName ?? account.email,
        email: account.email,
        photoUrl: account.photoUrl,
        personaKey: _user?.personaKey ?? 'citizen',
      );
      notifyListeners();
      return true;
    } catch (_) {
      // Google not configured for this platform — caller falls back to demo.
      return false;
    }
  }

  /// Demo identity so the flow is explorable before the OAuth client is set.
  void signInDemo() {
    _user = const AppUser(
      name: 'Demo Citizen',
      email: 'demo@data.amaravati',
      personaKey: 'citizen',
      demo: true,
    );
    notifyListeners();
  }

  void selectPersona(String key) {
    if (_user == null) return;
    _user = _user!.copyWith(personaKey: key);
    notifyListeners();
  }

  Future<void> signOut() async {
    try {
      await _google.signOut();
    } catch (_) {/* demo / unconfigured */}
    _user = null;
    notifyListeners();
  }
}

/// Exposes the [AuthController] to the widget tree.
class AuthScope extends InheritedNotifier<AuthController> {
  const AuthScope(
      {super.key, required AuthController controller, required super.child})
      : super(notifier: controller);

  static AuthController of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<AuthScope>();
    assert(scope != null, 'AuthScope.of() called with no AuthScope above');
    return scope!.notifier!;
  }
}
