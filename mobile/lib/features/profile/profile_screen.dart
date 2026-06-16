import 'package:flutter/material.dart';
import '../../data/auth.dart';
import '../../data/repository.dart';
import '../../models/models.dart';
import '../../theme.dart';
import '../../widgets/common.dart';
import '../futures/futures_screen.dart';
import '../onboarding/onboarding_screen.dart';

class ProfileScreen extends StatelessWidget {
  final AmaraverseRepository repo;
  const ProfileScreen({super.key, required this.repo});

  @override
  Widget build(BuildContext context) {
    final auth = AuthScope.of(context);
    return AnimatedBuilder(
      animation: auth,
      builder: (context, _) {
        final user = auth.user;
        final persona =
            user == null ? null : repo.personaByKey(user.personaKey);
        return ListView(
          padding: const EdgeInsets.fromLTRB(20, 64, 20, 28),
          children: [
            const SectionHeader(kicker: 'You', title: 'Your access'),
            const SizedBox(height: 18),

            // identity / session
            GlassCard(
              accent: AppColors.saffron,
              child: Row(children: [
                CircleAvatar(
                  radius: 26,
                  backgroundColor: AppColors.surfaceHi,
                  backgroundImage: (user?.photoUrl != null)
                      ? NetworkImage(user!.photoUrl!)
                      : null,
                  child: (user?.photoUrl == null)
                      ? Icon(persona?.icon ?? Icons.person,
                          color: AppColors.gold)
                      : null,
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(user?.name ?? 'Guest',
                            style: AppTheme.display(18)),
                        const SizedBox(height: 2),
                        Text(
                            user == null
                                ? 'Not signed in'
                                : '${persona!.title} · ${user.email}',
                            style: const TextStyle(
                                color: AppColors.muted, fontSize: 12)),
                      ]),
                ),
                if (user != null)
                  IconButton(
                    tooltip: 'Sign out',
                    icon: const Icon(Icons.logout, color: AppColors.muted),
                    onPressed: auth.signOut,
                  ),
              ]),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                onPressed: () => Navigator.of(context).push(MaterialPageRoute(
                    builder: (_) => OnboardingScreen(repo: repo))),
                style: FilledButton.styleFrom(
                  backgroundColor: AppColors.saffron,
                  foregroundColor: const Color(0xFF1A1205),
                  padding: const EdgeInsets.symmetric(vertical: 13),
                ),
                icon: Icon(user == null ? Icons.login : Icons.swap_horiz,
                    size: 18),
                label: Text(
                    user == null ? 'Sign in with Google' : 'Switch persona'),
              ),
            ),

            const SizedBox(height: 26),
            const SectionHeader(
                kicker: 'Data classification', title: 'How access is governed'),
            const SizedBox(height: 14),
            ...repo.classes().map((t) => _TierRow(tier: t, persona: persona)),

            const SizedBox(height: 16),
            GlassCard(
              accent: AppColors.gold,
              onTap: () => Navigator.of(context).push(MaterialPageRoute(
                  builder: (_) => Scaffold(
                        appBar: AppBar(title: const Text('Future roadmap')),
                        body: FuturesScreen(repo: repo),
                      ))),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              child: const Row(children: [
                Icon(Icons.rocket_launch, size: 20, color: AppColors.gold),
                SizedBox(width: 14),
                Expanded(
                    child: Text('The digital city of 2040',
                        style: TextStyle(fontSize: 14))),
                Icon(Icons.chevron_right, size: 18, color: AppColors.muted2),
              ]),
            ),

            const SizedBox(height: 16),
            const Text(
              'data.amaravati is a concept — not an official Government of Andhra Pradesh or APCRDA product, and not endorsed by either. Datasets are illustrative samples; all figures indicative.',
              style:
                  TextStyle(color: AppColors.muted2, fontSize: 11, height: 1.6),
            ),
          ],
        );
      },
    );
  }
}

class _TierRow extends StatelessWidget {
  final ClassTier tier;
  final Persona? persona;
  const _TierRow({required this.tier, this.persona});

  @override
  Widget build(BuildContext context) {
    final access = persona?.accessFor(tier.kind);
    final c = tier.kind.color;
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border(left: BorderSide(color: c, width: 3)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(children: [
              ClassBadge(tier.kind),
              const Spacer(),
              if (access != null) _accessChip(access),
            ]),
            const SizedBox(height: 8),
            Text(tier.description,
                style: const TextStyle(
                    color: AppColors.muted, fontSize: 12.5, height: 1.4)),
            const SizedBox(height: 8),
            Text(tier.path,
                style: const TextStyle(
                    color: AppColors.muted2, fontSize: 11, height: 1.5)),
          ],
        ),
      ),
    );
  }

  Widget _accessChip(Access a) {
    final (label, color) = switch (a) {
      Access.instant => ('You: instant', const Color(0xFF5AD17A)),
      Access.agreement => ('You: agreement', AppColors.gold),
      Access.closed => ('You: closed', AppColors.muted2),
    };
    return Text(label,
        style: TextStyle(
            color: color, fontSize: 10.5, fontWeight: FontWeight.w600));
  }
}
