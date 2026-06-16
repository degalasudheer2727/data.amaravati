import 'package:flutter/material.dart';
import 'data/auth.dart';
import 'data/repository.dart';
import 'root_nav.dart';
import 'theme.dart';

class AmaraverseApp extends StatefulWidget {
  const AmaraverseApp({super.key});

  @override
  State<AmaraverseApp> createState() => _AmaraverseAppState();
}

class _AmaraverseAppState extends State<AmaraverseApp> {
  // Session/onboarding controller, owned at the composition root so the signed-in
  // identity and persona survive tab switches.
  final AuthController _auth = AuthController();

  @override
  void dispose() {
    _auth.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Single composition root: swap MockRepository for an ApiRepository here
    // to go live — no screen changes required.
    const AmaraverseRepository repo = MockRepository();
    return MaterialApp(
      title: 'data.amaravati',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark,
      home: AuthScope(
        controller: _auth,
        child: const RootNav(repo: repo),
      ),
    );
  }
}
