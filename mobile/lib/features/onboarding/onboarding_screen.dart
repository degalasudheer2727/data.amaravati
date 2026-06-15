import 'package:flutter/material.dart';
import '../../data/auth.dart';
import '../../data/repository.dart';
import '../../models/models.dart';
import '../../theme.dart';

/// Onboarding / single sign-on. Real Gmail SSO with a demo fallback, then a
/// persona choice that sets the user's access envelope. Optionally carries a
/// [requesting] dataset so sign-in flows straight into a data request.
class OnboardingScreen extends StatefulWidget {
  final AmaraverseRepository repo;
  final Dataset? requesting;
  const OnboardingScreen({super.key, required this.repo, this.requesting});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  bool _busy = false;

  Future<void> _google(AuthController auth) async {
    setState(() => _busy = true);
    final ok = await auth.signInWithGoogle();
    if (!mounted) return;
    setState(() => _busy = false);
    if (!ok) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text(
            'Google sign-in isn’t configured for this build yet — continuing with a demo identity.'),
      ));
      auth.signInDemo();
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = AuthScope.of(context);
    final ds = widget.requesting;
    return Scaffold(
      appBar: AppBar(
        leading: const CloseButton(),
        title: const Text('Sign in'),
      ),
      body: AnimatedBuilder(
        animation: auth,
        builder: (context, _) {
          return SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(22, 8, 22, 28),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const _Seal(),
                  const SizedBox(height: 18),
                  const Text('data.amaravati · Single sign-on',
                      style: TextStyle(
                          color: AppColors.saffron,
                          fontSize: 11,
                          letterSpacing: 2.2,
                          fontWeight: FontWeight.w600)),
                  const SizedBox(height: 10),
                  Text(
                      auth.isSignedIn
                          ? 'Choose your persona'
                          : 'Sign in to request data',
                      style: AppTheme.display(28)),
                  const SizedBox(height: 6),
                  Text('అమరావతి డేటా · ప్రవేశం', style: AppTheme.telugu(15)),
                  const SizedBox(height: 14),
                  if (ds != null) _DatasetContext(ds),
                  const SizedBox(height: 18),
                  if (!auth.isSignedIn)
                    _SignIn(
                        busy: _busy,
                        onGoogle: () => _google(auth),
                        onDemo: auth.signInDemo)
                  else
                    _PersonaPicker(
                        repo: widget.repo, auth: auth, requesting: ds),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _DatasetContext extends StatelessWidget {
  final Dataset ds;
  const _DatasetContext(this.ds);
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(12),
        border: const Border.fromBorderSide(BorderSide(color: AppColors.line)),
      ),
      child: Row(children: [
        Icon(Icons.dataset_outlined, color: ds.classification.color, size: 20),
        const SizedBox(width: 12),
        Expanded(
          child: Text.rich(
              TextSpan(children: [
                const TextSpan(text: 'Requesting '),
                TextSpan(
                    text: ds.title,
                    style: const TextStyle(fontWeight: FontWeight.w600)),
                TextSpan(text: '  ·  ${ds.entity}'),
              ]),
              style: const TextStyle(color: AppColors.muted, fontSize: 13)),
        ),
      ]),
    );
  }
}

class _SignIn extends StatelessWidget {
  final bool busy;
  final VoidCallback onGoogle;
  final VoidCallback onDemo;
  const _SignIn(
      {required this.busy, required this.onGoogle, required this.onDemo});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Text(
            'One Google account unlocks the open catalogue, your persona’s access envelope and your request history.',
            style: TextStyle(color: AppColors.muted, height: 1.5)),
        const SizedBox(height: 22),
        FilledButton.icon(
          onPressed: busy ? null : onGoogle,
          style: FilledButton.styleFrom(
            backgroundColor: Colors.white,
            foregroundColor: const Color(0xFF1F2329),
            padding: const EdgeInsets.symmetric(vertical: 15),
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          icon: busy
              ? const SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(strokeWidth: 2))
              : const Icon(Icons.g_mobiledata, size: 26),
          label: Text(busy ? 'Signing in…' : 'Continue with Google',
              style: const TextStyle(fontWeight: FontWeight.w600)),
        ),
        const SizedBox(height: 12),
        OutlinedButton(
          onPressed: busy ? null : onDemo,
          style: OutlinedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 14),
            side: const BorderSide(color: AppColors.line),
            foregroundColor: AppColors.text,
          ),
          child: const Text('Continue with a demo identity'),
        ),
        const SizedBox(height: 16),
        const Text(
            'data.amaravati is a concept — not an official government service. By continuing you accept the concept terms and the data-sharing code of conduct.',
            style: TextStyle(
                color: AppColors.muted2, fontSize: 11.5, height: 1.6)),
      ],
    );
  }
}

class _PersonaPicker extends StatelessWidget {
  final AmaraverseRepository repo;
  final AuthController auth;
  final Dataset? requesting;
  const _PersonaPicker(
      {required this.repo, required this.auth, this.requesting});

  void _submit(BuildContext context) {
    final ds = requesting;
    if (ds != null) {
      final access =
          repo.personaByKey(auth.user!.personaKey).accessFor(ds.classification);
      Navigator.of(context).pop();
      final msg = switch (access) {
        Access.instant =>
          'Instant access granted to “${ds.title}”. API key & download issued.',
        Access.agreement =>
          'Request for “${ds.title}” routed to the data steward (agreement needed).',
        Access.closed =>
          '“${ds.title}” is closed for your persona; a steward review was logged.',
      };
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
    } else {
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = auth.user!;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
            'Welcome, ${user.name.split(' ').first}. Your persona sets a default access envelope across the four confidentiality tiers.',
            style: const TextStyle(color: AppColors.muted, height: 1.5)),
        const SizedBox(height: 18),
        ...repo.personas().map((p) {
          final selected = p.key == user.personaKey;
          return Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: InkWell(
              borderRadius: BorderRadius.circular(14),
              onTap: () => auth.selectPersona(p.key),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.fromBorderSide(BorderSide(
                      color: selected ? AppColors.gold : AppColors.line,
                      width: selected ? 1.5 : 1)),
                ),
                child: Row(children: [
                  Icon(p.icon,
                      color: selected ? AppColors.gold : AppColors.muted),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(p.title,
                              style: const TextStyle(
                                  fontWeight: FontWeight.w600, fontSize: 15)),
                          const SizedBox(height: 2),
                          Text(p.description,
                              style: const TextStyle(
                                  color: AppColors.muted, fontSize: 12.5)),
                        ]),
                  ),
                  if (selected)
                    const Icon(Icons.check_circle,
                        color: AppColors.gold, size: 20),
                ]),
              ),
            ),
          );
        }),
        const SizedBox(height: 8),
        FilledButton(
          onPressed: () => _submit(context),
          style: FilledButton.styleFrom(
            backgroundColor: AppColors.saffron,
            foregroundColor: const Color(0xFF1A1205),
            padding: const EdgeInsets.symmetric(vertical: 15),
          ),
          child: Text(
              requesting != null ? 'Submit request →' : 'Enter the nexus →'),
        ),
        const SizedBox(height: 10),
        TextButton(
          onPressed: () async {
            await auth.signOut();
          },
          child:
              const Text('Sign out', style: TextStyle(color: AppColors.muted)),
        ),
      ],
    );
  }
}

class _Seal extends StatelessWidget {
  const _Seal();
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 46,
      height: 46,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: AppColors.gold, width: 2),
      ),
      child: const Icon(Icons.brightness_7, color: AppColors.pulse, size: 24),
    );
  }
}
