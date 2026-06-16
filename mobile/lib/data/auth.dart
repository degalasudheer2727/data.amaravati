import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import '../models/models.dart';

/// Session + onboarding state for data.amaravati.
///
/// Production Google Sign-In via `google_sign_in`. Configure the OAuth client
/// per platform:
///   • Android: add `google-services.json` (OAuth client + SHA-1).
///   • iOS: add the reversed-client-id URL scheme to Info.plist.
///   • Web: add `<meta name="google-signin-client_id" content="…">` to web/index.html.
class AuthController extends ChangeNotifier {
  AuthController();

  final GoogleSignIn _google = GoogleSignIn(scopes: const ['email', 'profile']);

  AppUser? _user;
  AppUser? get user => _user;
  bool get isSignedIn => _user != null;

  /// Gmail sign-in. Returns false if the user cancels. Throws if Google Sign-In
  /// fails (e.g. the OAuth client isn't configured) so the UI can surface it.
  Future<bool> signInWithGoogle() async {
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
